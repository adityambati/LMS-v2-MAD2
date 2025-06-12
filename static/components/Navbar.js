import store from "../utils/store.js";

const Navbar = {
  template: `
    <nav class="h3 w-auto d-flex justify-content-around">
      <router-link to='/' style="color: black;">Home</router-link>
      <router-link to='/register' style="color: black;">Register</router-link>
      <router-link v-if="state.loggedIn && state.role==='user'" to='/dashuser1' style="color: black;">All Books</router-link>
      <router-link v-if="state.loggedIn && state.role==='user'" to='/dashuser2' style="color: black;">My Books</router-link>
      <router-link v-if="state.loggedIn && state.role==='admin'" to='/admindash1' style="color: black;">Sections/Books</router-link>
      <router-link v-if="state.loggedIn && state.role==='admin'" to='/admindash2' style="color: black;">Book Management</router-link>
       <form v-if="state.loggedIn && state.role==='user'" @submit.prevent="handleSearch" class="d-flex">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search..."
          class="form-control"
          style="margin-right: 10px;"
        />
        <button type="submit" class="btn btn-primary">Search</button>
      </form>

      <a v-if="state.loggedIn" :href="logoutURL" style="color: black;">Logout</a>
    </nav>
  `,
  data() {
    return {
      searchQuery: ''
    };
  },
  computed: {
    state() {
      console.log("Navbar loggedIn state:", store.state.loggedIn);
      return this.$store.state;
    },
    logoutURL() {
      return window.location.origin + "/logout";
    }
  },
  methods: {
    handleSearch() {
      this.$router.push({ path: `/search`, query: { srch_word: this.searchQuery } });
    }
  }
};

export default Navbar;
