import store from "../utils/store.js";
import router from "../utils/router.js";
const DeleteSec = {
    template: `
    <div>
    <div id="tables"><h2>Delete Section</h2></div>
  <form @submit.prevent="deleteSection">
    <div id="canvas2">
        <div class="mb-3">
            <label for="s_name" class="form-label">Name of section:</label>
            <input type="text" class="form-control" id="s_name" v-model="section_name" required>
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
        section_name: '',
        user_id: null
      };
    },
    async mounted() {
        const userId = store.state.user_id;
        this.user_id = userId;
      },
      methods: {
        async deleteSection() {
          const token = sessionStorage.getItem("token");
          try {
            const response = await fetch(window.location.origin + "/api/resources", {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                "Authentication-Token": token,
              },
              body: JSON.stringify({
                section_name: this.section_name,
              })
            });
            const result = await response.json();
            if (response.ok) {
              alert('Section deleted successfully');
              router.push('/admindash1');
            } else {
              alert(`Failed to delete section: ${result.message}`);
            }
          } catch (error) {
            console.error('Error in deleting section:', error);
            alert('An error occurred while delete the section.');
          }
        }
      }
  };
  
  export default DeleteSec;
  