import os
from flask import Blueprint, request, jsonify, send_file
from werkzeug.utils import secure_filename
import zipfile
import json

domain_bp = Blueprint('domain', __name__)

UPLOAD_FOLDER = 'domain_libraries'
ALLOWED_EXTENSIONS = {'zip'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@domain_bp.route('/api/domains', methods=['GET'])
def get_domains():
    domains = [d for d in os.listdir(UPLOAD_FOLDER) if os.path.isdir(os.path.join(UPLOAD_FOLDER, d))]
    if 'Streams' in domains:
        domains.remove('Streams')
    if 'Basic' not in domains:
        domains.append('Basic')
    return jsonify(domains)

@domain_bp.route('/api/streams', methods=['GET'])
def get_streams():
    streams_path = os.path.join(UPLOAD_FOLDER, 'Streams', 'svg_elements')
    streams = {}
    if os.path.isdir(streams_path):
        for filename in os.listdir(streams_path):
            if filename.endswith('.svg'):
                stream_name = os.path.splitext(filename)[0]
                with open(os.path.join(streams_path, filename), 'r') as f:
                    svg_content = f.read()
                streams[stream_name] = {
                    'name': stream_name,
                    'svg': svg_content,
                    'category': 'Streams'
                }
    return jsonify(streams)

@domain_bp.route('/api/domains/<domain_name>/svg_elements', methods=['GET'])
def get_svg_elements(domain_name):
    svg_path = os.path.join(UPLOAD_FOLDER, domain_name, 'svg_elements')
    svg_elements = {}
   
    if not os.path.isdir(svg_path):
        return jsonify({'error': 'Domain not found'}), 404

    for filename in os.listdir(svg_path):
        if filename.endswith('.svg'):
            category = os.path.splitext(filename)[0]
            with open(os.path.join(svg_path, filename), 'r') as f:
                svg_content = f.read()
            svg_elements[category] = {
                'name': category,
                'svg': svg_content,
                'category': domain_name
            }
   
    return jsonify(svg_elements)

@domain_bp.route('/api/domains/upload', methods=['POST'])
def upload_domain():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)
        
        # Extract the zip file
        with zipfile.ZipFile(file_path, 'r') as zip_ref:
            domain_name = os.path.splitext(filename)[0]
            extract_path = os.path.join(UPLOAD_FOLDER, domain_name)
            zip_ref.extractall(extract_path)
        
        # Remove the zip file after extraction
        os.remove(file_path)
        
        # Validate the domain library structure
        if not validate_domain_library(extract_path):
            # If invalid, remove the extracted folder
            import shutil
            shutil.rmtree(extract_path)
            return jsonify({'error': 'Invalid domain library structure'}), 400
        
        return jsonify({'message': 'Domain library uploaded successfully'}), 200
    return jsonify({'error': 'File type not allowed'}), 400

def validate_domain_library(path):
    required_files = ['metadata.json', 'svg_elements', 'modules', 'components']
    for file in required_files:
        if not os.path.exists(os.path.join(path, file)):
            return False
    
    # Check metadata.json structure
    with open(os.path.join(path, 'metadata.json'), 'r') as f:
        metadata = json.load(f)
        if 'name' not in metadata or 'version' not in metadata:
            return False
    
    return True

@domain_bp.route('/api/domains/<domain_name>/modules', methods=['GET'])
def get_modules(domain_name):
    modules_path = os.path.join(UPLOAD_FOLDER, domain_name, 'modules')
    modules = [os.path.splitext(f)[0] for f in os.listdir(modules_path) if f.endswith('.py')]
    return jsonify(modules)

@domain_bp.route('/api/domains/<domain_name>/components', methods=['GET'])
def get_components(domain_name):
    components_path = os.path.join(UPLOAD_FOLDER, domain_name, 'components')
    components = [os.path.splitext(f)[0] for f in os.listdir(components_path) if f.endswith('.svelte')]
    return jsonify(components)

@domain_bp.route('/api/domains/<domain_name>/components/<component_name>', methods=['GET'])
def get_component_content(domain_name, component_name):
    component_path = os.path.join(UPLOAD_FOLDER, domain_name, 'components', f"{component_name}.svelte")
    if os.path.exists(component_path):
        return send_file(component_path, mimetype='text/plain')
    else:
        return jsonify({'error': 'Component not found'}), 404

@domain_bp.route('/api/domains/search', methods=['GET'])
def search_domains():
    query = request.args.get('query', '').lower()
    all_domains = [d for d in os.listdir(UPLOAD_FOLDER) if os.path.isdir(os.path.join(UPLOAD_FOLDER, d))]
    filtered_domains = [d for d in all_domains if query in d.lower()]
    return jsonify(filtered_domains)

