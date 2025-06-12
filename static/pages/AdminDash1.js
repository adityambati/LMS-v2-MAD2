import store from "../utils/store.js";

const AdminDash1 = {
  template: `
    <div>
      <div>
        <h3>Sections/Categories of books</h3>
        <div v-if="allSections.length === 0">
          <h4>No books yet</h4>
        </div>
        <div v-else id="trans-table">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Section Number</th>
                <th scope="col">Category</th>
                <th scope="col">Creation Date</th>
                <th scope="col">Description</th>
                <th scope="col">View Books</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(section, index) in allSections" :key="section.section_id">
                <th scope="row">{{ index + 1 }}</th>
                <td>{{ section.section_name }}</td>
                <td>{{ section.pub_date }}</td>
                <td>{{ section.description }}</td>
                <td>
                  <router-link :to="'/books_of_sec/' + section.section_id">
                    <button type="button" class="btn btn-outline-info">View</button>
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <router-link to="/add_sec">
          <button type="button" class="btn btn-dark btn-lg">Add Section</button>
        </router-link>
        <router-link to="/delete_sec">
          <button type="button" class="btn btn-danger btn-lg">Delete Section</button>
        </router-link>
      </div>
      <div>
      <h3>---------------------------------------</h3>
      <h5>Download all books data in CSV format</h5>
        <button @click="startExport">Export to CSV</button>
        <div v-if="exporting">Exporting... Please wait.</div>
        <a v-if="downloadLink" :href="downloadLink" download="file.csv">Download CSV</a>
      </div>
    </div>
  `,
  data() {
    return {
      allSections: [],
      exporting: false,
      downloadLink: null,
    };
  },
  async mounted() {
    const userId = store.state.user_id;
    const token = sessionStorage.getItem("token");
    console.log('User ID from store:', userId);
    this.user_id = userId;

    const res = await fetch(window.location.origin + "/api/resources", {
      headers: {
        "Authentication-Token": sessionStorage.getItem("token"),
      },
    });
    const data = await res.json();
    this.allSections = data;
  },
  methods: {
    async startExport() {
      this.exporting = true;
      this.downloadLink = null;

      try {
        const response = await fetch('/start-export');
        const data = await response.json();
        const taskId = data.task_id;

        await this.checkExportStatus(taskId);
      } catch (error) {
        console.error('Error starting export:', error);
        this.exporting = false;
      }
    },
    async checkExportStatus(taskId) {
      const interval = setInterval(async () => {
        try {
          const response = await fetch(`/get-csv/${taskId}`);
          if (response.status === 200) {
            this.downloadLink = response.url;
            clearInterval(interval);
            this.exporting = false;
          }
        } catch (error) {
          console.error('Error checking export status:', error);
        }
      }, 2000); // Check every 2 seconds
    },
  },
};

export default AdminDash1;
