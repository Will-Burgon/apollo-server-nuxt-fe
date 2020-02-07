<template>
  <v-app>

    <h1>Jobs</h1>
    <v-layout row wrap mt-5>
      <v-btn color="primary" @click="showCreateCustomerForm">Create a Job</v-btn>
    <create-customer-form v-if="showForm" v-on:customerCreated ="customerCreatedMethod">
    </create-customer-form>
    </v-layout>

   <v-row>
    <v-col cols="12" md="12" >
    <v-card v-if="customers.length">
      <v-container fluid>
        <v-row style="height: 100%;">
          <v-col
          v-for="(customer, index) in customers" :key="customer._id"
          class="d-flex align-center"
          cols="4">

          <v-card flat oulined tile class="d-flex flex-column ma-3 pa-2 grey darken-5" shaped width="300px">
           <v-card-subtitle class="text-wrap pa-2"> {{customer.logo}} </v-card-subtitle>
           <v-card-subtitle class="text-wrap pa-2"> {{customer.jobName}} </v-card-subtitle>
           <v-card-subtitle class="text-wrap pa-2"> {{customer.contact}} </v-card-subtitle>
           <v-card-subtitle class="text-wrap pa-2"> {{customer.email}} </v-card-subtitle>
           <v-card-subtitle class="text-wrap pa-2"> {{customer.phoneNo}} </v-card-subtitle>
           <v-card-subtitle class="text-wrap pa-2"> {{customer.dateCreated}} </v-card-subtitle>
           <v-card-subtitle class="text-wrap pa-2"> {{customer._id}} </v-card-subtitle>
               <v-card-actions>
      <v-btn color="success"
      absolute right>Details</v-btn>

      <v-btn
       color="warning"
      absolute left
        @click="deleteCustomer(customer._id, index)"
      >
        Delete
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon></v-icon>
      </v-btn>
    </v-card-actions>
          </v-card>
          </v-col>
        </v-row>

      </v-container>
    </v-card>

    </v-col>
   </v-row>

 </v-app>
</template>

<script>
import createCustomerForm from "~/components/Customers/CreateCustomerForm";
import { mapGetters } from "vuex";
import { TweenMax } from "gsap";

export default {
  components: {
    createCustomerForm
  },
  mounted(){
    const { customerList } = this.$refs;
  },
  created(){
   this.getCustomerList()
  },
  data(){
    return {
      showForm: false,
      customersList: []
    }
  },
  methods: {
    showCreateCustomerForm(){
      this.showForm = !this.showForm
    },
    getCustomerList(){
     this.$store.dispatch("getCustomers")
    },
      deleteCustomer(id, index) {
        console.log(id)
     this.$store.commit("deleting/delete/activateDeletingMessage", "")
     this.$store.dispatch("deleting/delete/deleteCustomer", {ID: id });
     this.$store.commit('subtractCustomersFromState', index)
   },
   customerCreatedMethod(value) {
     this.customersList = [value, ...this.customersList];
     this.showForm = !this.showForm
    // this.$store.commit("setCustomers", this.customers)
   }
  },
  computed: {

    ...mapGetters({deletedCustomer: "deleting/delete/deletingMessage"}),
    ...mapGetters([ "customers"])
  },
  watch: {
   deletedCustomer(value){
     if(value !== ""){
       console.log(value)
       alert(value)
     }
   }
 },
 middleware: "isAuth"
}
</script>

<style scoped>
.customer-list {
  border: 1px solid red;
  padding: 1rem;
  margin: 1rem 1rem;
  width: 350px;
}
.customer-list-wrapper {
  display: flex;
  flex-wrap: wrap;
  margin: 0 1rem;
}
</style>
