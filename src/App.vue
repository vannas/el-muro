<template>
  <div id="app">    
    <nav>
      <div class="nav-wrapper" id="nav">
        <ul id="nav-mobile" class="left hide-on-med-and-down">
          <li v-if="$route.path != '/login'"><router-link to="/"><i class="large material-icons">house</i></router-link></li>
          <li><router-link to="/login"><i class="large material-icons">account_circle</i></router-link></li>
          <li v-if="user"><router-link to="/login" @click="logout"><i class="large material-icons out">pest_control_rodent</i>Logout</router-link></li> 
        </ul>
      </div>
    </nav>

    <router-view/> 

  </div>
</template>

<script>
import firebase from 'firebase/app'

export default {
  name: 'App',
  components: {
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    logout(){
      firebase.auth().signOut();
    },
  }
}
</script>

<style>
#app, html {
  font-family: 'Oswald', sans-serif;
  font-size: 18px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color:#e0e0e0;
}

#nav{
  background: #ED4264;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to center, #FFEDBC, #ED4264);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to center, #FFEDBC, #ED4264); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

}

nav li .out{
  display: inline-block;
  margin-right:0.5em;
}

</style>
