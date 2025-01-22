# sockets.py
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask import request
from database import save_message, groups_collection
from datetime import datetime




# Dictionary to store online users
users = {}

groups = {}  # Dictionary to store group information {group_name: [members]}

def load_groups_from_db():
    """Load groups from the database into the in-memory groups dictionary."""
    global groups
    groups.clear()  # Clear the dictionary to prevent duplicates
    all_groups = groups_collection.find()  # Fetch all groups from the database
    for group in all_groups:
        group_name = group.get('group_name')  # Use 'group_name' instead of 'name'
        members = group.get('members', [])  # Default to an empty list if 'members' is missing
        if group_name:  # Ensure group_name exists before adding to the dictionary
            groups[group_name] = members
    print(f"Loaded groups from database: {groups}")




def initialize_socket(app):
    """Initialize the socket with the Flask app."""
    socketio = SocketIO(app, cors_allowed_origins="https://10.50.48.11:5173")  # Allow connections from frontend

    # Load groups from the database when the backend starts
    load_groups_from_db()

    @socketio.on('connect')
    def handle_connect():
        """Handle when a user connects to the WebSocket server."""
        print("User connected.")

    @socketio.on('login')
    def handle_login(data):
        """Handle user login."""
        username = data.get('username')
        if username:
            users[username] = request.sid  # Store user in dictionary with socket ID
            print(f"{username} logged in.")
            # Broadcast to all clients about the new online user
            emit('user_online', list(users.keys()), broadcast=True)


            # Fetch groups this user belongs to
            user_groups = groups_collection.find({'members': username})

             # Send all groups this user is part of
            user_groups = [group for group, members in groups.items() if username in members]
            for group in user_groups:
                emit('new_group', {'groupName': group, 'members': groups[group]}, room=users[username])

    @socketio.on('send_message')
    def handle_message(data):
        """Handle sending a message to another user or group."""
        message = data.get('message')
        receiver = data.get('receiver')
        sender = data.get('sender')
        group = data.get('group')

        print(f"Message received: {message} from {sender} to {receiver}")

        save_message(sender, receiver, message, group)

        if group:  # Handle group messages
            if group in groups:
                print(f"Broadcasting message to group: {group}")
                for member in groups[group]:
                    if member != sender and member in users:
                        emit('receive_message', {
                            'sender': sender,
                            'message': message,
                            'group': group
                        }, room=users[member])
            else:
                print(f"Group {group} not found.")
        elif receiver in users:  # Handle individual messages
            print(f"Sending message to user: {receiver}")
            emit('receive_message', {
                'sender': sender,
                'message': message,
                'group': None
            }, room=users[receiver])
        else:
            print(f"Receiver {receiver} not found.")

    @socketio.on('start_call')
    def handle_start_call(data):
        """Handle initiating a video call."""
        receiver = data.get('receiver')
        offer = data.get('offer')
        caller = None
        for user, sid in users.items():
            if sid == request.sid:
                caller = user
                break

        if receiver in users:
            print(f"{caller} is calling {receiver}")
            emit('incoming_call', {'caller': caller, 'offer': offer}, room=users[receiver])
        else:
            print(f"Receiver {receiver} not found for video call.")


    @socketio.on('answer_call')
    def handle_answer_call(data):
        """Handle answering a video call."""
        answer = data.get('answer')
        caller = data.get('to')
        
        if caller in users:
            print(f" Received Call answer to {caller}")
            # Send the answer back to the caller
            emit('receive_answer', {'answer': answer}, room=users[caller])
        else:
            print(f"Caller {caller} not found.")



    @socketio.on('reject_call')
    def handle_reject_call(data):
        """Handle rejecting a video call."""
        receiver = data.get('to')
        caller = None

        # Find who is rejecting the call
        for user, sid in users.items():
            if sid == request.sid:
                caller = user
                break

        if receiver in users:
            print(f"{caller} rejected the call.")  # Log the correct rejection
            # Emit the 'call_rejected' event to the caller with the correct 'from' data
            emit('call_rejected', {'from': receiver}, room=users[caller])  # Send 'receiver' as the one who rejected the call
        else:
            print(f"Receiver {receiver} not found.")




    @socketio.on('ice-candidate')
    def handle_ice_candidate(data):
        """Handle ICE candidate exchange."""
        candidate = data.get('candidate')
        receiver = data.get('to')

        if receiver in users:
            print(f"Sending ICE candidate to {receiver}")
            emit('ice-candidate', {'candidate': candidate}, room=users[receiver])  # Forward as-is
        else:
            print(f"Receiver {receiver} not found for ICE candidate exchange.")


    @socketio.on('call_ended')
    def handle_call_ended(data):
        receiver = data.get('to')
        print(f"Emitting call_ended event to: {receiver}")

        caller = None
        for user, sid in users.items():
            if sid == request.sid:
                caller = user
                break

        if receiver in users:
            print(f"{caller} ended the call with {receiver}")
            emit('call_ended', {'from': caller}, room=users[receiver])
        else:
            print(f"Receiver {receiver} not found.")
        emit('call_ended', {'from': 'self'}, room=request.sid)






    @socketio.on('create_group')
    def handle_create_group(data):
        group_name = data.get('groupName')
        members = data.get('members')
        creator = None

        # Identify the creator of the group
        for user, sid in users.items():
            if sid == request.sid:
                creator = user
                break

        if group_name and members:
            # Add the creator to the members list if not already included
            if creator and creator not in members:
                members.append(creator)

            # Save the group to the database
            group_data = {
                'group_name': group_name,
                'members': members,
                'created_at': datetime.utcnow()  # Add a timestamp for group creation
            }

             # Insert the group data into the database
            result = groups_collection.insert_one(group_data)

            groups[group_name] = members
            print(f"Group created: {group_name} with members {members}")

            # Notify all group members about the new group
            for member in members:
                if member in users:
                    emit('new_group', {'groupName': group_name, 'members': members}, room=users[member])
                else:
                    print(f"User {member} is not currently online to receive group notification.")



    @socketio.on('disconnect')
    def handle_disconnect():
        """Handle user disconnection."""
        for user, socket_id in users.items():
            if socket_id == request.sid:
                del users[user]  # Remove the user from the online list
                print(f"{user} disconnected.")
                # Broadcast updated user list to all clients
                emit('user_online', list(users.keys()), broadcast=True)
                break

    return socketio
