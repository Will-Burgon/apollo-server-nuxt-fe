<template>
<div>
<div v-if="individual">
 <div  v-for="img in individual" :key="img.id">
    <img :src="img">
 </div>
 </div>
 <div else v-for="img in images" :key="img.id" >
  <img :src="img">
 </div>
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
   const images = await client.query({
          query: GET_INDIVIDUAL,
          variables: {uniqueID: params.unique}
     }).then(({ data }) => {

        return {
          images: data.getIndividual.images
        }
     })
     return images
},

computed: {
      ...mapGetters(["individual"])
}
}
</script>

<style>

</style>
