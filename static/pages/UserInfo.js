const UserInfo = {
    template: `
    <div>
      <div id="tables">
        <h2>User Information</h2>
      </div>
      <div id="canvas2">
        <div>
          <table class="table">
            <thead>
              <tr>
                <th scope="col">User ID:</th>
                <th scope="col">{{ userInfo.id }}</th>
              </tr>
            </thead>
          </table>
          <table class="table">
            <thead>
              <tr>
                <th scope="col">User Name:</th>
                <th scope="col">{{ userInfo.user_name }}</th>
              </tr>
            </thead>
          </table>
          <table class="table">
            <thead>
              <tr>
                <th scope="col">E-Mail Address:</th>
                <th scope="col">{{ userInfo.email }}</th>
              </tr>
            </thead>
          </table>
        </div>
        <div id="tables">
            <router-link to="/admindash2">
                <button type="button" class="btn btn-secondary btn-lg">Go Back</button>
            </router-link>
        </div>
      </div>
      </div>
    `,
    data() {
      return {
        userInfo: {},
      };
    },
    props: {
      user_id: {
        type: [String, Number],
        required: true,
      },
    },
    computed: {
        parsedUserId() {
          return Number(this.user_id);
        }
      },
    methods: {
      fetchUserInfo() {
        fetch(`/api/user_info/${this.parsedUserId}`, {
          headers: {
            "Authentication-Token": sessionStorage.getItem("token"),
          },
        })
          .then(response => response.json())
          .then(data => {
            if (data.message) {
              console.error('User not found');
            } else {
              this.userInfo = data;
            }
          })
          .catch(error => {
            console.error('Error fetching user information:', error);
          });
      },
    },
    mounted() {
      console.log(this.userId);
      this.fetchUserInfo();
    },
  };
  
  export default UserInfo;
  