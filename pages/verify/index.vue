<template>
<v-app>
  <h1 class="text-center mt-5">Please verify your code...</h1>
     <v-layout row wrap class="mt-5">
        <v-flex xs12 sm6 offset-sm3 >
            <v-card color="white" light>
                <v-container v-if="verifyForm">

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
                <v-container v-else>
                  <h4>Thank you for verifying. An email will be with you shortly with a link to your photograph.</h4>
                  <p>Check your spam folder if you have not received your email within 30 minutes</p>
                  <p>If you stil haven't received your link then please contact me at: </p>
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
      customerEmail: "",
      verifyForm: true
    }
  },
  methods: {
    submitForVerification(){
      this.$store.dispatch("createEmail", {
        email: this.customerEmail,
        uniqueID: this.customerCode
      })
    }
  }
}
</script>

<style lang="scss">

</style>
