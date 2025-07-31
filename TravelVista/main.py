"""
Flask app to serve Sanskruti Travels static website
Perfect for development and GitHub Pages compatibility
"""

from flask import Flask, render_template, send_from_directory, jsonify
import os

app = Flask(__name__, 
           static_folder='.', 
           static_url_path='',
           template_folder='.')

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def static_files(filename):
    # Handle HTML files without extension
    if not '.' in filename and os.path.exists(f'{filename}.html'):
        return send_from_directory('.', f'{filename}.html')
    return send_from_directory('.', filename)

@app.route('/packages')
def packages():
    return send_from_directory('.', 'packages.html')

@app.route('/package-detail')
def package_detail():
    return send_from_directory('.', 'package-detail.html')

@app.route('/about')
def about():
    return send_from_directory('.', 'about.html')

@app.route('/contact')
def contact():
    return send_from_directory('.', 'contact.html')

@app.errorhandler(404)
def not_found(error):
    return send_from_directory('.', 'index.html'), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)