<template>
  <v-container text-center mt-5 pt-5>
  <!--Create a Customer Form Title-->

    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3 mb-3>
        <h1>Create a Customer</h1>
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
              prepend-icon="face"
              label="Job"
              type="text"
              required
              v-model="jobName"
              ></v-text-field>
             </v-flex>
           </v-layout>

              <v-layout row>
             <v-flex xs12>
              <v-text-field
              prepend-icon="face"
              label="Contact"
              type="text"
              required
              v-model="contact"
              ></v-text-field>
             </v-flex>
           </v-layout>

           <v-layout row>
             <v-flex xs12>
              <v-text-field
              prepend-icon="contact_mail"
              label="Email"
              type="email"
              required
              v-model="email"
              ></v-text-field>
             </v-flex>
           </v-layout>

            <v-layout row>
             <v-flex xs12>
              <v-text-field
              prepend-icon="contact_phone"
              label="Phone No"
              type="text"
              required
              v-model="phoneNo"
              ></v-text-field>
             </v-flex>
           </v-layout>
           <photoUpload v-on:imagesUpload = "imageUploadMethod" />
    <v-layout row>
             <v-flex xs12>
             <v-btn color="secondary" type="submit">Submit</v-btn>

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
export default {
components: {
  photoUpload
},
data(){
  return {
    url: "",
    jobName: "",
    contact: "",
    email: "",
    phoneNo: "",
    logo: null
  }
},
methods: {
  handleCreateCustomer(){

  },
  imageUploadMethod(value){
    console.log(value)
    this.logo = value[0]
  },
  createCustomerWithImages(e) {
    if(this.logo){
     const {bucket, s3} = this.$imageUpload()
    var params = {
      Bucket: bucket,
      ContentType: this.logo.type,
      Key: `${this.jobName.toLowerCase().replace(" ", "-")}/${this.logo.name}`,
      };
   const url = s3.getSignedUrl('putObject', params);
   console.log(url)
   this.url = `${url.split("?")[0]}`;
   this.$axios({
      method: "PUT",
      url,
      data: this.logo,
      processData: false,
      headers: {
        'Content-Type': this.logo.type
      }
    }).then(res => console.log(res)).catch(err => console.log("Error", err))
    }
   this.$store.dispatch('createCustomer', {
      jobName: this.jobName,
      contact: this.contact,
      email: this.email,
      phoneNo: this.phoneNo,
      logo: this.url
    })
    //this.$store.commit("addCustomersToState", {jobName: this.jobName, contact: this.contact, email: this.email, phoneNo: this.phoneNo, logo: this.url} )
    this.$emit("customerCreated",{jobName: this.jobName, contact: this.contact, email: this.email, phoneNo: this.phoneNo, logo: this.url} )

  }
}
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
