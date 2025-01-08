# sockets.py
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask import request

# Dictionary to store online users
users = {}

def initialize_socket(app):
    """Initialize the socket with the Flask app."""
    socketio = SocketIO(app, cors_allowed_origins="http://localhost:5173")  # Allow connections from frontend
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
