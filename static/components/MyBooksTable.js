const MyBooksTable = {
  template: `
    <div>
      <div id="tables">
        <h3>All my current books</h3>
        <div id="trans-table">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">#Id</th>
                <th scope="col">Name</th>
                <th scope="col">Section</th>
                <th scope="col">Author</th>
                <th scope="col">Date issued</th>
                <th scope="col">Return Date</th>
                <th scope="col">Return Book</th>
                <th scope="col">Read Book</th>
                <th scope="col">Download Book</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{book_id}}</td>
                <td>{{book_name}}</td>
                <td>{{section_name}}</td>
                <td>{{author}}</td>
                <td>{{issue_date}}</td>
                <td>{{return_date}}</td>
                <td v-if="status === 'with user'">
                  <router-link :to="'/review/' + user_id + '/' + book_id">
                    <button type="button" class="btn btn-warning">Return?</button>
                  </router-link>
                </td>
                <td v-else>TBA</td>
                <td v-if="status === 'with user'">
                  <router-link :to="'/read/' + book_id">
                    <button type="button" class="btn btn-success">Read</button>
                  </router-link>
                </td>
                <td v-else>TBA</td>
                <td v-if="status === 'with user'">
                  <router-link :to="'/download/' + book_id">
                    <button type="button" class="btn btn-info">Pay and Download</button>
                  </router-link>
                </td>
                <td v-else>TBA</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  props: {
    book_id: {
      type: Number,
      required: true,
    },
    book_name: {
      type:String,
      required: true,
    },
    section_name: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    issue_date: {
      type: String,
      required: false,
    },
    return_date: {
      type: String,
      required: false,
    },
    user_id: {
      type: Number,
      required: true,
    }
  },
  methods: {

  }
};

export default MyBooksTable;
