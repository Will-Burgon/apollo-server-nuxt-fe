<template>
<div>
<v-container v-if="individual" class="pa-2" grid-list-md text-xs-center fluid>
  <v-layout>
  <v-flex class="d-flex flex-wrap" center >
 <v-card  v-for="img in individual" :key="img.id" raised shaped width="400"  class=" ml-5 mt-5">
    <v-img :src="img" height= "400px" width="100%" class="align-end"></v-img>
 </v-card>
 </v-flex>
  </v-layout>
</v-container>
 <v-container v-else class="pa-2" grid-list-md text-xs-center fluid>
   <v-layout style="flex-direction: column">

<v-flex v-for="img in human.images" :key="img.id" raised shaped width="400" class="d-flex flex-wrap justify-center" center ref="parentEl" >
 <v-card class=" flex-50" >
  <v-img :src="img" height= "100vh" width="100%" max-width="calc(50% - 0)" class="align-end"></v-img>
      <v-card flat oulined tile class="d-flex flex-column ma-3 pa-2 primary darken-5" shaped width="200px"
      :class="$vuetify.breakpoint.smAndDown ? 'info-card-small' : 'info-card'">
  <v-card-subtitle class="text-wrap pa-2 font-white"> Price: {{human.price}} </v-card-subtitle>
  <v-card-subtitle class="text-wrap pa-2 font-white"> Size: {{human.size}}  </v-card-subtitle>
  <v-card-subtitle class="text-wrap pa-2 font-white "> Job Title: {{human.jobTitle}} </v-card-subtitle>
  <v-card-subtitle class="text-wrap pa-2 font-white"> Date: {{new Date(parseInt(human.dateCreated)).toUTCString()}} </v-card-subtitle>
  <v-btn color="success" to="#" :style="{left: '50%', transform:'translateX(-50%)'}"
      absolute bottom center>Buy Now</v-btn>
     </v-card>
 </v-card>
 </v-flex>
   </v-layout>
 </v-container>
</div>
</template>

<script>
import { GET_INDIVIDUAL } from "~/lib/queries/queries.js"
import {mapGetters} from 'vuex';
export default {
layout({params}){
  if(params.auth){
    return "default"
  } else {
    return "customer"
  }
},
async asyncData({params, store, app}){
    let client = app.apolloProvider.defaultClient;
   const human = await client.query({
          query: GET_INDIVIDUAL,
          variables: {uniqueID: params.unique}
     }).then(({ data }) => {

        return {
          human: data.getIndividual
        }
     })
     console.log(human)
     return human
},

computed: {
      ...mapGetters(["individual"]),
},
// mounted() {
//   this.addClass();
// },
// methods: {
//   addClass(){
//     const { parentEl } = this.$refs;
//     this.images.length > 1 ? null :  parentEl.classList.add("parent-change")
//   }
// }
}
</script>

<style>
.parent-change {
  justify-content: center;
}
.flex-50 {
  flex-basis: calc(50% - 20px);
  max-width: 768px;
}
.info-card {
  position: absolute;
  height: 50%;
  top: 50%;
  left: -50%;
  transform: translate(75%, -50%);
}
.info-card-small {
  left: 50%;
  transform: translate(-50%, -20%);
  height: 30%;
}
.font-white {
  color: #fff !important;
}
</style>
