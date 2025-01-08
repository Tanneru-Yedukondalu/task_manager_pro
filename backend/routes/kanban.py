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

        # If no tasks found in the "Work" category, return a message
        if not tasks:
            return jsonify({"message": "No work tasks found."}), 404

        # Prepare a list to store tasks with usernames
        tasks_with_usernames = []

        for task in tasks:
            # Fetch the user based on the user_id in the task
            user_id = task["user_id"]

            # Check if user_id is a valid ObjectId
            if ObjectId.is_valid(user_id):
                user = users_collection.find_one({"_id": ObjectId(user_id)}, {"_id": 0, "username": 1, "role":1})
            else:
                user = users_collection.find_one({"user_id": user_id}, {"_id": 0, "username": 1, "role":1})

            username = user.get("username") if user else "Unknown User"
            role = user.get("role") 

            # Add the username to the task
            task_with_username = {
                "task_id": str(task["_id"]),  # Convert ObjectId to string for frontend
                "taskName": task.get("taskName", "Unnamed Task"),
                "description": task.get("description", ""),
                "deadline": task.get("deadline", ""),
                "category": task.get("category", ""),
                "user_id": task.get("user_id"),
                "username": username,
                "role": role
            }

            tasks_with_usernames.append(task_with_username)

        # Return all tasks in the "Work" category with usernames
        return jsonify({"tasks": tasks_with_usernames}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
