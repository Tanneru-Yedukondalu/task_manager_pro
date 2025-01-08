# from flask import Blueprint, request, jsonify
# from database import get_db  # Import the get_db function


# # Create a Blueprint for the tasks route
# tasks_blueprint = Blueprint('tasks', __name__)

# # Get the database connection
# db = get_db()

# # Get the tasks collection from the database
# tasks_collection = db.get_collection("tasks")

# # Route for handling tasks
# @tasks_blueprint.route('/tasks', methods=['POST', 'GET'])
# def handle_tasks():
#     if request.method == 'POST':
#         # Handle POST request to add a task
#         try:
#             data = request.get_json()

#             # Ensure all fields are provided
#             required_fields = ["taskName", "description", "category", "deadline", "createdOn"]
#             if not all(field in data for field in required_fields):
#                 return jsonify({"error": "Missing required fields"}), 400

#             # Insert the task into the MongoDB collection
#             task_data = {
#                 "taskName": data["taskName"],
#                 "description": data["description"],
#                 "category": data["category"],
#                 "deadline": data["deadline"],
#                 "createdOn": data["createdOn"],
#                 "status" : data['status']
#             }
#             tasks_collection.insert_one(task_data)

#             return jsonify({"message": "Task added successfully!"}), 201
#         except Exception as e:
#             return jsonify({"error": str(e)}), 500

#     elif request.method == 'GET':
#         # Handle GET request to fetch tasks
#         try:
#             tasks = list(tasks_collection.find({}, {"_id": 0}))  # Exclude the MongoDB ID
#             return jsonify(tasks), 200
#         except Exception as e:
#             return jsonify({"error": str(e)}), 500

# # Update tasks route
# @tasks_blueprint.route('/tasks/update', methods=['PUT'])
# def update_tasks():
#     try:
#         data = request.get_json()
#         tasks = data.get('tasks', [])

#         if not tasks:
#             return jsonify({"error": "No tasks provided to update"}), 400
        
#         # Loop through each task and update in the MongoDB collection
#         for task_data in tasks:
#             # Find the task by its identifier (assuming it's 'taskName' or another unique field)
#             task = tasks_collection.find_one({"taskName": task_data['taskName']})

#             if task:
#                 # Update the task in the collection
#                 tasks_collection.update_one(
#                     {"taskName": task_data['taskName']},
#                     {"$set": {
#                         "taskName": task_data['taskName'],
#                         "description": task_data['description'],
#                         "category": task_data['category'],
#                         "deadline": task_data['deadline'],
#                         "createdOn": task_data['createdOn'],
#                         "status" : task_data['status']
#                     }}
#                 )
#             else:
#                 return jsonify({"message": f"Task with taskName {task_data['taskName']} not found"}), 404

#         return jsonify({"message": "Tasks updated successfully"}), 200

#     except Exception as e:
#         return jsonify({"message": "Error updating tasks", "error": str(e)}), 500


# # DELETE method to delete tasks
# @tasks_blueprint.route('/tasks/delete', methods=['DELETE'])
# def delete_tasks():
#     try:
#         data = request.get_json()
#         task_names = data.get('taskNames', [])  # Make sure it is 'taskNames' as plural

#         if not task_names:
#             return jsonify({"error": "No tasks provided to delete"}), 400
        
#         # Loop through the task names and delete each task
#         for task_name in task_names:
#             result = tasks_collection.delete_one({"taskName": task_name})

#             if result.deleted_count == 0:
#                 return jsonify({"message": f"Task with taskName {task_name} not found"}), 404
        
#         return jsonify({"message": "Tasks deleted successfully"}), 200

#     except Exception as e:
#         return jsonify({"message": "Error deleting tasks", "error": str(e)}), 500






from flask import Blueprint, request, jsonify
from database import get_db 
import jwt  # Import the get_db function

# Create a Blueprint for the tasks route
tasks_blueprint = Blueprint('tasks', __name__)

# Get the database connection
db = get_db()

# Get the tasks collection from the database
tasks_collection = db.get_collection("tasks")

