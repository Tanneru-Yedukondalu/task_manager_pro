def get_user_by_id(user_id):
    return users_collection.find_one({"_id": ObjectId(user_id)})

def get_task_by_id(task_id):
    return tasks_collection.find_one({"_id": ObjectId(task_id)})

# Assuming you use the `users_collection` globally
def get_user_by_email(email):
    return users_collection.find_one({"email": email})

def create_user(user_data):
    result = users_collection.insert_one(user_data)
    return str(result.inserted_id)

def create_task(task_data):
    result = tasks_collection.insert_one(task_data)
    return str(result.inserted_id)
    
def get_all_users():
    users = users_collection.find({}, {"_id": 0, "username": 1})  # Fetch only usernames, exclude _id
    return list(users)
