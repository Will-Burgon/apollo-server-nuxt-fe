<template>
   <v-container text-center mt-5 pt-5>
  <!--Create a Customer Form Title-->

    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3 mb-3>
        <h1>Create a Subject</h1>
      </v-flex>
    </v-layout>
     <!--Create a Customer Form Title End-->
    <!--Form-->
    <v-layout row wrap>
    <v-flex xs12 sm6 offset-sm3 >
     <v-card color="white" light>
       <v-container>

         <v-form @submit.prevent="createCustomerWithImages">

           <v-layout row>
             <v-flex xs12>
              <v-text-field
              prepend-icon="scatter_plot"
              label="Unique ID"
              type="text"
              required
              v-model="uniqueID"
              ></v-text-field>
             </v-flex>
           </v-layout>
            <v-layout row>
             <v-flex xs12>
              <v-text-field
              prepend-icon="scatter_plot"
              label="Price"
              type="number"
              required
              v-model="price"
              ></v-text-field>
             </v-flex>
           </v-layout>
            <v-layout row>
             <v-flex xs12>
              <v-text-field
              prepend-icon="scatter_plot"
              label="Size"
              type="text"
              required
              v-model="size"
              ></v-text-field>
             </v-flex>
           </v-layout>
            <v-layout row>
             <v-flex xs12>
              <v-text-field
              prepend-icon="scatter_plot"
              label="Job Title"
              type="text"
              disabled
              v-model="jobTitle"
              ></v-text-field>
             </v-flex>
           </v-layout>


           <photoUpload v-on:imagesUpload = "imageUploadMethod" :key="clear"/>
    <v-layout row>
             <v-flex xs12>
             <v-btn color="secondary" type="submit" >Submit</v-btn>

             </v-flex>
           </v-layout>
         </v-form>

       </v-container>
     </v-card>
    </v-flex>
    </v-layout>
    <!--Form End-->
  </v-container>
</template>

<script>
import photoUpload from "~/components/Customers/UploadPhotosForm";
import {  CUSTOMER_QUERY } from "~/lib/queries/queries.js"
// import AWS from 'aws-sdk';
// import { type } from 'os';
export default {
components: {
  photoUpload
},
props: {
  id: String,
  job: String
},
data(){
return {
  uniqueID: "",
  url: [],
  images: [],
  customer: "",
  price: 0,
  size: "",
  jobTitle: this.job,
  clear: false,
  status: 0
}
},

async created(){
   let client = this.$apolloProvider.defaultClient
    const {customer} = await client.query({
     query: CUSTOMER_QUERY,
     variables: { id: this.id}
   }).then(({data}) => {
     return {
        customer : data.getCustomer
     }
   })
   console.log(customer)
  this.jobTitle = customer.jobName
 },
methods: {
   imageUploadMethod(value){
    this.images = value;
    this.customer = this.id
    console.log(this.customer, "The path is not ''")
  },
   createCustomerWithImages(e) {
     if(this.images.length){
    const {bucket, s3} = this.$imageUpload()
    const attributeLength = this.images.length
  Array.from(Array(attributeLength).keys()).forEach((el, i) => {
    var params = {
      Bucket: bucket,
      ContentType: this.images[i].type,
      Key: `${this.id}/${this.uniqueID}/${this.images[i].name}`,
      };
   const url = s3.getSignedUrl('putObject', params);
   console.log(url)
   this.url.push(`${url.split("?")[0]}`);
   this.$axios({
      method: "PUT",
      url,
      data: this.images[i],
      processData: false,
      headers: {
        'Content-Type': this.images[i].type
      }
    }).then(res => {
      console.log("Status", res.status)
      if(res.status === 200){
        this.$store.commit("setLoading", true)
 this.$store.dispatch('createIndividual', {
      uniqueID: this.uniqueID,
      images: this.url,
      customer: this.customer ? this.customer : this.id,
      price: parseFloat(this.price),
      size: this.size,
      jobTitle: this.jobTitle
    })
    this.uniqueID = "";
    this.images = [];
    this.url = [];
    this.price = 0;
    this.size = "";
    this.clear = !this.clear;
      }
      }).catch(err => console.log("Error", err))
  })}

  }
},
middleware: ["isAuth"]
}
</script>

<style>

</style>
