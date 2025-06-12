import store from "../utils/store.js";
import router from "../utils/router.js";

const AddBook = {
  template: `
    <div>
      <div id="tables"><h2>Add New Book</h2></div>
      <form @submit.prevent="createBook">
        <div id="canvas2">
          <div class="mb-3">
            <label for="b_name" class="form-label">Title of book:</label>
            <input type="text" class="form-control" id="b_name" v-model="book_name" required>
          </div>
          <div class="mb-3">
            <label for="a_name" class="form-label">Author:</label>
            <input type="text" class="form-control" id="a_name" v-model="author" required>
          </div>
          <div class="mb-3">
            <label for="d_link" class="form-label">Download link for book:</label>
            <input type="text" class="form-control" id="d_link" v-model="d_link" required>
          </div>
          <div class="mb-3">
            <label for="date1" class="form-label">Date of creation:</label>
            <input type="date" class="form-control" id="date1" v-model="published_date">
          </div>
          <div class="mb-3">
            <label for="sec_book" class="form-label">Category/Section of book:</label>
            <input type="text" class="form-control" id="sec_book" v-model="section_name">
          </div>
          <div class="mb-3">
            <label for="content" class="form-label">Content of the book:</label>
            <textarea class="form-control" id="content" v-model="content" rows="3"></textarea>
          </div>
          <div id="tables">
            <router-link to="/admindash1">
              <button type="button" class="btn btn-danger btn-lg">Cancel</button>
            </router-link>
            <button type="submit" class="btn btn-primary btn-lg">Create</button>
          </div>
        </div>
      </form>
    </div>
  `,
  data() {
    return {
      book_name: '',
      author: '',
      d_link: '',
      section_name: '',
      published_date: '',
      content: '',
      user_id: null
    };
  },
  async mounted() {
    const userId = store.state.user_id;
    this.user_id = userId;
  },
  methods: {
    async createBook() {
      const token = sessionStorage.getItem("token");
      try {
        const response = await fetch(window.location.origin + "/api/books", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": token,
          },
          body: JSON.stringify({
            book_name: this.book_name,
            author: this.author,
            d_link: this.d_link,
            published_date: this.published_date,
            section_name: this.section_name,
            content: this.content,
            user_id: this.user_id
          })
        });
        const result = await response.json();
        if (response.ok) {
          alert('Book created successfully');
          router.push('/admindash1');
        } else {
          console.error('Error response:', result);
          alert(`Failed to create new book: ${JSON.stringify(result)}`);
        }
      } catch (error) {
        console.error('Error creating book:', error);
        alert('An error occurred while creating the book.');
      }
    }
    
  }
};

export default AddBook;
