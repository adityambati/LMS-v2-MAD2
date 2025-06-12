import router from "../utils/router.js";

const Register = {
  template: `
  <div id="canvas">
    <div id="main_form">
        <h3 class="card-title text-center mb-4" style="color: white">Register</h3>
      <div class="card shadow p-4 border rounded-3 ">
        <div class="form-group mb-3">
          <input v-model="email" type="email" class="form-control" placeholder="Email" required/>
        </div>
        <div class="form-group mb-3">
          <input v-model="user_name" type="user_name" class="form-control" placeholder="User_name" required/>
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
      user_name: "",
      role: "user",
    };
  },
  methods: {
    async submitInfo() {
      const origin = window.location.origin;
      const url = `${origin}/register`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: this.email,
          password: this.password,
          user_name: this.user_name,
          role: this.role,
        }),
        credentials: "same-origin",
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data);
        router.push("/");
      } else {
        const errorData = await res.json();
        console.error("Sign up failed:", errorData);
      }
    },
  },
};

export default Register;