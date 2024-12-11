from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_socketio import SocketIO
from flask_login import LoginManager
from .config import Config
from app.routes.domain_routes import domain_bp

db = SQLAlchemy()
migrate = Migrate()
socketio = SocketIO()
login_manager = LoginManager()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    
    # Update CORS configuration
    CORS(app, resources={r"/*": {"origins": ["http://localhost:5173", "http://192.168.1.102:5173", "http://192.168.1.102:5000"]}}, supports_credentials=True)
    
    # Update Socket.IO configuration
    socketio.init_app(app, 
                      cors_allowed_origins=["http://localhost:5173", "http://192.168.1.102:5173", "http://192.168.1.102:5000"], 
                      async_mode='gevent',
                      engineio_logger=True,
                      logger=True)
    
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'

    # Import and register blueprints
    from app.routes.flowsheet_routes import flowsheet_bp
    app.register_blueprint(flowsheet_bp)

    from app.routes.auth_routes import auth_bp
    app.register_blueprint(auth_bp)

    from app.routes.domain_routes import domain_bp
    app.register_blueprint(domain_bp)

    from app.socket_events import register_socket_events
    register_socket_events(socketio)

    # Add the after_request decorator
    @app.after_request
    def add_header(response):
        response.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        return response

    @app.after_request
    def set_secure_cookie(response):
        if 'Set-Cookie' in response.headers:
            response.headers['Set-Cookie'] += '; SameSite=None; Secure'
        return response

    return app

