<template>
<v-container text-center mt-5 pt-5>
   <v-layout row wrap>
    <v-flex xs12 sm6 offset-sm3 >
     <v-card color="white" light>
       <v-container>
         <v-form enctype="multipart/form-data" novalidate ref="form" id="form">
           <v-layout row>
             <v-flex xs12>
              <v-file-input
              ref="fileInput"
            value="files"
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
data() {
  return {
    files: [],
    url: [],
  }

},

methods: {
fileUpload(e){
console.log(this.files)
this.$emit("imagesUpload", this.files)
  }
},
mounted(){
   this.files = []
}
}
</script>

<style>

</style>
