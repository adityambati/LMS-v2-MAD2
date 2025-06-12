import MyBooksTable from "../components/MyBooksTable.js";
import store from "../utils/store.js";
import ReadBook from "./ReadBook.js";

const DashUserMyBooks = {
  template: `
    <div>
      <h2>All your books</h2>
      <div v-if="user_id">
        <div v-for="book in myBooks" :key="book.id">
          <MyBooksTable 
            :book_id="book.id"
            :book_name="book.book_name"
            :section_name="book.section.section_name"
            :author="book.author"
            :status="book.status"
            :issue_date="book.issue_date"
            :return_date="book.return_date"
            :user_id="user_id"
          />
        </div>
      </div>
      <div v-else>
        <p>Error: User ID not found. Please log in again.</p>
      </div>
    </div>
  `,
  data() {
    return {
      myBooks: [],
      user_id: null,
    };
  },
  async mounted() {
    try {
      const userId = store.state.user_id;
      console.log('User ID from store:', userId);
      this.user_id = userId;

      if (!this.user_id) {
        throw new Error('User ID is missing. Please log in again.');
      }

      const token = sessionStorage.getItem("token");
      console.log('Retrieved token:', token);

      if (!token) {
        throw new Error('Token is missing. Please log in again.');
      }

      const res = await fetch(`${window.location.origin}/api/user_books/${userId}`, {
        headers: {
          "Authentication-Token": token,
        },
        redirect: 'manual',
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Server response:', errorText);
        throw new Error(`Error fetching books: ${errorText}`);
      }

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await res.json();
        this.myBooks = data;
      } else {
        const errorText = await res.text();
        throw new Error(`Unexpected content type: ${contentType}, Content: ${errorText}`);
      }
    } catch (error) {
      console.error(error);
    }
  },
  components: { MyBooksTable, ReadBook },
};

export default DashUserMyBooks;
