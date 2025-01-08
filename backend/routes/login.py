from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from database import get_user_by_email, get_user_by_id

# Create a Blueprint for the login route
login_blueprint = Blueprint('login', __name__)

# Login route for generating JWT tokens
@login_blueprint.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()  # Parse JSON body
        email = data.get('email')
        password = data.get('password')

        # Fetch user from your database using the function from database.py
        user = get_user_by_email(email)
        username = data.get('username')

        if not user or not check_password_hash(user['password'], password):
            return jsonify({"msg": "Invalid credentials"}), 401

        # Generate JWT token
        access_token = create_access_token(identity=str(user['_id']), expires_delta=None)  # Use the correct user identifier
        
        # Return token and user_id
        return jsonify(access_token=access_token, username=user['username'], user_id=str(user['_id'])), 200
    except Exception as e:
        return jsonify({"msg": "An error occurred", "error": str(e)}), 500


# Route to fetch user profile details
@login_blueprint.route('/profile', methods=['GET'])
@jwt_required()  # Protect the route with JWT authentication
def fetch_profile():
    try:
        # Get the user ID from the JWT token
        user_id = get_jwt_identity()

        # Fetch the user details from the database using the user ID
        user = get_user_by_id(user_id)
        
        if not user:
            return jsonify({"msg": "User not found"}), 404

        # Prepare the user profile data
        profile_data = {
            "username": user["username"],
            "email": user["email"],
            "created_at": user["created_at"],
            # "image": user["profile_image"],  # Assuming the profile image is stored in the user document
            "first_name": user.get("first_name", ""),
            "last_name": user.get("last_name", ""),
            "role": user.get("role", ""),
            # Add any other profile details you want to display
        }

        # Return the profile details as a response
        return jsonify(profile_data), 200

    except Exception as e:
        return jsonify({"msg": "An error occurred", "error": str(e)}), 500
