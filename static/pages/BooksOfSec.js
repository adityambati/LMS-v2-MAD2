import store from "../utils/store.js";
const BooksOfSec = {
    template: `
    <div>
    <h3>Books of the section</h3>
            <div id="trans-table" v-if="allSectionBooks.length === 0">
                <h4>No books yet</h4>
            </div>
              <div v-else id="trans-table">
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">Book Number</th>
                    <th scope="col">Name</th>
                    <th scope="col">Author</th>
                    <th scope="col">Published date</th>
                    <th scope="col">Read Book</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(book, index) in allSectionBooks" :key="book.id">
                    <th scope="row">{{index + 1}}</th>
                    <td>{{book.book_name}}</td>
                    <td>{{book.author}}</td>
                    <td>{{book.published_date}}</td>
                    <td>
                        <router-link :to="'/read/' + book.id">
                            <button type="button" class="btn btn-success">Read</button>
                        </router-link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <router-link to="/add_book">
              <button type="button" class="btn btn-dark btn-lg">Add Book</button>
            </router-link>
            <router-link to="/delete_book">
              <button type="button" class="btn btn-danger btn-lg">Delete Book</button>
            </router-link>
         </div>
    `,
    data() {
      return {
        allSectionBooks: [],
      };
    },
    async mounted() {
        const userId = store.state.user_id;
        const token = sessionStorage.getItem("token");
        const secId = this.$route.params.sec_id;
        console.log('User ID from store:', userId);
        this.user_id = userId;
    
        const res = await fetch(`${window.location.origin}/api/books_of_sec/${secId}`, {
        headers : {
            "Authentication-Token" : sessionStorage.getItem("token"),
        },
        });
        const data = await res.json();
        this.allSectionBooks = data;
      },
  };
  
  export default BooksOfSec;
  