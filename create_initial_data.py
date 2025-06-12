from flask_security import SQLAlchemySessionUserDatastore
from flask_security.utils import hash_password
from extensions import db

def create_data(user_datastore : SQLAlchemySessionUserDatastore):

    
    print('### creating data ###')

    # create roles
    user_datastore.find_or_create_role(name= 'admin', description = "Librarian")
    user_datastore.find_or_create_role(name= 'user', description = "Student")

    # create user data

    if not user_datastore.find_user(email = "admin@gmail.com"):
        user_datastore.create_user(email = "admin@gmail.com", user_name = "admin", password = hash_password('123'),active = True, roles=['admin'])
        #user_datastore.add_role_to_user(user, admin_role)
    if not user_datastore.find_user(email = "aditya@gmail.com"):
        user_datastore.create_user(email = "aditya@gmail.com", user_name = "aditya", password = hash_password('123'),active = True, roles=['user'])
        #user_datastore.add_role_to_user(user, user_role)

    db.session.commit()