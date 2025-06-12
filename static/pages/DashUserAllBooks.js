import AllBooksTable from "../components/AllBooksTable.js";
import store from "../utils/store.js";

const DashUserAllBooks = {
  template: `<div>
              <h2>All the available books</h2>
            <div v-for="book in allBooks">
              <AllBooksTable 
                :book_id="book.id"
                :book_name="book.book_name"
                :section_name="book.section.section_name"
                :published_date="book.published_date"
                :author="book.author"
                :status="book.status"
                :user_id="user_id"
                :rating="book.rating"
                />
            </div>
  </div>`,
  data() {
    return {
      allBooks: [],
      user_id: null,
    };
  },
  async mounted() {
    const userId = store.state.user_id;
      const token = sessionStorage.getItem("token");
      console.log('User ID from store:', userId);
      this.user_id = userId;

    const res = await fetch(window.location.origin + "/api/books", {
      headers : {
        "Authentication-Token" : sessionStorage.getItem("token"),
      },
    });
    const data = await res.json();
    this.allBooks = data;
  },
  components: { AllBooksTable, },
};

export default DashUserAllBooks;
