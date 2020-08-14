<template>

<div class="container">

    <div class="card red lighten 1 white-text" v-if="user">
        <div class="welcome"> 
            <h4 v-if="user">Welcome {{ user.name }}!</h4>
        </div>
        <div class="text-justify wrapper-formulario" v-if="user">
            <h6 class="">What's on your mind?</h6>

            <form @submit.prevent="add_imagepost">

                <input type="text" v-model="text_title" id="post_title" rows="8">
                <textarea v-model="text_post" id="user_input" required cols="30" rows="10" placeholder="Write a post"></textarea>
                <form action="#" class="upload-i">
                    <div class="file-field input-field">
                        <div class="amber btn_img left">
                            <span><i class="material-icons">camera_enhance</i></span>
                            <input type="file" @change="get_image">
                        </div>
                        <div class="file-path-wrapper">
                            <input class="file-path validate" type="text">
                        </div>
                    </div>
                </form>                
                <div class="row">
                    <button class="btn waves-effect waves-light amber" type="submit" name="action">
                        <i class="small material-icons">record_voice_over</i>
                    </button>
                </div>
                
            </form>
        </div> 
    </div>
    

    <div class="card the-wall" v-if="user">
        <div class="row">
            <h5 class="red-text align-left">Your Universe</h5>
            
            <div class="card wallposts" v-for="post in sortedPosts" :key="post.id">
                    <div class="card-title wallpost-t red-text" v-if="post.image">{{post.title}}</div>
                    <div class="card-image wallpost-i" v-if="post.image != null">
                        <img :src="post.image">
                    </div>
                    
                    <div class="card-title wallpost-t red-text" v-if='post.image == "" '>{{post.title}}</div>
                    <div class="card-content wallpost-cont"> 
                        {{ post.content }}
                    </div>

                    <div class="likey">
                        <a class="black-text" @click.prevent="quitarlike(post.id)" href="#">  <i class="material-icons">favorite_border</i></a>
                        {{ post.likes }}
                        <a class="red-text" @click.prevent="darlike(post.id)" href="#">  <i class="material-icons">favorite</i></a>
                    </div>

                    <div class="card-action wallpost-by"><router-link :to="'/wallpost/'+ post.id">{{post.by}} said this at {{post.date}}</router-link> || {{post.likes}} </div>
            </div>

            <div class="footer">
                <button class="yellow btn-floating mouse" @click="logout"><i class="large material-icons red">pest_control_rodent</i></button>
            </div>   

        </div>
    </div>

</div>

</template>

<script>

import { db } from '../firebase';  //link to the firebase databank 
import firebase from 'firebase'

const getDate = () => {
  const trailing = (d) => d.length < 10 ? '0'+d : d;
  const now = new Date();
  return `${trailing(now.getHours())}:${trailing(now.getMinutes())} on ${trailing(now.getDate())}-${trailing(now.getMonth())+1}-${now.getFullYear()}`;
}


export default {
    name: 'Home',
    data() {
        return {
            posts: [],        
            text_title: '',
            text_post: '',
            image_posted: null,
            date_posted: null,
        }
    },
    methods: {
        logout() {
            console.log('out of here');
            this.$store.dispatch('logout');
        },
        addnewpost(image_url){
            db.collection('wallposts').add({
                by:this.user.name,
                title:this.text_title,
                content:this.text_post,
                image:image_url,
                date: getDate(),
                likes:0
            });
            //
            this.text_post= '',
            this.text_title='',
            this.image_posted=''
        }, 
        //Recupero imagen si esta existe en el post. Si no (if), lo ignoro
        get_image(ev){
            if (ev.target.files.length == 0){
                return
            }
            this.image_posted= ev.target.files[0];            
        },

        //Posteo finalmente. Si hay imagen, este proceso, si no,
        //esta funcion llama a addnewpost
        add_imagepost(){
            if (this.image_posted == null){
                this.addnewpost(null);
                return;
            }
            //De existir imagen, procedo a subirla a data storage de firebase
           const storageRef= firebase.storage().ref(this.image_posted.name). put(this.image_posted);
           storageRef.on('state_changed',
            function(){
                //cuando el estado cambie (?)
            },
            function(upload_error){ 
                //en caso de error
                console.log(upload_error)
            },
            () => {
                storageRef.snapshot.ref.getDownloadURL()
                .then(url => {
                    this.addnewpost(url)
                })
            })
        },
        darlike(post_id){
            // Primer paso, recupero el post según id
            const post = this.posts.find(post => post.id == post_id);
                // actualizo en la base de datos
            this.$firestore.posts.doc(post_id).update({
            likes: post.likes++
        });
        },
        quitarlike(post_id){
            const post= this.posts.find(post => post.id == post_id);
            this.$firestore.posts.doc(post_id).update({
                likes: post.likes--
            });
        }
    },
    computed: {
        user() {
            return this.$store.state.user;
        },
        sortedPosts(){
            return this.posts.slice().sort((a,b)=> {return a.date - b.date})
        }   
    },
    firestore() {           // adding this key/function
        return {
            posts: db.collection('wallposts')
        }
    }
}
    

</script>

<style scoped>

.container{
    margin-top:10px;
    text-align: center;   
}

h6{
    margin-left:30em;
    opacity: 80%;
}

.card{
    border-radius: 100px;
    overflow:hidden;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.mouse{    
    height:2.5rem;
    width:2.5rem;
    border:2px solid white;
    margin-top:1.2em;
}

.wrapper-formulario {
    margin:0 auto;
    overflow:hidden;
    color:white;
}

#post_title {
    border-radius: 100px;
    width:80%; 
    height:2em;
    padding-right:3em;
    text-align:right;
    opacity:50%;
    background-color:white;
}
#user_input, input-field {
    border-radius: 100px;
    height:6em;
    width:90%;
    padding: 1em 2.5em 0.8em 2.5em;
    opacity:50%;
    background-color:white;
}

.btn_img{
    border-radius: 50px;
    width:2.5em;
    height:2.5em;
    padding-top:0.52em;
    padding-right:0.1em;
}
.upload-i {
    width:50%;
    margin:0 auto;
    height:1em;
    margin-bottom:3em;
}

#sendy{
    display:block;
    position:relative;
    margin-left:88%;  
}

.wallposts{
    margin:2em auto;
    width:80%;
    padding:1rem;
}

.wallpost-t{    
    display:block;
    margin:-0.3em auto;
    vertical-align: top;
}

.wallpost-i img{
    display:inline;
    vertical-align: bottom;
    max-width:200px;
    margin: 1em;
}

.wallpost-by, card-action{
    margin:0em;
    height:2em;
}
.card-content {
    display:block;
    text-align: justify;
    padding:2px;
    text-align:center;
}

.likey {
    margin:1em;
    text-align:center;
}

</style>