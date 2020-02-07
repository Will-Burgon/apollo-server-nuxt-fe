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


           <photoUpload v-on:imagesUpload = "imageUploadMethod" />
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
import AWS from 'aws-sdk';
import { type } from 'os';
export default {
components: {
  photoUpload
},
props: {
  id: String
},
data(){
return {
  uniqueID: "",
  url: [],
  images: [],
  customer: ""
}
},
methods: {
   imageUploadMethod(value){
    this.images = value;
    this.customer = this.id
  },
   createCustomerWithImages(e) {
  AWS.config.update({region: 'eu-west-2'});
  const keyID = process.env.ACCESS_KEY_ID;
  const secret = process.env.SECRET_ACCESS_KEY
    const bucket = "photography-collection-bucket-123";
    const s3 = new AWS.S3({
      accessKeyId: keyID,
      secretAccessKey: secret
    })
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
    }).then(res => console.log(res)).catch(err => console.log("Error", err))
  })
   this.$store.dispatch('createIndividual', {
      uniqueID: this.uniqueID,
      images: this.url,
      customer: this.customer
    })
  }
},
middleware: "isAuth"
}
</script>

<style>

</style>
