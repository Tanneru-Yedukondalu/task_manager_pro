# app.py
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager  # Import JWTManager
from routes.add_tasks import tasks_blueprint
from routes.signup import signup_blueprint
from routes.login import login_blueprint
from routes.kanban import kanban_blueprint
# from routes.profile import profile_blueprint
from dotenv import load_dotenv
from config import Config
from sockets import initialize_socket  # Import the function to initialize the socket

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Enable CORS for the app (allow connections from localhost:5173)
CORS(app, origins=["https://10.50.48.11:5173"], allow_headers=["Content-Type", "Authorization"])

# Initialize JWTManager with the Flask app
app.config['JWT_SECRET_KEY'] = Config.JWT_SECRET_KEY  # Make sure this is defined in your config.py
jwt = JWTManager(app)  # Initialize JWTManager here

# Initialize Socket.IO (calling the function from sockets.py)
socketio = initialize_socket(app)

# Register blueprints with the Flask app
app.register_blueprint(tasks_blueprint)
app.register_blueprint(signup_blueprint)
app.register_blueprint(login_blueprint)
app.register_blueprint(kanban_blueprint)
# app.register_blueprint(profile_blueprint)

# Health check route
@app.route('/health', methods=['GET'])
def health_check():
    return {"status": "ok", "message": "Server is running"}, 200

if __name__ == "__main__":
    # socketio.run(app, host="0.0.0.0", debug=True, port=5000)
    socketio.run(app, port=5000, host="0.0.0.0", debug=False, ssl_context=('/home/mv/Desktop/Task_Manager_Pro/cert.pem', '/home/mv/Desktop/Task_Manager_Pro/key.pem'))
