from flask_socketio import emit, join_room, leave_room
from flask import request
import json

def register_socket_events(socketio):
    @socketio.on('connect')
    def handle_connect():
        print('Client connected')
        flowsheet_id = request.args.get('flowsheetId')
        if flowsheet_id:
            join_room(flowsheet_id)
            print(f'Client joined room: {flowsheet_id}')
        else:
            print('No flowsheet_id provided')

    @socketio.on('disconnect')
    def handle_disconnect():
        print('Client disconnected')

    @socketio.on('join')
    def on_join(data):
        room = data.get('room')
        if room:
            join_room(room)
            print(f'Client joined room: {room}')
            emit('user_joined', {'room': room}, room=room)
        else:
            print('No room provided for join event')

    @socketio.on('leave')
    def on_leave(data):
        room = data.get('room')
        if room:
            leave_room(room)
            print(f'Client left room: {room}')
            emit('user_left', {'room': room}, room=room)
        else:
            print('No room provided for leave event')

    @socketio.on_error()
    def error_handler(e):
        print('SocketIO error:', str(e))

    @socketio.on_error_default
    def default_error_handler(e):
        print('SocketIO default error:', str(e))

    # Add a test event to verify Socket.IO is working
    @socketio.on('test')
    def handle_test(data):
        print('Received test event:', data)
        emit('test_response', {'message': 'Test successful'})

