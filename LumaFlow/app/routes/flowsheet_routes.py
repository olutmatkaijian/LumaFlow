from flask import jsonify, send_from_directory, abort, request, Blueprint
from flask_login import login_required, current_user
from app.db_models.flowsheet import Flowsheet
from werkzeug.utils import secure_filename
from app import db
import os

flowsheet_bp = Blueprint('flowsheet', __name__)

@flowsheet_bp.route('/api/flowsheets', methods=['GET', 'POST'])
@login_required
def flowsheets():
    if request.method == 'POST':
        data = request.json
        new_flowsheet = Flowsheet(name=data['name'], content={}, user_id=current_user.id)
        db.session.add(new_flowsheet)
        db.session.commit()
        return jsonify({'id': new_flowsheet.id, 'name': new_flowsheet.name, 'created_at': new_flowsheet.created_at.isoformat()}), 201
    else:
        user_flowsheets = Flowsheet.query.filter_by(user_id=current_user.id).all()
        return jsonify([{'id': f.id, 'name': f.name, 'created_at': f.created_at.isoformat()} for f in user_flowsheets])

@flowsheet_bp.route('/api/flowsheets/<int:id>', methods=['GET', 'PUT', 'DELETE'])
@login_required
def flowsheet(id):
    flowsheet = Flowsheet.query.filter_by(id=id, user_id=current_user.id).first_or_404()
    
    if request.method == 'GET':
        return jsonify({'id': flowsheet.id, 'name': flowsheet.name, 'content': flowsheet.content, 'created_at': flowsheet.created_at.isoformat()})
    
    elif request.method == 'PUT':
        data = request.json
        flowsheet.name = data.get('name', flowsheet.name)
        flowsheet.content = data.get('content', flowsheet.content)
        db.session.commit()
        return jsonify({'id': flowsheet.id, 'name': flowsheet.name, 'created_at': flowsheet.created_at.isoformat()}), 200
    
    elif request.method == 'DELETE':
        db.session.delete(flowsheet)
        db.session.commit()
        return '', 204

@flowsheet_bp.route('/api/svg-elements', methods=['GET'])
@login_required
def get_svg_elements():
    svg_dir = os.path.join(os.path.dirname(__file__), '..', 'svg_elements')
    svg_elements = {}
    
    for category in os.listdir(svg_dir):
        category_path = os.path.join(svg_dir, category)
        if os.path.isdir(category_path):
            svg_elements[category] = []
            for filename in os.listdir(category_path):
                if filename.endswith('.svg'):
                    with open(os.path.join(category_path, filename), 'r') as f:
                        svg_content = f.read()
                    svg_elements[category].append({
                        'name': os.path.splitext(filename)[0],
                        'svg': svg_content,
                        'category': category
                    })
    
    return jsonify(svg_elements)

@flowsheet_bp.route('/svg/<path:filename>')
def serve_svg(filename):
    svg_dir = os.path.join(os.path.dirname(__file__), '..', 'svg_elements')
    return send_from_directory(svg_dir, filename)

