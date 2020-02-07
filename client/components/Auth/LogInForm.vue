<template>
<client-only>
  <v-container text-center mt-5 pt-5>
  <!--SignIn Title-->

    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3 mb-3>
        <h1>Welcome Back!</h1>
      </v-flex>
    </v-layout>
     <!--SignIn Title End-->
    <!--Form-->
    <v-layout row wrap>
    <v-flex xs12 sm6 offset-sm3 >
     <v-card color="white" light>
       <v-container>

         <v-form @submit.prevent="handleSignInUser">

           <v-layout row>
             <v-flex xs12>
              <v-text-field
              prepend-icon="face"
              label="Name"
              type="text"
              required
              v-model="name"
              ></v-text-field>
             </v-flex>
           </v-layout>

           <v-layout row>
             <v-flex xs12>
              <v-text-field
              prepend-icon="extension"
              label="Password"
              type="password"
              required
              v-model="password"
              ></v-text-field>
             </v-flex>
           </v-layout>

              <v-layout row>
             <v-flex xs12>
             <v-btn color="secondary" type="submit">Signin</v-btn>
             <h3>Not have an account?
            <nuxt-link to="/admin/auth/signup" >Sign Up Now</nuxt-link>
             </h3>

             </v-flex>
           </v-layout>

         </v-form>

       </v-container>
     </v-card>
    </v-flex>
    </v-layout>
    <!--Form End-->
  </v-container>
</client-only>
</template>

<script>
import { mapGetters } from "vuex"
export default {
  data () {
    return {
      name: "",
      password: ""
    }
  },
  computed: {
    ...mapGetters([
      "admin"
    ])
  },
  watch: {
    admin(value) {
      //If admin value in state changes
      if(value){
        this.$router.push("/")
      }
    }
  },
  methods: {
    handleSignInUser(){
      if(this.$store.state.token){
        console.log("state", this.$store.state.token)
         this.$router.push("/")
      }
      this.$store.dispatch('signInAdmin', {
        name: this.name,
        password: this.password
      })
      // this.$store.dispatch("getCurrentAdmin")
    }
  },
  middleware: "isAuth"
}
</script>

<style scoped>
a {
  color: #FFC107 !important;
}
h1 {
  background: #B0BEC5;
  color: #fff;
}
</style>
