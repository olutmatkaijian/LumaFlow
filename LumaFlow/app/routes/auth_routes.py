from flask import Blueprint, request, jsonify, current_app
from flask_login import login_user, logout_user, login_required, current_user
from flask_cors import cross_origin
from app import db
from app.db_models.user import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['GET', 'POST', 'OPTIONS'])
@cross_origin(supports_credentials=True)
def login():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Missing username or password"}), 400

    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        login_user(user, remember=True)
        return jsonify({'message': 'Logged in successfully', 'user_id': user.id}), 200
    
    return jsonify({'message': 'Invalid username or password'}), 401

@auth_bp.route('/register', methods=['GET', 'POST', 'OPTIONS'])
@cross_origin(supports_credentials=True)
def register():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()

    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({"error": "Missing required fields"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400

    user = User.create(username, email, password)
    return jsonify({'message': 'Registered successfully', 'user_id': user.id}), 201

@auth_bp.route('/api/logout', methods=['POST','GET'])
@login_required
@cross_origin(supports_credentials=True)
def logout():
    logout_user()
    return jsonify({'message': 'Successfully logged out'}), 200

@auth_bp.route('/api/user', methods=['GET'])
@login_required
@cross_origin(supports_credentials=True)
def get_user_info():
    return jsonify({
        'id': current_user.id,
        'username': current_user.username,
        'email': current_user.email
    }), 200

@auth_bp.route('/api/profile', methods=['GET'])
@login_required
@cross_origin(supports_credentials=True)
def profile():
    return jsonify({'user': current_user.to_dict()}), 200

@auth_bp.route('/api/check-auth', methods=['GET'])
@cross_origin(supports_credentials=True)
def check_auth():
    if current_user.is_authenticated:
        return jsonify({'authenticated': True, 'user': {'id': current_user.id, 'username': current_user.username}}), 200
    return jsonify({'authenticated': False, 'user': None}), 200

def _build_cors_preflight_response():
    response = jsonify()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add('Access-Control-Allow-Headers', "*")
    response.headers.add('Access-Control-Allow-Methods', "*")
    return response