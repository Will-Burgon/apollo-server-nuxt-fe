<template>
  <v-row>
    <v-col cols="12" md="12" >
      <client-only>
      <create-individual-form :id="id" :job="job"/>
      </client-only>
      <v-card>
        <v-container v-if="individuals.length">
          <Spinner id="spinner" />
          <v-row>
            <v-col
              v-for="(individual) in individuals"
              :key="individual.details._id"
              class="d-flex"
              :cols="$vuetify.breakpoint.xsOnly ? 12 : $vuetify.breakpoint.smOnly ? 6 : 4"
            >
              <v-card flat tile class="d-flex">

                <v-img
                  :src="individual.details.images[0]"

              class="white--text align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              height="100%"
                >
                  <v-card-subtitle v-text="individual.details.uniqueID" class="white--text text-center"
                   style=" background: rgba(0,0,0,.5)"></v-card-subtitle>
                <v-card-actions>
      <v-btn
       color="success" :to="{name: 'admin-customers-id-unique',params: {id: individual.details._id, unique: individual.details.uniqueID, images: individual.details.images, auth: auth, allTheIndividuals: individuals }}"
      absolute right >Details</v-btn>

      <v-btn
       color="warning"
      absolute left
 @click="deleteIndividual(individual.details._id, individual.details.uniqueID, individual.details.images)"
      >
        Delete
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon></v-icon>
      </v-btn>
    </v-card-actions>
      </v-img>
         </v-card>
            </v-col>
          </v-row>
        </v-container>
        <!--ELSE Statement-->
             <v-container v-else-if="persons.length" >
                 <Spinner  id="spinner" :class="loading ? 'visible': ''"/>
          <v-row>
            <v-col
              v-for="(person) in persons"
              :key="person._id"
              class="d-flex child-flex"
                :cols="$vuetify.breakpoint.xsOnly ? 12 : $vuetify.breakpoint.smOnly ? 6 : 4"
            >
              <v-card flat tile class="d-flex">

                <v-img
                  :src="person.images[0]"

              class="white--text align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              height="100%"
                >
                  <v-card-subtitle v-text="person.uniqueID" class="white--text text-center"
                   style=" background: rgba(0,0,0,.5)"></v-card-subtitle>
                <v-card-actions>
      <v-btn color="success" :to="{name: 'admin-customers-id-unique',params: {id: person._id, unique: person.uniqueID, images: person.images, auth: auth, allTheIndividuals: persons }}"
      absolute right>Details</v-btn>

      <v-btn
       color="warning"
      absolute left
      @click="deleteIndividual(person._id, person.uniqueID, person.images)"
      >
        Delete
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon></v-icon>
      </v-btn>
    </v-card-actions>
      </v-img>
         </v-card>
            </v-col>
          </v-row>
        </v-container>
        <v-container v-else>
          <h1 >Nothing to see here foo</h1>
        </v-container>

      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import {mapGetters} from 'vuex';
import { GET_INDIVIDUALS, CUSTOMER_QUERY } from "~/lib/queries/queries.js"
import CreateIndividualForm from '@/components/Customers/CreateIndividualForm';
import Spinner from '@/components/UI/Spinner'
export default {
components: {
  CreateIndividualForm,
  Spinner
},
//Takes care of page refresh
 async asyncData({ params, store, app }) {

   let client = app.apolloProvider.defaultClient;
  const persons = await client.query({
     query: GET_INDIVIDUALS,
     variables: {customer: params.id}
   }).then(({data}) => {
     return {
       individuals: data.getIndividuals
     }
   })
   console.log("From AsyncData in id-customers", persons.individuals.length)
  return {
    id: params.id,
    auth: store.getters["token"],
   persons: persons.individuals
    }
 },
 data(){
   return {
      job: this.$route.params.job
   }
 },
 fetch({store, params}){
   store.dispatch("getCustomer", { id: params.id });
 },
//Gets Individuals when navigating using nuxt
 computed: {
   individuals(){
     return this.$store.getters["individuals"].filter(el => this.id === el.id)
   },
   loading(){
     return this.$store.getters["loading"]
   }
 },

 methods: {
   deleteIndividual(id, uniqueID, images) {
     this.$store.dispatch("deleteIndividual", {ID: id})
     const {bucket, s3} = this.$imageUpload()
     images.forEach(img => {
       const url = `${id}/${uniqueID}/${img}`
       const seperator = 'com/'
        var params = {
      Bucket: bucket,
      Key: url.split(seperator)[1],
      };
      console.log(params)
       s3.deleteObject(params, function(err, data){
        if(err) console.log(err, err.stack);
        else console.log("The data from AWS delete", data)
      })
     })
      if(this.individuals.length === 0) {
        this.persons = []
      }
   },
   showSpinnerMethod() {
     this.showSpinner = true
   }
 },
  beforeRouteEnter(to, from, next) {
if(from.name === "admin-customers-id-unique"){
  next(vm => {
    vm.$store.commit("fetchIndividualsFromRouter", from.params.allTheIndividuals)
  })
} else {
  next()
}

 },
 middleware: ["isAuth", 'getAllIndividuals']
}
</script>

<style lang="scss">
h1 {
  text-align: center;
  color: #607d8b;
}
#spinner {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  width: 100%;
  display: none;
  &.visible {
    display: block;
  }
}
</style>
