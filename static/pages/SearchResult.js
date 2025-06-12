import store from "../utils/store.js";

const SearchResult = {
    template: `
      <div>
        <h3>Book and Author Search</h3>
        <div v-if="searchResultsBook.length === 0">
          <h4>No books found with the name or author</h4>
        </div>
        <div v-else id="trans-table2">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Book Number</th>
                <th scope="col">Book Title</th>
                <th scope="col">Author</th>
                <th scope="col">Section</th>
                <th scope="col">Date Published</th>
                <th scope="col">Request Book</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="book in searchResultsBook" :key="book.id">
                <td>{{ book.id }}</td>
                <td>{{ book.book_name }}</td>
                <td>{{ book.author }}</td>
                <td>{{ book.section.section_name }}</td>
                <td>{{ book.published_date }}</td>
                <td v-if="book.status === 'in store'">
                    <button type="button" class="btn btn-success" @click="requestBook(book.id,user_id)">Request</button>
                  </a>
                </td>
                <td v-else>TBA</td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <h3>Section Search</h3>
        <div v-if="searchResultsSection.length === 0">
          <h4>No sections were found with the name</h4>
        </div>
        <div v-else id="trans-table2">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Section ID</th>
                <th scope="col">Section Name</th>
                <th scope="col">Publishing Date</th>
                <th scope="col">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sec in searchResultsSection" :key="sec.section_id">
                <td>{{ sec.section_id }}</td>
                <td>{{ sec.section_name }}</td>
                <td>{{ sec.pub_date }}</td>
                <td>{{ sec.description }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `,
    data() {
        return {
            searchResultsBook: [],
            searchResultsSection: [],
            user_id: null,
        };
    },
    async mounted() {
        const token = sessionStorage.getItem("token");
        const searchWord = this.$route.query.srch_word || '';
        this.user_id = store.state.user_id

        try {
            const res = await fetch(`${window.location.origin}/api/search/${this.user_id}?srch_word=${encodeURIComponent(searchWord)}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            const data = await res.json();
            this.searchResultsBook = data.books || [];
            this.searchResultsSection = data.sections || [];
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    },
    methods: {
        async requestBook(book_id,user_id) {
          try {
            const response = await fetch(`/api/request_book/${book_id}/${user_id}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            const data = await response.json();
            if (response.ok) {
              alert(data.message);
              this.$emit('book-requested');
            } else {
              alert(`Error: ${data.error}`);
            }
          } catch (error) {
            console.error('Error requesting book:', error);
          }
        },
      },
};

export default SearchResult;
