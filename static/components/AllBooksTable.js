

const AllBooksTable = {
    template: `
      <div>
        <h3>{{ book_name }}</h3>
        <div id="trans-table">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">#Id</th>
                <th scope="col">Name</th>
                <th scope="col">Section</th>
                <th scope="col">Date of publish</th>
                <th scope="col">Author</th>
                <th scope="col">Average Rating</th>
                <th scope="col">Request book</th>
              </tr>
            </thead>
            <tbody>
                <tr>
                <td>{{ book_id }}
                <td>{{ book_name }}</td>
                <td>{{ section_name }}</td>
                <td>{{ published_date }}</td>
                <td>{{ author }}</td>
                <td>{{ rating }}</td>
                <td v-if=" status  === 'in store'">
                  <button type="button" class="btn btn-success" @click="requestBook(book_id,user_id)">Request</button>
                </td>
                <td v-else>TBA</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `,
props : {
  book_id: {
    type: Number,
    required: true,
  },
  book_name: {
    type: String,
    required: true,
  },
  section_name: {
    type: String,
    required: true,
  },
  published_date: {
    type: String,
    required: false,
  },
  author: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  user_id: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
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

export default AllBooksTable