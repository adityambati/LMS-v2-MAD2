from flask import Flask
from flask_restful import Api
import views
from extensions import db, security, cache
from create_initial_data import create_data
from models import User, Role
import resources
from flask_security import SQLAlchemyUserDatastore, Security
from flask_caching import Cache
from worker import celery_init_app
import flask_excel as excel
from celery.schedules import crontab
from tasks import daily_reminder, send_email, monthly_review



def create_app():
    app = Flask(__name__)

    app.config['SECRET_KEY'] = "password"
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///data.sqlite3"
    app.config['SECURITY_PASSWORD_SALT'] = 'salty-password'

    #Configuring token
    app.config['SECURITY_TOKEN_AUTHENTICATION_HEADER'] = 'Authentication-Token'
    app.config['SECURITY_TOKEN_MAX_AGE'] = 2000
    app.config['SECURITY_LOGIN_WITHOUT_CONFIRMATION'] = True
   
   
    #configure caching
   
    app.config["CACHE_DEFAULT_TIMEOUT"] = 300
    app.config["DEBUG"] = True
    app.config["CACHE_TYPE"] = "RedisCache"
    app.config["CACHE_REDIS_PORT"] = 6379


    
    cache.init_app(app)
    db.init_app(app)
    

    user_datastore = SQLAlchemyUserDatastore(db, User, Role)
    security = Security(app, user_datastore)

    with app.app_context():
        

        db.create_all()

        create_data(user_datastore)
    
    app.config['WTF_CSRF_CHECK_DEFAULT'] = False
    app.config['SECURITY_CSRF_PROTECT_MECHANISMS'] = []
    app.config['SECURITY_CSRF_IGNORE_UNAUTH_ENDPOINTS'] = True

    views.create_view(app, user_datastore, cache)
    
    resources.api.init_app(app)

    return app

app = create_app()
celery_app = celery_init_app(app)
excel.init_excel(app)

# daily reminder
@celery_app.on_after_configure.connect
def send_email(sender, **kwargs):

    sender.add_periodic_task(
        crontab(hour=18, minute=25),
        daily_reminder.s(),
    )
    sender.add_periodic_task(
        crontab(minute=55, hour=17, day_of_month=9),
        monthly_review.s(),
        )


if __name__ == "__main__":
    app.run(debug=True)