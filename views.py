from flask import render_template, render_template_string, request, jsonify, send_file
from flask_security import auth_required, current_user, roles_required
from flask_security import SQLAlchemySessionUserDatastore
from flask_security.utils import hash_password, verify_password
from extensions import db
from models import User, Role
from tasks import add, export_job
from celery.result import AsyncResult
import datetime

def create_view(app, user_datastore : SQLAlchemySessionUserDatastore, cache):

    #csv file
    @app.route('/start-export')
    def start_export():
        task = export_job.delay()
        return jsonify({'task_id': task.id})
    
    @app.route('/get-csv/<task_id>')
    def get_csv(task_id):
        result = AsyncResult(task_id)
        
        if result.ready():
            return send_file('./user-downloads/file.csv')
        else:
            return "task not ready", 405



    #celery
    @app.route('/celerydemo')
    def celery_demo():
        task = add.delay(10,20)
        return jsonify({'task_id': task.id})
    
    @app.route('/get-task/<task_id>')
    def get_task(task_id):
        result = AsyncResult(task_id)
        
        if result.ready():
            return jsonify({'result': result.result}), 200
        else:
            return "task not ready", 405
    
    #cache 
    @app.route('/cachedemo')
    @cache.cached(timeout=5)
    def cacheDemo():
        return jsonify({"time" : datetime.datetime.now()})
    
    
    
    #homepage

    @app.route('/')
    def home():
        return render_template('index.html')
    
    @app.route('/user-login', methods=['POST'])
    def user_login():
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        # userid = User.query.filter_by(email=email).first()
        
        if not email or not password:
            return jsonify({'message' : 'not valid email or password'}), 404
        
        user = user_datastore.find_user(email = email)

        if not user:
            return jsonify({'message' : 'invalid user'}), 404
        
        if verify_password(password, user.password):
            return jsonify({'token' : user.get_auth_token(), 'role' : user.roles[0].name, 'id' : user.id, 'email' : user.email }), 200
        else :
            return jsonify({'message' : 'wrong password'}), 400
    

    @app.route('/register', methods=['POST'])
    def register():
        data = request.get_json()

        email = data.get('email')
        password = data.get('password')
        user_name = data.get('user_name')
        role = data.get('role')

        if not email or not password or not role:
            return jsonify({"message" : "invalid input"})
        if user_datastore.find_user(email=email):
            return jsonify({"message" : "user already exists"})
        
        try:
            user_datastore.create_user(email = email, user_name = user_name, password = hash_password(password), roles =[role], active = True), 201
            db.session.commit()
        except:
            print('error while creating user')
            db.session.rollback()
            return jsonify({'message' : 'error while creating user'}), 408
        return jsonify({'message' : 'user created'}), 200
    
    #user profile
    @app.route('/profile')
    @auth_required('token')
    def profile():
        return render_template_string(
            """
                <h1> This is profile page </h1>
                <p> Welcome, {{current_user.user_name}}
                <a href="/logout">logout</a>
            
            """
        )
    #admin profile
    @app.route('/admin')
    @roles_required('admin')
    def admin_dash():
        return render_template_string(
            """
                <h1> Admin Profile </h1>
            """
        )
