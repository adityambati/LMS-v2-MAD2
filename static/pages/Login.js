import router from "../utils/router.js";
import store from "../utils/store.js";

const Login = {
  template: `
  <div id="canvas">
    <div id="main_form">
        <h3 class="card-title text-center mb-4" style="color: white">Login</h3>
      <div class="card shadow p-4 border rounded-3 ">
        <div class="form-group mb-3">
          <input v-model="email" type="email" class="form-control" placeholder="Email" required/>
        </div>
        <div class="form-group mb-4">
          <input v-model="password" type="password" class="form-control" placeholder="Password" required/>
        </div>
        <button class="btn btn-outline-dark w-100" @click="submitInfo">Submit</button>
      </div>
    </div>
  </div>
  `,
  data() {
    return {
      email: "",
      password: "",
      id: "",
    };
  },
  methods: {
    async submitInfo() {
      const url = window.location.origin;
      const res = await fetch(url + "/user-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: this.email, password: this.password }),
      });

      if (res.ok) {
        const data = await res.json();
        store.commit('setLogin');
        store.commit('setUserId', data.id)
        store.commit('setRole', data.role);

        console.log(data);
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("email", data.email);
        sessionStorage.setItem("role", data.role);
        sessionStorage.setItem("role", data.role);
        console.log(sessionStorage.getItem("token"));

        this.$store.commit('setLogin', true);
        this.$store.commit('setRole', data.role)

        if (data.role === "user"){
          router.push("/dashuser1");
        }
        else if (data.role === "admin"){
          router.push("/admindash1");
        }
      } else {
        const errorData = await res.json();
        console.error("Login failed:", errorData);
        // Handle login error
      }
    },
      
  },
};

export default Login;
