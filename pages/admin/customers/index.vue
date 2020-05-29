<template>
  <v-app>
  <!-- Spinner -->
     <!-- <v-layout row>
       <v-dialog persistent fullscreen v-model="setLoading">
         <v-container fill-height>
           <v-layout row justify-center align-center>
             <v-progress-circular indeterminate :size="70" :width="7" color="secondary">

             </v-progress-circular>
           </v-layout>
         </v-container>
       </v-dialog>
     </v-layout> -->
       <!-- End Spinner -->
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
          :cols="$vuetify.breakpoint.xsOnly ? 12 : $vuetify.breakpoint.smOnly ? 6 : 4">

          <v-card flat oulined tile class="d-flex flex-column ma-3 pa-2 grey darken-5" shaped width="300px">
           <v-card-subtitle class="text-wrap pa-2"> {{customer.logo}} </v-card-subtitle>
           <v-card-subtitle class="text-wrap pa-2"> {{customer.jobName}} </v-card-subtitle>
           <v-card-subtitle class="text-wrap pa-2"> {{customer.contact}} </v-card-subtitle>
           <v-card-subtitle class="text-wrap pa-2"> {{customer.email}} </v-card-subtitle>
           <v-card-subtitle class="text-wrap pa-2"> {{customer.phoneNo}} </v-card-subtitle>
           <v-card-subtitle class="text-wrap pa-2"> {{customer.dateCreated}} </v-card-subtitle>
           <v-card-subtitle class="text-wrap pa-2"> {{customer._id}} </v-card-subtitle>
               <v-card-actions>
      <v-btn color="success" :to="`/admin/customers/${customer._id}`" nuxt
      absolute right>Details</v-btn>

      <v-btn
       color="warning"
      absolute left
        @click="addModal"
      >
        Delete
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon></v-icon>
      </v-btn>
    </v-card-actions>
          </v-card>
            <v-card id="pop-up-modal" flat oulined tile v-show="showModal" height="200" >
      <v-card-text class="black--text text-uppercase">
        Are you sure you want to delete this customer?
        You will lose all your images for this job.
      </v-card-text>
        <v-btn color="success" @click="removeModal"
      absolute right bottom>Cancel</v-btn>
      <v-btn
       color="warning"
      absolute left bottom
        @click="deleteCustomer(customer._id, index)"
      >
        Delete
      </v-btn>
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
   data(){
    return {
      showForm: false,
      customersList: [],
      showModal: false,
      specificIndividuals: this.$store.getters.individuals
    }
  },
  mounted(){
    const { customerList } = this.$refs;

  },
  created(){
   this.getCustomerList();
  this.newIndividuals = JSON.parse(JSON.stringify(this.specificIndividuals))
  console.log("New Individuals", this.newIndividuals)
  },

  methods: {
    addModal(){
      document.getElementById("overlay-blur").classList.add("overlay-background")
      this.showModal = !this.showModal
    },
    removeModal(){
      document.getElementById("overlay-blur").classList.remove("overlay-background")
      this.showModal = !this.showModal
    },
    showCreateCustomerForm(){
      this.showForm = !this.showForm
    },
    getCustomerList(){
     this.$store.dispatch("getCustomers")
    },
    deleteCustomer(id, index) {
      const {bucket, s3} = this.$imageUpload();
      //1. delete individuals from state, mongo and aws
      console.log("New Individuals Delete", this.newIndividuals)
      this.newIndividuals.forEach(el => {
        console.log("El.id",el.id)
        //delete individuals from mongo and state
        if(el.id.length){
        this.$store.dispatch("deleteIndividual", {ID: el.details._id})
        //delete individuals from aws
        for(let image of el.details.images){
             const url = `${el.details.customer._id}/${el.details.uniqueID}/${image}`
             const seperator = 'com/'
             var params = {
            Bucket: bucket,
            Key: url.split(seperator)[1],
           };
            s3.deleteObject(params, function(err, data){
              if(err) console.log(err, err.stack);
              else console.log("The data from AWS delete", data)
      })
        }
}
      })

      //2. delete customers from state, mongo and aws

     let filteredArray =  this.newIndividuals.filter(individual => {
       return individual.details._id = id
     })
     if(filteredArray.length){
     filteredArray.forEach((el, i) => {
       console.log("el from filteredarray", el)
       const url = el.id;
       const params = {
        Bucket: bucket,
        Key: url
        };
        s3.deleteObject(params, function(err, data){
        if(err) console.log(err, err.stack);
        else console.log("The data from the customer AWS delete", data)
         })
     })}
     this.$store.dispatch("deleteCustomer", {ID: id});
     this.$store.commit('subtractCustomersFromState', index)
    document.getElementById("overlay-blur").classList.remove("overlay-background")
     this.showModal = !this.showModal

   },
   customerCreatedMethod(value) {
     this.customersList = [value, ...this.customersList];
     this.showForm = !this.showForm
    // this.$store.commit("setCustomers", this.customers)
   }
  },
  computed: {
    ...mapGetters([ "customers"])
  },
 middleware: "isAuth"
}
</script>

<style>
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
#pop-up-modal {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  z-index: 10;
}
#overlay-blur {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}
.overlay-background {
  background: rgba(0,0,0,0.5);
  pointer-events: all !important;
}
</style>
