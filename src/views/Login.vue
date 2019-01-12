<template>
  <div class="wrapper">
    <div v-if="performingRequest" id="loading">
      <i class="fas fa-spinner fa-spin"></i>
      <span class="space-left">Loading...</span>
    </div>
    <div v-else id="login-btn">
      <button type="button" class="btn btn-danger" v-on:click="googleLogin">
        <i class="fab fa-google"></i>
        <span class="space-left">Sign in with Google</span>
      </button>
    </div>
  </div>
</template>

<script>
import { auth } from "firebase/app";
const fb = require("@/firebase-config");

export default {
  name: "Login",
  data() {
    return {
      performingRequest: false
    };
  },
  methods: {
    googleLogin: function() {
      this.performingRequest = true;

      const provider = new auth.GoogleAuthProvider();

      // eslint-disable-next-line no-unused-vars
      fb.auth.signInWithPopup(provider).then(user => {
        this.performingRequest = false;
        this.$router.push("/");
      });
    }
  }
};
</script>

<style scoped>
.wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-gap: 2rem;
}

#login-btn {
  grid-column-start: 2;
  grid-row-start: 2;
  color: #fff;
  text-align: center;
}

#loading {
  grid-column-start: 2;
  grid-row-start: 2;
  text-align: center;
}

.space-left {
  padding-left: 0.6rem;
}
</style>
