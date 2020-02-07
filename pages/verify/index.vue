<template>
<v-app>
  <h1 class="text-center mt-5">Please verify your code...</h1>
     <v-layout row wrap class="mt-5">
        <v-flex xs12 sm6 offset-sm3 >
            <v-card color="white" light>
                <v-container>

         <v-form @submit.prevent="submitForVerification">

           <v-layout row>
             <v-flex xs12>
              <v-text-field
              prepend-icon="dialpad"
              label="Unique Code"
              type="text"
              required
              v-model="customerCode"
              ></v-text-field>
             </v-flex>
           </v-layout>
             <v-layout row>
             <v-flex xs12>
              <v-text-field
              prepend-icon="alternate_email"
              label="Email Address"
              type="text"
              required
              v-model="customerEmail"
              ></v-text-field>
             </v-flex>
           </v-layout>
            <v-layout row >
             <v-flex row justify-center>
             <v-btn color="secondary" type="submit" class="center" >Submit</v-btn>
             </v-flex>
           </v-layout>
         </v-form>
                </v-container>
            </v-card>
        </v-flex>
    </v-layout>
</v-app>


</template>

<script>
export default {
  layout: "customer",
  data(){
    return {
      customerCode: "",
      customerEmail: ""
    }
  },
  methods: {
    submitForVerification(){
      this.$axios.$post("http://localhost:4500/", {
       code: this.customerCode,
       email: this.customerEmail
      }).then(res => console.log(res))
    }
  }
}
</script>

<style lang="scss">

</style>
