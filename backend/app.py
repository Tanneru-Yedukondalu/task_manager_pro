from flask import Flask
from flask_cors import CORS 
from routes.add_tasks import tasks_blueprint  # Import the blueprint
from dotenv import load_dotenv  # Import load_dotenv to load .env file

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Register the blueprint with the Flask app

app.register_blueprint(tasks_blueprint)

# Health check route
@app.route('/health', methods=['GET'])
def health_check():
    return {"status": "ok", "message": "Server is running"}, 200

if __name__ == "__main__":
    app.run(debug=True, port = 5001)
