<template>
  <div id="app">
    <nav class="navbar navbar-expand-sm navbar-dark bg-dark static-top">
      <span class="navbar-brand"> <i class="fa fa-book"></i> {{ title }} </span>

      <ul class="navbar-nav ml-auto">
        <li class="nav-item dropdown">
          <a class="nav-link" data-toggle="dropdown">
            <i class="fas fa-bars"></i>
          </a>
          <div class="dropdown-menu dropdown-menu-right text-right">
            <a class="dropdown-item" v-on:click="navigateToHome">Home</a>
            <a class="dropdown-item" v-on:click="navigateToUpload"
              >Upload New Pictures</a
            >
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" v-on:click="signOut">Sign Out</a>
          </div>
        </li>
      </ul>
    </nav>

    <div class="container-fluid"><router-view /></div>
  </div>
</template>

<script>
const fb = require("@/firebase-config");

export default {
  data: function() {
    return {
      title: process.env.VUE_APP_TITLE
    };
  },
  methods: {
    userExists() {
      return fb.auth.currentUser !== null;
    },
    signOut() {
      fb.auth
        .signOut()
        .then(() => {
          this.$router.push("/login");
        })
        .catch(err => {
          // eslint-disable-next-line no-console
          console.log(err);
        });
    },
    navigateToHome() {
      this.$router.push("/");
    },
    navigateToUpload() {
      this.$router.push("/upload");
    }
  }
};
</script>

<style>
#app {
  height: 100%;
  background-color: lightgrey;
}

.container-fluid {
  height: 90%;
}

.fa-book {
  padding-right: 0.4rem;
}
</style>
