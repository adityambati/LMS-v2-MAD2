import Navbar from '../components/Navbar.js';
import Login from "../pages/Login.js";
import Register from "../pages/Register.js";
import Logout from "../pages/Logout.js";
import DashUserAllBooks from "../pages/DashUserAllBooks.js";
import DashUserMyBooks from '../pages/DashUserMyBooks.js';
import ReviewBook from '../components/ReviewBook.js';
import ReadBook from '../pages/ReadBook.js';
import DownloadBook from '../pages/Download.js';
import AdminDash1 from '../pages/AdminDash1.js';
import AdminDash2 from '../pages/AdminDash2.js';
import BooksOfSec from '../pages/BooksOfSec.js';
import AddSec from '../pages/AddSec.js';
import DeleteSec from '../pages/DeleteSec.js';
import AddBook from '../pages/AddBook.js';
import DeleteBook from '../pages/DeleteBook.js';
import UserInfo from '../pages/UserInfo.js';
import SearchResult from '../pages/SearchResult.js';

import store from './store.js';


const routes = [
    { path: "/", component : Login },
    { path: "/register", component : Register },
    { path: "/logout", component : Logout },
    { path: "/dashuser1", component : DashUserAllBooks, meta: {requiresLogin: true, role: "user"}, },
    { path: "/dashuser2", component : DashUserMyBooks, meta: {requiresLogin: true, role: "user"}, },
    { path: "/review/:user_id/:book_id", component : ReviewBook, props: true },
    { path: "/read/:book_id", component : ReadBook, props: true },
    { path: "/download/:book_id", component : DownloadBook, props: true },
    { path: "/admindash1", component : AdminDash1, meta: {requiresLogin: true, role: "admin"}, },
    { path: "/admindash2", component : AdminDash2, meta: {requiresLogin: true, role: "admin"}, },
    { path: "/books_of_sec/:sec_id", component : BooksOfSec, meta: {requiresLogin: true, role: "admin"}, },
    { path: "/add_sec", component : AddSec, meta: {requiresLogin: true, role: "admin"}, },
    { path: "/delete_sec", component : DeleteSec, meta: {requiresLogin: true, role: "admin"}, },
    { path: "/add_book", component : AddBook, meta: {requiresLogin: true, role: "admin"}, },
    { path: "/delete_book", component : DeleteBook, meta: {requiresLogin: true, role: "admin"}, },
    { path: "/user_info/:user_id", component : UserInfo, props: true, meta: {requiresLogin: true, role: "admin"}, },
    { path: "/search", component : SearchResult, props: true, meta: {requiresLogin: true, role: "user"}, },
];

const router = new VueRouter({
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresLogin)) {
      if (!store.state.loggedIn) {
        next({ path: "/" });
      } else if (to.meta.role && to.meta.role !== store.state.role) {
        next({ path: "/" });
      } else {
        next();
      }
    } else {
      next();
    }
  });

export default router;