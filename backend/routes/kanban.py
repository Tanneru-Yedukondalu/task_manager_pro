from flask import Blueprint, jsonify
from database import get_db
from bson import ObjectId

# Create a Blueprint for the Kanban board tasks
kanban_blueprint = Blueprint('kanban', __name__)

# Get the database connection
db = get_db()

# Get the tasks and users collections from the database
tasks_collection = db.get_collection("tasks")
users_collection = db.get_collection("users")
from bson import ObjectId

# Route to fetch all tasks in the "work" category with usernames
@kanban_blueprint.route('/kanban', methods=['GET'])
def fetch_kanban_tasks():
    try:
        # Fetch all tasks that belong to the "Work" category
        tasks = list(tasks_collection.find({"category": "Work"}))

        # If no tasks found in the "Work" category, return an empty array
        if not tasks:
            return jsonify({"tasks": []}), 200  # Ensure empty array if no tasks found

        tasks_with_usernames = []

        for task in tasks:
            user_id = task["user_id"]

            if ObjectId.is_valid(user_id):
                # Fetch the user from the users collection
                user = users_collection.find_one({"_id": ObjectId(user_id)}, {"_id": 0, "username": 1, "role": 1})
            else:
                user = users_collection.find_one({"user_id": user_id}, {"_id": 0, "username": 1, "role": 1})

            # Check if user is None and set default values if so
            if user:
                username = user.get("username", "Unknown User")
                role = user.get("role", "Unknown Role")
            else:
                username = "Unknown User"
                role = "Unknown Role"

            task_with_username = {
                "task_id": str(task["_id"]),
                "taskName": task.get("taskName", "Unnamed Task"),
                "description": task.get("description", ""),
                "deadline": task.get("deadline", ""),
                "category": task.get("category", ""),
                "user_id": task.get("user_id"),
                "username": username,
                "role": role
            }

            tasks_with_usernames.append(task_with_username)

        return jsonify({"tasks": tasks_with_usernames}), 200  # Return tasks as an array

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@kanban_blueprint.route('/add_task', methods=['POST'])
def add_task():
    data = request.get_json()

    # Ensure that the user_id is a valid ObjectId
    user_id = data.get("user_id")
    if not user_id or not ObjectId.is_valid(user_id):
        return jsonify({"error": "Valid User ID is required"}), 400

    # Convert user_id to ObjectId if it's not already an ObjectId
    if isinstance(user_id, str):
        user_id = ObjectId(user_id)

    # Proceed with inserting the task into the database
    task = {
        "taskName": data["taskName"],
        "description": data["description"],
        "category": data["category"],
        "deadline": data["deadline"],
        "createdOn": data["createdOn"],
        "status": data["status"],
        "user_id": user_id  # Store the user_id as an ObjectId
    }
    print(f"Received user_id: {user_id}")


    tasks_collection.insert_one(task)
    return jsonify({"message": "Task added successfully"}), 201
