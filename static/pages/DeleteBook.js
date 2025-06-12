import store from "../utils/store.js";
import router from "../utils/router.js";
const DeleteBook = {
    template: `
    <div>
    <div id="tables"><h2>Delete Book</h2></div>
  <form @submit.prevent="deleteBook">
    <div id="canvas2">
        <div class="mb-3">
            <label for="b_name" class="form-label">Name of book:</label>
            <input type="text" class="form-control" id="b_name" v-model="book_name" required>
          </div>
          <div id="tables">
          <router-link to="/admindash1">
            <button type="button" class="btn btn-danger btn-lg">Cancel</button>
          </router-link>
          <button type="submit" class="btn btn-primary btn-lg">Delete</button>
        </div>
      </div>
    </form>
    </div>
    `,
    data() {
      return {
        book_name: '',
        user_id: null
      };
    },
    async mounted() {
        const userId = store.state.user_id;
        this.user_id = userId;
      },
      methods: {
        async deleteBook() {
          const token = sessionStorage.getItem("token");
          try {
            const response = await fetch(window.location.origin + "/api/books", {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                "Authentication-Token": token,
              },
              body: JSON.stringify({
                book_name: this.book_name,
              })
            });
            const result = await response.json();
            if (response.ok) {
              alert('Book deleted successfully');
              router.push('/admindash1');
            } else {
              alert(`Failed to delete book: ${result.message}`);
            }
          } catch (error) {
            console.error('Error in deleting book:', error);
            alert('An error occurred while deleting the book.');
          }
        }
      }
  };
  
  export default DeleteBook;
  