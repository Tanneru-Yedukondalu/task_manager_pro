# sockets.py
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask import request


# Dictionary to store online users
users = {}

def initialize_socket(app):
    """Initialize the socket with the Flask app."""
    socketio = SocketIO(app, cors_allowed_origins="https://10.50.48.11:5173")  # Allow connections from frontend



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

    @socketio.on('send_message')
    def handle_message(data):
        """Handle sending a message to another user."""
        message = data.get('message')
        receiver = data.get('receiver')
        sender = data.get('sender')

        print(f"Message received: {message} from {sender} to {receiver}")  # Check if the message is received

        if receiver in users:
            # Emit the message to the receiver
            emit('receive_message', {'sender': sender, 'message': message}, room=users[receiver])
        else:
            print(f"Receiver {receiver} not found in users")


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
