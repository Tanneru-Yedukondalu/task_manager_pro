from pymongo import MongoClient
import os
from dotenv import load_dotenv
from bson import ObjectId  # Import ObjectId to work with MongoDB ObjectId

# Load environment variables from .env file
load_dotenv()

# MongoDB URI and database name from environment variables
mongo_url = os.getenv("MONGO_URI")
db_name = os.getenv("DB")

# Create a MongoClient and get the database
client = MongoClient(mongo_url)
db = client.get_database(db_name)

# Define the collections
users_collection = db['users']  # Defining the users collection
tasks_collection = db['tasks']  # Defining the tasks collection

# Functions to interact with the database

def get_user_by_id(user_id):
    return users_collection.find_one({"_id": ObjectId(user_id)})

def get_task_by_id(task_id):
    return tasks_collection.find_one({"_id": ObjectId(task_id)})

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

# Return the database object to be used elsewhere
def get_db():
    return db
