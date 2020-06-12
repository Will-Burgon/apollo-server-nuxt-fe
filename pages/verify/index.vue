<template>
<v-app>
  <h1 class="text-center mt-5">Please verify your code...</h1>
     <v-layout row wrap class="mt-5">
        <v-flex xs12 sm6 offset-sm3 >
            <v-card color="white" light>
                <v-container v-if="!loading">

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
                  <p>If you still haven't received your link then please contact me at: </p>
                </v-container>
                <v-container>
                <v-dialog
                  max-width="290"
                  v-model="emailError"
                  >
                  <v-card>
                     <v-spacer></v-spacer>
                    <v-card-text class="pt-4">
                    Sorry there is no image associated with that code. Please check the characters.
                    If you are still having trouble then please contact me on...
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>

                      <v-btn
                        color="green darken-1"
                        text
                        @click="hideEmailError"
                      >
                        Ok
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                </v-container>

            </v-card>
        </v-flex>
    </v-layout>
</v-app>


</template>

<script>
import { mapGetters } from 'vuex'
export default {
  layout: "customer",
  data(){
    return {
      customerCode: "",
      customerEmail: "",
      dialog: false
    }
  },
  computed:{
    ...mapGetters(['loading', 'emailError'])
  },
  methods: {
    submitForVerification(){
      this.$store.dispatch("createEmail", {
        email: this.customerEmail,
        uniqueID: this.customerCode
      })
    },
    hideEmailError(){
      this.$store.commit("setEmailError", false)
    }
  }
}
</script>

<style lang="scss">

</style>
