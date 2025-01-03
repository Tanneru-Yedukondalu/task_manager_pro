from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# MongoDB URI and database name from environment variables
mongo_url = os.getenv("MONGO_URI")
db_name = os.getenv("DB")

# Create a MongoClient and get the database
client = MongoClient(mongo_url)
db = client.get_database(db_name)

# Return the database object to be used elsewhere
def get_db():
    return db
