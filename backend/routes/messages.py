from flask import Blueprint, request, jsonify
from bson import ObjectId  # Import ObjectId to handle MongoDB ObjectId conversion
from database import messages_collection

messages_blueprint = Blueprint('messages', __name__)

def serialize_message(message):
    """
    Helper function to serialize message.
    This will convert ObjectId fields to strings.
    """
    message['_id'] = str(message['_id'])  # Convert ObjectId to string
    return message

    
@messages_blueprint.route('/messages', methods=['GET'])
def get_messages():
    receiver = request.args.get('receiver')
    group = request.args.get('group', None)

    # If no group is specified, fetch individual messages for the receiver
    query = {'$or': [
        {'receiver': receiver, 'sender': {'$ne': receiver}},  # Receiver is the user and sender is not the receiver
        {'sender': receiver, 'receiver': {'$ne': receiver}},  # Sender is the user and receiver is not the sender
    ]}
    
    if group:
        query['group'] = group

    messages = messages_collection.find(query).sort('timestamp', 1)  # Sort by timestamp ascending
    message_list = [serialize_message(message) for message in messages]  # Serialize each message

    return jsonify({'messages': message_list}), 200
