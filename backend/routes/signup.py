# from flask import Blueprint, request, jsonify
# from werkzeug.security import generate_password_hash
# from bson import ObjectId
# from database import get_db  # Import the function to get the DB instance

# signup_blueprint = Blueprint('signup', __name__)

# @signup_blueprint.route('/signup', methods=['POST'])
# def signup():
#     data = request.get_json()
#     username = data.get('username')
#     email = data.get('email')
#     password = data.get('password')

#     # Validate input data
#     if not username or not email or not password:
#         return jsonify({"error": "All fields are required"}), 400

#     # Get the users collection from the database
#     db = get_db()
#     users_collection = db['users']  # Access the 'users' collection

#     # Check if email already exists in the database
#     existing_user = users_collection.find_one({"email": email})
#     if existing_user:
#         return jsonify({"error": "Email is already taken"}), 400

#     # Hash the password before saving to the database
#     hashed_password = generate_password_hash(password)

#     # Create new user document
#     new_user = {
#         "username": username,
#         "email": email,
#         "password": hashed_password
#     }

#     # Insert new user into the database
#     users_collection.insert_one(new_user)

#     return jsonify({"message": "User created successfully"}), 201




from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from datetime import datetime  # To set the created_at field
from database import get_db

signup_blueprint = Blueprint('signup', __name__)

@signup_blueprint.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    first_name = data.get('first_name', '')  # New field
    last_name = data.get('last_name', '')    # New field
    role = data.get('role', 'user')  # Default to 'user' if no role is provided

    # Validate input data
    if not username or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    # Get the users collection from the database
    db = get_db()
    users_collection = db['users']

    # Check if email already exists in the database
    existing_user = users_collection.find_one({"email": email})
    if existing_user:
        return jsonify({"error": "Email is already taken"}), 400

    # Hash the password before saving to the database
    hashed_password = generate_password_hash(password)

    # Create new user document
    new_user = {
        "username": username,
        "email": email,
        "password": hashed_password,
        "first_name": first_name,
        "last_name": last_name,
        "role": role,
        "created_at": datetime.utcnow()  # Set created_at to the current UTC time
    }
    print(f"Received first_name: {first_name}, last_name: {last_name}")


    # Insert new user into the database
    users_collection.insert_one(new_user)
    print(new_user)

    return jsonify({"message": "User created successfully"}), 201


