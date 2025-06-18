# 📚 Library Management System - V2 (LMS-v2-MAD2)

A modern and efficient Library Management System built using JavaScript. Version 2 introduces email reminders (via MailHog), monthly admin reports, and a paid PDF download feature. Designed for streamlined, automated library operations.
 It was made for the course 'Modern Application Development 2', which is part of the IIT Madras BS Degree in data Science.

## 🚀 Features

- 📖 Add, update, and delete books
- 👤 Manage student/user records
- 📅 Issue and return books with date tracking
- 📬 **Automated email reminders** for overdue books using MailHog
- 📈 **Monthly reports** sent to librarian/admin via email
- 🔍 Advanced search functionality for books and users
- 💾 Data persistence using **localStorage**
- 💳 **Download books in PDF format** for a fee (simulated payment system)
- 🧹 Clean, modular, and intuitive UI design with Version 2 improvements

---

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Email Handling:** MailHog (for local testing)
- *(No external frameworks – built from scratch using Vanilla JS)*

---

## 📸 Screenshots

| Admin HomePage | Admin Book Management | Monthly report in Mail |
|----------|------------|-----------|
| ![HomePage](./screenshots/AdminHomePage.png) | ![BookManage](./screenshots/AdminBookManagement.png) | ![MailHogMonthly](./screenshots/MailHogMonthlyReport.png) |

| Dashboard | Issue Book | Book List |
|----------|------------|-----------|
| ![Dashboard](./screenshots/dashboard.png) | ![Issue Book](./screenshots/issue-book.png) | ![Book List](./screenshots/book-list.png) |

> 📁 *Ensure these images are placed in a `/screenshots` folder in your repo.*

---

## 📂 Project Structure

```bash
LMS-v2-MAD2/
│
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── bookManager.js
│   ├── emailService.js
│   ├── pdfDownload.js
│   └── utils.js
├── screenshots/
│   ├── dashboard.png
│   ├── issue-book.png
│   └── book-list.png
├── README.md
└── ...

