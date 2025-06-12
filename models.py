from extensions import db, security
from flask_security import UserMixin, RoleMixin
from flask_security.models import fsqla_v3 as fsq

fsq.FsModels.set_db_info(db)


class User(db.Model, UserMixin):
    id = db.Column(db.Integer(), primary_key = True)
    user_name = db.Column(db.String(), nullable = False, unique = True)
    email = db.Column(db.String(), nullable = False, unique = True)
    password = db.Column(db.String(), nullable = False)
    active = db.Column(db.Boolean)
    fs_uniquifier = db.Column(db.String(), nullable = False)
    mybooks = db.relationship("All_books", backref = "creator")
    roles = db.relationship('Role', secondary='user_roles')

class Sections(db.Model):
    section_id = db.Column(db.Integer, primary_key=True)
    section_name = db.Column(db.String(100), unique=True, nullable=False)
    s_section_name = db.Column(db.String(100), unique=True, nullable=True)
    pub_date = db.Column(db.String, nullable=True)
    description = db.Column(db.String)
    books = db.relationship('All_books', backref='related_section', lazy=True)

class All_books(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    book_name = db.Column(db.String(100), nullable=False)
    s_book_name = db.Column(db.String(100), nullable=True)
    section_id = db.Column(db.Integer, db.ForeignKey('sections.section_id'), nullable=False)
    section = db.relationship('Sections', backref='books_related')
    author = db.Column(db.String(100), nullable=False)
    s_author = db.Column(db.String(100), nullable=True)
    published_date = db.Column(db.Date, nullable=True)
    content = db.Column(db.Text, nullable=False)
    d_link = db.Column(db.String(), nullable=False)

    issue_date = db.Column(db.String(), nullable = True)
    return_date = db.Column(db.String(), nullable = True)
    status = db.Column(db.String(), default = "in store")
    user_id = db.Column(db.Integer(), db.ForeignKey("user.id"), nullable=True)
    user = db.relationship("User", backref="books")

    reviews = db.relationship('Review', backref='book')

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    book_id = db.Column(db.Integer, db.ForeignKey('all_books.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)

class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer(), primary_key = True)
    name = db.Column(db.String(80), unique = True, nullable = False)
    description = db.Column(db.String(200))

class UserRoles(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'))