<template>
<v-container text-center mt-5 pt-5>
   <v-layout row wrap>
    <v-flex xs12 sm6 offset-sm3 >
     <v-card color="white" light>
       <v-container>
         <v-form enctype="multipart/form-data" novalidate >
           <v-layout row>
             <v-flex xs12>
              <v-file-input
            type="file" multiple
            @change ="fileUpload"
            accept="image/*"
              prepend-icon="attach_file"
              label="Upload Photos"
              v-model="files"
              required
              ></v-file-input>
             </v-flex>
           </v-layout>
    <!-- <v-layout row>
             <v-flex xs12>
             <v-btn color="secondary" type="submit" @click.prevent="uploadPhoto">Submit</v-btn>

             </v-flex>
           </v-layout> -->
         </v-form>

       </v-container>
     </v-card>
    </v-flex>
    </v-layout>
</v-container>

</template>

<script>




export default {
// props: {
//   id: String,
//   title: String,
//   dateCreated: String
// },
data() {
  return {
    files: [],
    url: []
  }

},

methods: {
fileUpload(e){
console.log(this.files)
this.$emit("imagesUpload", this.files)
// if(e.length){
//     e.map(file => {
//      return this.file.push(file)
//     })
//     console.log(this.file)
//     }
  },
 uploadPhoto(){
  //  AWS.config.update({region: 'eu-west-2'});
  //    const bucket = "photography-collection-bucket-123";
  //   const s3 = new AWS.S3({
  //     accessKeyId: process.env.ACCESS_KEY_ID,
  //     secretAccessKey: process.env.SECRET_ACCESS_KEY
  //   })
  //  const attributeLength = this.file.length
  // Array.from(Array(attributeLength).keys()).forEach((el, i) => {
  //   var params = {
  //     Bucket: bucket,
  //     ContentType: this.file[i].type,
  //     Key: `${this.id}/${this.file[i].name}`,
  //     };
  //  const url = s3.getSignedUrl('putObject', params);
  //  this.url.push(`${url.split("?")[0]}`);
  //  this.$axios({
  //     method: "PUT",
  //     url,
  //     data: this.file[i],
  //     processData: false,
  //     headers: {
  //       'Content-Type': this.file[i].type
  //     }
  //   }).then(res => console.log(res)).catch(err => console.log("Error", err))
  // })
  // this.$store.dispatch("createCollection", {
  //   title: this.title,
  //   images: this.url,
  //   customerID: this.id
  // })
  }
}
}
</script>

<style>

</style>
