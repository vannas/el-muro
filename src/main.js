import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'
import 'firebase/auth'
import './firebase.js'

import VueFirestore from 'vue-firestore';
import router from "@/router"
import App from './App.vue'


Vue.use(Vuex);
Vue.use(VueFirestore, {key: 'id'});

Vue.config.productionTip = false

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);

const store = new Vuex.Store ({
  state: {
    user: null,
    error: null,
    image: null
  },
  mutations: {
    //mutación para cambiar estado user
    set_user(state, new_userid){
      state.user = new_userid;
    },

    //mutación para cambiar estado error
    set_error(state, new_error){
      state.error = new_error;
    },

    set_image(state, new_image){
      state.image = new_image;
    }
  
  },
  actions: {    
    login(context, datos){
      firebase.auth().signInWithEmailAndPassword(datos.email, datos.password)
      .then(function (response){
        context.commit('set_error', null);
        context.commit('set_user', {email: datos.email, name: response.user.displayName});
        router.push('/');
      })
      .catch(function (error) {
        context.commit('set_error', error.message);
        context.commit('set_user', null);
      })  
    },

    register(context, datos){
      firebase.auth().createUserWithEmailAndPassword(datos.email, datos.password)
      .then(function (response){
        console.log(response);
        firebase.auth().currentUser.updateProfile({
          displayName: datos.name
        })
      })
      .then((response) => {
        //guarda en almacén
        console.log(response);
        context.commit('set_error', null);
        context.commit('set_user', {email: datos.email, name: datos.name});
        router.push('/');
      })
      .catch(function (error){
        context.commit('set_error', error.message);
        console.log(error);
        context.commit('set_user', null);
      })
    },

    logout(context){
      firebase.auth().signOut()
      .then(() => {
        context.commit('set_error', null);
        context.commit('set_user', null);
        router.push('/login');
      })
    }
  },
})

new Vue ({
  render: h => h(App),
  store,
  router
}).$mount('#app')
