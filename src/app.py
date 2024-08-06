"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, User, Post, PostStatus
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
CORS(app)
app.url_map.strict_slashes = False

app.config["JWT_SECRET_KEY"] = os.getenv("SUPER_SECRET_KEY")
jwt = JWTManager(app)

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response


# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)


#Endpoints requeridos 

#Registro
@app.route('/api/signup', methods=['POST'])
def signup_user():
    body = request.get_json(silent=True)
    if body is None: 
        return jsonify({'msg' : 'You need to add info inside body'}), 400
    if 'username' not in body: 
        return jsonify({'msg' : 'You need to set an username'}), 400
    if 'password' not in body: 
        return jsonify({'msg' : 'You need to set your password'}), 400
    if 'name' not in body: 
        return jsonify({'msg' : 'You need to write your first name'}), 400
    if 'surname' not in body:
        return jsonify({'msg' : 'You need to add your surname'}), 400

    new_user = User()
    if 'avatar' in body:
        new_user.avatar = body['avatar']
    new_user.username = body['username']
    new_user.password = body['password']
    new_user.name = body['name']
    new_user.surname = body['surname']

    db.session.add(new_user)
    db.session.commit()
    return jsonify({"msg" : "new user created"}), 201

#Login de usuario
@app.route('/api/login', methods=['POST'])
def login_user():
    body = request.get_json(silent=True)
    if body is None: 
        return jsonify({'msg' : 'You need to add info inside body'}), 400
    if "username" not in body: 
        return jsonify({'msg' : 'You need to add username'}), 400 
    if "password" not in body: 
        return jsonify({'msg' : 'Your need to add your password'}), 400 
    
    #Verificacion de usuario 
    user = User.query.filter_by(username=body["username"]).first()
    if user:
        print("el usuario existe, su nombre es", user.name)
        access_token = create_access_token(identity={
            "username":user.username, 
            "id":user.id, 
            "name":user.name,
            "surname": user.surname})
        print(access_token)
        return jsonify({"msg" : "Login success", "access_token": access_token}), 200
    else:
        print("no existe un usuario con ese username")
        return jsonify({"msg" : "No existe usuario con ese username"}), 404
    
#crear post
@app.route('/api/createpost', methods=['POST'])
@jwt_required()
def create_post():
    body = request.get_json(silent=True)
    if 'message' not in body:
        return jsonify({"msg" : "Necesitas agregar una descripcion para tu post"}), 400
    if 'image' not in body:
        return jsonify({"msg" : "Necesitas agregar una imagen"}), 400
    
    user_id = get_jwt_identity()['id']
    new_post = Post()
    if 'location' in body:
        new_post.location = body['location']
    new_post.message = body['message']
    new_post.author_id = user_id
    new_post.image = body['image']
    new_post.status = PostStatus.PUBLISHED
    try:
        db.session.add(new_post)
        db.session.commit()
        return jsonify({"msg" : 'post creado satisfactoriamente', "post" : new_post.serialize()}), 200
    except Exception as e:
        return jsonify({'Error' : str(e)}), 500

    
#Feed de usuario para visualizar post
@app.route('/api/feed')
@jwt_required()
def private_feed():
    identity = get_jwt_identity()
    print(identity)
    user_username = User.query.filter_by(username = identity['username']).first()
    if not user_username:
        return({"msg" : "El usuario no existe"}), 401
    else:
        post_data = [post.serialize() for post in Post.query.all()]
        return jsonify({"msg" : "ok", "data" : post_data}), 200