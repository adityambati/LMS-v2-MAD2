import store from "../utils/store.js";
const AdminDash2 = {
    template: `
    <div>
    <h3>User Book Approvals</h3>
            <div v-if="bookApprovals.length === 0">
                <h4> No books yet</h4>
            </div>
              <div v-else id="trans-table2">
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">Book Number</th>
                    <th scope="col">Book Title</th>
                    <th scope="col">User Name</th>
                    <th scope="col">Decline</th>
                    <th scope="col">Accept</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(book, index) in bookApprovals" :key="book.id">
                    <th scope="row">{{index+1}}</th>
                    <td>{{book.book_name}}</td>
                    <td>
                      <router-link :to="'/user_info/' + book.user_id">
                        <a href style="color: white">{{book.user_name}}</a>
                      </router-link>
                    </td>
                    <td><button type="button" class="btn btn-danger" @click="declineApproval(book.id)">Revoke</button></td>
                    <td><button type="button" class="btn btn-primary" @click="acceptApproval(book.id)">Accept</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <h3>Already issued books</h3>
            <div v-if="issuedBooks.length === 0">
                <h4> No books issued</h4>
            </div>
            <div v-else id="trans-table2">
                <table class="table">
                  <thead>
                    <tr>
                      <th scope="col">Book Number</th>
                      <th scope="col">Book Title</th>
                      <th scope="col">User Name</th>
                      <th scope="col">Revoke Book</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(book, index) in issuedBooks" :key="book.id">
                      <th scope="row">{{index +1}}</th>
                      <td>{{book.book_name}}</td>
                      <td>
                        <router-link :to="'/user_info/' + book.user_id">
                          <a href style="color: white">{{book.user_name}}</a>
                        </router-link>
                      </td>
                      <td><button type="button" class="btn btn-danger" @click="declineApproval(book.id)">Revoke</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
         </div>
    `,
    data() {
      return {
        bookApprovals: [],
        issuedBooks: [],
      };
    },
    async mounted() {
        const userId = store.state.user_id;
        console.log('User ID from store:', userId);
        this.user_id = userId;
    
        const res = await fetch(window.location.origin + "/api/books", {
          headers : {
            "Authentication-Token" : sessionStorage.getItem("token"),
          },
        });
        if (res.ok) {
            const data = await res.json();
            this.bookApprovals = data.filter(book => book.status === "with the admin");
            this.issuedBooks = data.filter(book => book.status === "with user");
          } else {
            console.error("Failed to fetch data");
        }
      },
      methods: {
        async acceptApproval(book_id) {
          try {
            const response = await fetch(`/api/accept_book/${book_id}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            const data = await response.json();
            if (response.ok) {
              alert('Book approved successfully');
              this.$emit('book-approved');
            } else {
              alert(`Error: ${data.error}`);
            }
          } catch (error) {
            console.error('Error approving book:', error);
          }
        },
        async declineApproval(book_id) {
            try {
              const response = await fetch(`/api/decline_book/${book_id}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
              });
              const data = await response.json();
              if (response.ok) {
                alert('Book decline/revoke successfully');
                this.$emit('book-revoked');
              } else {
                alert(`Error: ${data.error}`);
              }
            } catch (error) {
              console.error('Error revoking/declining book:', error);
            }
          },
      },
  };
  
  export default AdminDash2;
  