Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    loggedIn: false,
    role: "",
    user_id: null,
  },

  mutations: {
    setLogin(state) {
      state.loggedIn = true;
    },
    logout(state) {
      state.loggedIn = true;
      state.user_id = null;
    },
    setRole(state, role) {
      state.role = role;
      console.log(state.role);
    },
    setUserId(state, user_id) {
      state.user_id = user_id;
      console.log(state.user_id);
    },
  },
});

export default store;
