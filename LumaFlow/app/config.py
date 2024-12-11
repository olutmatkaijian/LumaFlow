import os

class Config:
    FLASK_SERVER_URL = os.environ.get('FLASK_SERVER_URL', 'http://localhost:5000')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///flowsheets.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key')
    SVG_ELEMENTS_DIR = os.path.join(os.path.dirname(__file__), 'svg_elements')

