from flask_restful import Resource, Api, fields, reqparse, marshal_with, fields, marshal
from flask_security import auth_required, roles_required, current_user
from models import All_books, Sections, Review, User
from sqlalchemy import func
from extensions import db
from datetime import datetime, timedelta
from flask import request

api = Api(prefix='/api')

sec_parser = reqparse.RequestParser()

def raw(text):
    return ''.join(word.lower() for word in text.split())

sec_parser.add_argument('section_id', type=int)
sec_parser.add_argument('section_name', type=str)
sec_parser.add_argument('s_section_name', type=str)
sec_parser.add_argument('pub_date', type=str)
sec_parser.add_argument('description', type=str)

section_fields = {
    'section_id' : fields.Integer,
    'section_name' : fields.String,
    's_section_name' : fields.String,
    'pub_date' : fields.String,
    'description' : fields.String
}

class Sections_Resource(Resource):
    @auth_required('token')
    @marshal_with(section_fields)

    def get(self):
        all_sections = Sections.query.all()
        return all_sections
    
    @auth_required('token')
    def post(self):
        args = sec_parser.parse_args()
        s_section_name_processed = raw(args.section_name)
        new_sections = Sections(section_name = args.section_name, s_section_name = s_section_name_processed, pub_date = args.pub_date, description = args.description)
        db.session.add(new_sections)
        db.session.commit()
        return {'message' : 'created bro'}, 200
    
    @auth_required('token')
    def delete(self):
        args = sec_parser.parse_args()
        s_name = args.section_name
        if not s_name:
            return {'message': 'Sec name is required'},400
        sec = Sections.query.filter_by(section_name=s_name).first()
        if not sec:
            return{'message': 'Section not found'},404
        associated_books = All_books.query.filter_by(section_id=sec.section_id).all()
        for book in associated_books:
            db.session.delete(book)
        db.session.commit
        db.session.delete(sec)
        db.session.commit()
        return {'message':'Section deleted successfully along with its books'},200
    
##############################################################################################################################################################


books_parser = reqparse.RequestParser()
#books_parser.add_argument('id', type=int, required=True)
books_parser.add_argument('book_name', type=str, required=True)
books_parser.add_argument('s_book_name', type=str, required=False)
books_parser.add_argument('author', type=str, required=True)
books_parser.add_argument('s_author', type=str, required=False)
books_parser.add_argument('published_date', type=str, required=False)
books_parser.add_argument('content', type=str, required=True)
books_parser.add_argument('d_link', type=str, required=True)
books_parser.add_argument('issue_date', type=str)
books_parser.add_argument('return_date', type=str)
books_parser.add_argument('status', type=str, default="in store")
books_parser.add_argument('user_id', type=int)
books_parser.add_argument('section_name', type=str, required=True)


# Define the fields for marshalling the response
book_fields = {
    'id' : fields.Integer,
    'book_name': fields.String,
    's_book_name': fields.String,
    'section_id': fields.Integer,
    'section': fields.Nested(section_fields),
    'author': fields.String,
    's_author': fields.String,
    'published_date': fields.String,
    'content': fields.String,
    'd_link': fields.String,
    'issue_date': fields.String,
    'return_date': fields.String,
    'status': fields.String,
    'user_id': fields.Integer,
    'user_name': fields.String,
    'user_email' : fields.String,
    'rating' : fields.Float
}

