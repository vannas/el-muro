<template>

<div class="container ">
    
    <div class="row">
        <div class="col s12 m12 black white-text error" v-if="error != null">
            <i class="material-icons">mood_bad</i>
            Nope.             {{error}}
            <i class="material-icons">error_outline</i>
        </div>
    </div>
    
    <div class="row">
    
    <div class="card col s5 m5 deep-orange lighten-2">
        <div class="card-title white-text"><h4 id="tit1"><i class="large material-icons">face</i> Sign in</h4></div>
        
        <div class="card-body">            
            <form id="login" class="" @submit.prevent="login">
                <!--<p><i class="material-icons">account_circle</i> <label for="username">Username:</label> <input id="username" type="text" class="validate"></p>-->
                
                <i class="material-icons">email</i> <label for="email">Email:</label> <input id="email" min="8" type="email" class="validate" required v-model="login_email">

                <i class="material-icons">lock</i> <label for="login_pass" min="8" class="grey-text validate">Password:</label>
                <input type="password" id="login_pass" class="validate" required v-model="login_pass"/>
                    
                <p><button class="btn waves-effect waves-light red nice" type="submit" name="action">Login <i class="material-icons prefix">near_me</i></button></p>
            </form>
        </div>
    </div>

    <div class="col s1 m1"></div>

    <div class="card col s5 m5 indigo lighten-3">
        <div class="card-title white-text"><h4 id="tit2"><i class="large material-icons">loyalty</i> Register</h4></div>        
        
        <form id="register" @submit.prevent="register" class="">            
            <label for="register_nom" class="grey-text validate">Username:</label>
            <input type="text" id="register_nom" class="validate" required v-model="register_username"/>
            <br/>
            
            <label for="register_mail" class="grey-text validate">E-mail:</label>
            <input type="email" id="register_mail" class="validate" required v-model="register_email"/>
            <br/>
            
            <label for="register_pass" min="8" class="grey-text validate">Password:</label>
            <input type="password" id="register_pass" class="validate" required v-model="register_pass"/>
            <br/>
            
            <label for="register_confirm" min="8" class="grey-text validate">Confirm your password:</label>
            <input type="password" id="register_confirm" class="validate" required v-model="register_confirm"/>
            <br/>
            
            <label for="register_pic" class="grey-text text-small">Upload Profile Picture:</label>
            <p><input type="file" id="register_pic" class="validate" required/></p>

            <p><button class="btn waves-effect waves-light nice red" type="submit" name="action">Register <i class="material-icons prefix">near_me</i></button></p>
            
        </form>
    </div>
    </div>
</div>
</template>

<script>

export default {
    name: 'LoginRegistro',
    data() {
        return {
        //variables login
        login_email: '',
        login_pass: '',
        //variables registro
        register_username: '',
        register_email: '',
        register_pass: '',
        register_confirm: ''
        }
    },

    computed: {
        error() {
            return this.$store.state.error;
        }
    },
    methods: {
        login() {
            console.log('login');
            console.log(this.login_email);
            
            const datos_log={email: this.login_email, password: this.login_pass};
            this.$store.dispatch('login', datos_log);
        },
        register() {
            const confirm= document.getElementById('register_confirm');
            confirm.setCustomValidity('');

            //Chequear confirmación de contraseña
            if (this.register_pass != this.register_confirm) {
                //alert('Check your spelling, your passwords don´t match')
                console.log(this.register_pass, this.register_confirm);
                confirm.setCustomValidity('Check your spelling, your passwords don´t match');
                return
            }
            //ingresar usuario
            const datos= {email: this.register_email, password: this.register_pass, name: this.register_username};
            this.$store.dispatch('register', datos);
        }
    }
   

}
</script>

<style scoped>

.error .material-icons{
    font-size: 40px;
    margin:0.5rem 0.5rem;
}

.material-icons{
    vertical-align: middle;
    color:white;
}
.card, #register, #login {
    display:inline-block;
    vertical-align: bottom;
    border:none;
    border-radius: 100px;
    color:white;
}

.card{
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.nice {    
    border-radius: 20px;
    vertical-align: middle;
}

.card-title h4{
    padding:0.2em;
    vertical-align: middle;    
}

.helper-text, ::placeholder, label, .grey-text {
    color:white !important ; 
}

input {
    max-height:2em;
    text-align: center;
    color:white;
}

#register_pic{
    font-size:12px;
}
</style>