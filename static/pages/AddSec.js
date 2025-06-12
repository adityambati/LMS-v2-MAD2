import store from "../utils/store.js";
import router from "../utils/router.js";
const AddSec = {
    template: `
    <div>
    <div id="tables">
    <h2>Add New Section</h2></div>
  <form @submit.prevent="createSection">
    <div id="canvas2">
        <div class="mb-3">
            <label for="s_name" class="form-label">Name of section:</label>
            <input type="text" class="form-control" id="s_name" v-model="section_name" required>
          </div>
          <div class="mb-3">
            <label for="date0" class="form-label">Date of creation:</label>
            <input type="date" class="form-control" id="date0" v-model="pub_date" required>
          </div>
          <div class="mb-3">
            <label for="description" class="form-label">Description of this section</label>
            <textarea class="form-control" id="description" rows="3" v-model="description"></textarea>
          </div>
          <div id="tables">
            <router-link to="/admin">
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
        section_name: '',
        pub_date: '',
        description: '',
        user_id: null
      };
    },
    async mounted() {
        const userId = store.state.user_id;
        this.user_id = userId;
      },
      methods: {
        async createSection() {
          const token = sessionStorage.getItem("token");
          try {
            const response = await fetch(window.location.origin + "/api/resources", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authentication-Token": token,
              },
              body: JSON.stringify({
                section_name: this.section_name,
                pub_date: this.pub_date,
                description: this.description
              })
            });
            const result = await response.json();
            if (response.ok) {
              alert('Section created successfully');
              router.push('/admindash1');
            } else {
              alert(`Failed to create section: ${result.message}`);
            }
          } catch (error) {
            console.error('Error creating section:', error);
            alert('An error occurred while creating the section.');
          }
        }
      }
  };
  
  export default AddSec;
  