class All_Books_Resource(Resource):
    #@auth_required('token', 'session')
    @marshal_with(book_fields)
    def get(self):
        try:
            all_books = All_books.query.options(db.joinedload(All_books.section)).all()
            for book in all_books:
                rating = db.session.query(func.avg(Review.rating)).filter_by(book_id=book.id).scalar()
                book.rating = round(rating, 2) if rating else 0
                if book.user_id is not None:
                    u_info = User.query.get(book.user_id)
                    book.user_name = u_info.user_name if u_info else None
                    book.user_email = u_info.email if u_info else None
                else:
                    book.user_name = None
            return all_books
        except Exception as e:
            print(f"Error fetching books: {e}")
            return {'message': 'An error occurred while fetching books'}, 500

    @auth_required('token', 'session')
    def post(self):
        args = books_parser.parse_args()
        
        section = Sections.query.filter_by(section_name=args.section_name).first()
        if not section:
            return {'message': 'Section not found'}, 404

        def parse_date(date_str):
            try:
                return datetime.strptime(date_str, '%Y-%m-%d').date() if date_str else None
            except ValueError:
                return None

        published_date = parse_date(args.published_date)
        issue_date = parse_date(args.issue_date)
        return_date = parse_date(args.return_date)

        s_book_name_processed = raw(args.book_name)
        s_author_processed = raw(args.author)

        new_book = All_books(
            book_name=args.book_name,
            s_book_name=s_book_name_processed,
            section_id=section.section_id,
            author=args.author,
            s_author=s_author_processed,
            published_date=published_date,
            content=args.content,
            d_link=args.d_link,
            issue_date=issue_date,
            return_date=return_date,
            status=args.status,
            user_id=None
        )
        try:
            db.session.add(new_book)
            db.session.commit()

            result = {
                'id': new_book.id,
                'book_name': new_book.book_name,
                's_book_name': new_book.s_book_name,
                'section_id': new_book.section_id,
                'author': new_book.author,
                's_author': new_book.s_author,
                'published_date': new_book.published_date.isoformat() if new_book.published_date else None,
                'content': new_book.content,
                'd_link': new_book.d_link,
                'issue_date': new_book.issue_date.isoformat() if new_book.issue_date else None,
                'return_date': new_book.return_date.isoformat() if new_book.return_date else None,
                'status': new_book.status,
                'user_id': new_book.user_id,
            }
            return result, 201
        except Exception as e:
            db.session.rollback()
            print(f"Error creating book: {e}")
            return {'message': f'An error occurred while creating new book: {str(e)}'}, 500
    
    @auth_required('token')
    def delete(self):
        data = request.get_json()
        b_name = data.get('book_name')
        if not b_name:
            return {'message': 'Book name is required'}, 400
    
        book = All_books.query.filter_by(book_name=b_name).first()
        if not book:
            return {'message': 'Book not found'}, 404
    
        try:
            db.session.delete(book)
            db.session.commit()
            return {'message': 'Book deleted successfully'}, 200
        except Exception as e:
            db.session.rollback()
            print(f"Error deleting book: {e}")
            return {'message': f'An error occurred while deleting the book: {str(e)}'}, 500
        

class SearchResource(Resource):
    #@auth_required('token')
    def get(self, user_id):
        print(f"Request Headers: {request.headers}")
        print(f"Auth Token: {request.headers.get('Authorization')}")
        
        srch_word = request.args.get('srch_word', '').strip()
        srch_word = "%" + raw(srch_word) + "%"
        
        b_names = All_books.query.filter(All_books.s_book_name.ilike(srch_word)).all()
        s_authors = All_books.query.filter(All_books.s_author.ilike(srch_word)).all()
        s_sections = Sections.query.filter(Sections.s_section_name.ilike(srch_word)).all()
        
        search_results_book = b_names + s_authors
        search_results_section = s_sections
        
        book_results = [marshal(book, book_fields) for book in search_results_book]
        section_results = [marshal(section, section_fields) for section in search_results_section]
        
        return {
            'books': book_results,
            'sections': section_results
        }



class UserBooksResource(Resource):
    @auth_required('token', 'session')
    @marshal_with(book_fields)
    def get(self, user_id):
        try:
            user_books = All_books.query.filter_by(user_id=user_id).all()
            return user_books
        except Exception as e:
            print(f"Error fetching user's books: {e}")
            return {'message': 'An error occurred while fetching user\'s books'}, 500

