from flask import Blueprint, jsonify
from database import get_all_users  # Import the function to fetch all users

# Create a Blueprint for the users route
all_users_blueprint = Blueprint('users', __name__)

# Route for fetching all users
@all_users_blueprint.route('/users', methods=['GET'])
def fetch_all_users():
    try:
        users = get_all_users()  # Call the function to fetch all users
        return jsonify(users), 200  # Return the list as JSON with a 200 status code
    except Exception as e:
        return jsonify({"error": str(e)}), 500  # Handle any exceptions
