import os
import jwt
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify, g
from .models import User

JWT_SECRET = os.environ.get("JWT_SECRET", "jaya-akademisi-secret-key-2024-secure")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

def generate_token(user: User) -> str:
    payload = {
        "user_id": user.id,
        "email": user.email,
        "role": user.role,
        "exp": datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS),
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_token(token: str):
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None

def get_current_user_from_header():
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None
    token = auth_header.split(" ")[1]
    payload = decode_token(token)
    if not payload:
        return None
    return User.query.get(payload.get("user_id"))

def jwt_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        user = get_current_user_from_header()
        if not user:
            return jsonify({"error": "Unauthorized. Invalid or missing token."}), 401
        if not user.is_active:
            return jsonify({"error": "Account is inactive. Please contact administrator."}), 403
        g.current_user = user
        return f(*args, **kwargs)
    return decorated

def role_required(*allowed_roles):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            user = get_current_user_from_header()
            if not user:
                return jsonify({"error": "Unauthorized. Invalid or missing token."}), 401
            if not user.is_active:
                return jsonify({"error": "Account is inactive."}), 403
            if user.role not in allowed_roles:
                return jsonify({"error": f"Forbidden. Role '{user.role}' lacks permission for this action."}), 403
            g.current_user = user
            return f(*args, **kwargs)
        return decorated
    return decorator
