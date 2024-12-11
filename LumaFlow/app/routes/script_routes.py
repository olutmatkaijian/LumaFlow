from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.db_models.node_script import NodeScript
from app import db

script_bp = Blueprint('script', __name__)

@script_bp.route('/api/nodes/<string:node_id>/script', methods=['GET', 'PUT'])
@login_required
def node_script(node_id):
    script = NodeScript.query.filter_by(node_id=node_id).first()

    if request.method == 'GET':
        if script:
            return jsonify({'script': script.content})
        else:
            return jsonify({'script': ''})

    elif request.method == 'PUT':
        content = request.json.get('script', '')
        if script:
            script.content = content
        else:
            script = NodeScript(node_id=node_id, content=content)
            db.session.add(script)
        db.session.commit()
        return jsonify({'message': 'Script updated successfully'})

@script_bp.route('/api/nodes/<string:node_id>/execute', methods=['POST'])
@login_required
def execute_script(node_id):
    script = NodeScript.query.filter_by(node_id=node_id).first()
    if not script:
        return jsonify({'error': 'No script found for this node'}), 404

    # Here you would implement the logic to execute the script
    # For now, we'll just return a placeholder response
    return jsonify({'result': f'Executed script for node {node_id}'})

