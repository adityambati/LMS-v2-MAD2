from celery import shared_task
import time
from datetime import datetime
from flask_excel import make_response_from_query_sets
from models import All_books, User, Review
from mail_service import send_email


@shared_task()
def add(x,y):
    time.sleep(10)
    return x+y

@shared_task(ignore_result = False)
def export_job():
    books = All_books.query.with_entities(All_books.book_name, All_books.author, All_books.content, All_books.issue_date, All_books.return_date).all()

    csv_out = make_response_from_query_sets(books, ['book_name', 'author', 'content', 'issue_date', 'return_date'], 'csv', file_name="file.csv")

    with open('./user-downloads/file.csv', 'wb') as file:
        file.write(csv_out.data)

    return 'file.csv'

@shared_task(ignore_result = True)
def daily_reminder():
    #send_email('test.gmail', "Reminder: Return the book", '<h1> content body </h1>')
    today = datetime.today().strftime('%Y-%m-%d')
    borrowed_books = All_books.query.filter_by(status='with user').all()
    
    

    for book in borrowed_books:
        if book.return_date > today:
            mail = f"'{book.user.email}'"
            subject = f"Reminder: Return the book '{book.book_name}'"
            message = f"<h1>Reminder to return the book '{book.book_name}', as the date is near!</h1>"
            send_email(mail, subject, message)

    return "Reminders sent"

@shared_task(ignore_result = True)
def monthly_review():
    current_month = datetime.now().month

    try:
        ratings = Review.query.all()

        report = "<html><body>"
        report += "<h3>Monthly Review</h3>"

        if len(ratings) > 0:
            report += "<h4>Monthly Book Ratings</h4>"
            report += "<table style='border-collapse: collapse; border: 1px solid black;'>"
            report += "<tr>"
            report += "<th style='border: 1px solid black;'>Review Id</th>"
            report += "<th style='border: 1px solid black;'>Book Id</th>"
            report += "<th style='border: 1px solid black;'>User Id</th>"
            report += "<th style='border: 1px solid black;'>Rating(out of 5)</th>"
            report += "</tr>"
            for rating in ratings:
                report += "<tr>"
                report += f"<td style='border: 1px solid black;'>{rating.id}</td>"
                report += f"<td style='border: 1px solid black;'>{rating.book_id}</td>"
                report += f"<td style='border: 1px solid black;'>{rating.user_id}</td>"
                report += f"<td style='border: 1px solid black;'>{rating.rating}</td>"
                report += "</tr>"
            report += "</table>"
        else:
            report += "<h3>No reviews this month</h3>"
            
        report += "</body></html>"
            
        mail = "aditya@gmail.com"
        subject = "Monthly reviews of books"
        message = report
        send_email(mail, subject, message)
    except Exception as e:
        print(f"Failed to generate or send the report:{e}")
    return "Monthly reviews sent!"