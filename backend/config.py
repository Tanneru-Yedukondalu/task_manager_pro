# from datetime import datetime,timedelta
# from flask import Flask,Blueprint,  request, jsonify
# from flask_bcrypt import Bcrypt
# from flask_cors import CORS
# from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
# from bson.objectid import ObjectId
# import os
# from os import environ
# from werkzeug.utils import secure_filename
# import random 
# import json
# from pymongo import DESCENDING, MongoClient, ASCENDING
# from dotenv import load_dotenv
# import pytz

# ist = pytz.timezone("Asia/Kolkata")
# current_time_ist = datetime.now(ist)
# bcrypt = Bcrypt()

# config.py

import os

class Config:
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'task_manager_pro')  # Use environment variable for security
    JWT_ACCESS_TOKEN_EXPIRES = False  # Set expiration to False to keep the access token from expiring