class RequestBookResource(Resource):
    #@auth_required('token')
    #@roles_required('admin')
    def post(self, book_id, user_id):
        try:
            print(f"Current user roles in RequestBookResource: {[role.name for role in current_user.roles]}")

            book = All_books.query.get(book_id)
            userdata = User.query.get(user_id)
            i_date = today = datetime.today().strftime('%Y-%m-%d')
            r_date = (datetime.today() + timedelta(days=7)).strftime('%Y-%m-%d')
            if len(userdata.mybooks) >= 5:
                return {'message': 'You have 5 books, please return a book to borrow another'}, 200
            else:
                if not book:
                    return {'message': 'Book not found'}, 404

                if book.status == "in store":
                    book.status = "with the admin"
                    book.user_id = user_id
                    book.user_name = userdata.user_name
                    book.issue_date = i_date
                    book.return_date = r_date
                    db.session.commit()
                    return {'message': 'Book requested successfully'}, 200
                else:
                    return {'message': 'Book is not available for request'}, 400
        except Exception as e:
            print(f"Error updating book status: {e}")
            return {'message': 'An error occurred while updating book status'}, 500

class ReturnBookResource(Resource):
    def post(self, book_id, user_id, rating):
        try:
            book = All_books.query.get(book_id)
            if not book:
                return{'message': 'Book not found'}, 404
            
            book.user_id = None
            book.status = "in store"
            db.session.commit()
            new_review = Review(book_id=book_id, user_id=user_id, rating=rating)
            db.session.add(new_review)
            db.session.commit()


            return{'message' : 'Book returned successfully'}, 200
        except Exception as e:
            print(f"Error in returning the book: {e}")
            return {'message': 'Error occured when returning the book'}

class ReadBookResource(Resource):
    @marshal_with(book_fields)
    def get(self, book_id):
        try:
            book = All_books.query.get(book_id)
            if not book:
                return{'message': 'book not found'}, 404
            return book
        except Exception as e:
            print(f"error fetch book:{e}")
            return{'message': 'an error occured while fetching book'}, 500
        
class AcceptBookApproval(Resource):
    def post(self, book_id):
        try:
            book = All_books.query.get(book_id)
            if not book:
                return{'message': 'Book not found'}, 404
            book.status = "with user"
            db.session.commit()

            return{'message' : 'Book approved successfully'}, 200
        except Exception as e:
            print(f"Error in approving the book: {e}")
            return {'message': 'Error occured when approving the book'}
        
class DeclineBookApproval(Resource):
    def post(self, book_id):
        try:
            book = All_books.query.get(book_id)
            if not book:
                return{'message': 'Book not found'}, 404
            book.status = "in store"
            book.issue_date = None
            book.return_date = None
            book.user_id = None
            book.user_name = None

            db.session.commit()

            return{'message' : 'Book decline successfully'}, 200
        except Exception as e:
            print(f"Error in revoking the book: {e}")
            return {'message': 'Error occured when declining the book'}


class BooksOfSec(Resource):
    @auth_required('token', 'session')
    @marshal_with(book_fields)
    def get(self, sec_id):
        try:
            sec_books = All_books.query.filter_by(section_id=sec_id).all()
            return sec_books
        except Exception as e:
            print(f"Error fetching sections's books: {e}")
            return {'message': 'An error occurred while fetching sections\'s books'}, 500
        
class UserInfo(Resource):
    @auth_required('token', 'session')
    def get(self, user_id):
        try:
            user_info = User.query.filter_by(id=user_id).first()
            if user_info:
                return {
                    'id': user_info.id,
                    'user_name': user_info.user_name,
                    'email': user_info.email
                }
            else:
                return {'message': 'User not found'}, 404
        except Exception as e:
            print(f"Error fetching user's info: {e}")
            return {'message': 'An error occurred while fetching user\'s info'}, 500


api.add_resource(Sections_Resource, '/resources')
api.add_resource(All_Books_Resource, '/books')
api.add_resource(UserBooksResource, '/user_books/<int:user_id>')
api.add_resource(RequestBookResource, '/request_book/<int:book_id>/<int:user_id>')
api.add_resource(ReturnBookResource, '/return_book/<int:book_id>/<int:user_id>/<int:rating>')
api.add_resource(ReadBookResource, '/read_book/<int:book_id>')
api.add_resource(AcceptBookApproval, '/accept_book/<int:book_id>')
api.add_resource(DeclineBookApproval, '/decline_book/<int:book_id>')
api.add_resource(BooksOfSec, '/books_of_sec/<int:sec_id>')
api.add_resource(UserInfo, '/user_info/<int:user_id>')
api.add_resource(SearchResource, '/search/<int:user_id>')