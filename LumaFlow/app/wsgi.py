from app import create_app, socketio

app = create_app()

# This is the WSGI entry point for production
application = socketio.run(app)