# Route for handling tasks
@tasks_blueprint.route('/tasks', methods=['POST', 'GET'])
def handle_tasks():
    if request.method == 'GET':
        try:
            # Get the access_token from the Authorization header
            access_token = request.headers.get('Authorization')

            if not access_token:
                return jsonify({"error": "Access token is missing"}), 400

            # Remove "Bearer " prefix from the access_token (if it exists)
            if access_token.startswith('Bearer '):
                access_token = access_token[7:]

            # Decode the access_token to get the user ID
            decoded_token = jwt.decode(access_token, 'task_manager_pro', algorithms=["HS256"])
            print(decoded_token)  # Debugging: check the token content

            user_id = decoded_token.get('sub')  # Use 'sub' field for user ID


            if not user_id:
                return jsonify({"error": "User ID is missing from token"}), 400

            # Fetch tasks for this user
            tasks = list(tasks_collection.find({"user_id": user_id}, {"_id": 0}))  # Exclude the MongoDB ID
            return jsonify(tasks), 200
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Access token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid access token"}), 401
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    elif request.method == 'POST':
         # Handle POST request to create a task
        try:
            task_data = request.get_json()

            # Ensure all fields are provided
            required_fields = ["taskName", "description", "category", "deadline", "createdOn", "status", "user_id"]
            if not all(field in task_data for field in required_fields):
                return jsonify({"error": "Missing required fields"}), 400

            # Insert the task into the MongoDB collection
            task_to_insert = {
                "taskName": task_data["taskName"],
                "description": task_data["description"],
                "category": task_data["category"],
                "deadline": task_data["deadline"],
                "createdOn": task_data["createdOn"],
                "status": task_data["status"],
                "user_id": task_data["user_id"],  # Ensure user_id is included
            }

            # Insert task into the database
            tasks_collection.insert_one(task_to_insert)

            return jsonify({"message": "Task created successfully!"}), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 500


# Update tasks route
@tasks_blueprint.route('/tasks/update', methods=['PUT'])
def update_tasks():
    try:
        data = request.get_json()
        tasks = data.get('tasks', [])

        if not tasks:
            return jsonify({"error": "No tasks provided to update"}), 400
        
        # Loop through each task and update in the MongoDB collection
        for task_data in tasks:
            user_id = task_data.get('user_id')  # Ensure the task belongs to the correct user

            if not user_id:
                return jsonify({"error": "User ID is required to update task"}), 400

            task = tasks_collection.find_one({"taskName": task_data['taskName'], "user_id": user_id})  # Check user_id too

            if task:
                # Update the task in the collection
                tasks_collection.update_one(
                    {"taskName": task_data['taskName'], "user_id": user_id},
                    {"$set": {
                        "taskName": task_data['taskName'],
                        "description": task_data['description'],
                        "category": task_data['category'],
                        "deadline": task_data['deadline'],
                        "createdOn": task_data['createdOn'],
                        "status": task_data['status']
                    }}
                )
            else:
                return jsonify({"message": f"Task with taskName {task_data['taskName']} not found for this user"}), 404

        return jsonify({"message": "Tasks updated successfully"}), 200

    except Exception as e:
        return jsonify({"message": "Error updating tasks", "error": str(e)}), 500


# DELETE method to delete tasks
@tasks_blueprint.route('/tasks/delete', methods=['DELETE'])
def delete_tasks():
    try:
        access_token = request.headers.get('Authorization')
        if access_token.startswith('Bearer '):
            access_token = access_token[7:]
        decoded_token = jwt.decode(access_token, 'task_manager_pro', algorithms=["HS256"])
        user_id = decoded_token.get('sub')

        data = request.get_json()
        task_names = data.get('taskNames', [])

        if not task_names:
            return jsonify({"error": "No tasks provided to delete"}), 400

        # Delete tasks for the authenticated user
        for task_name in task_names:
            result = tasks_collection.delete_one({"taskName": task_name, "user_id": user_id})
            if result.deleted_count == 0:
                return jsonify({"message": f"Task with taskName {task_name} not found for this user"}), 404

        return jsonify({"message": "Tasks deleted successfully"}), 200

    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Access token has expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid access token"}), 401
    except Exception as e:
        return jsonify({"message": "Error deleting tasks", "error": str(e)}), 500
