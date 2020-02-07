<template>
  <v-row>
    <v-col cols="12" md="12" >
      <client-only>
      <create-individual-form :id="id" />
      </client-only>
      <v-card>
        <v-container fluid v-if="individuals.length">
          <v-row>
            <v-col
              v-for="(individual) in individuals"
              :key="individual.details._id"
              class="d-flex child-flex"
              cols="3"
            >
              <v-card flat tile class="d-flex">

                <v-img
                  :src="individual.details.images[0]"

              class="white--text align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              height="200px"
                >
                  <v-card-subtitle v-text="individual.details.uniqueID" class="white--text text-center"
                   style=" background: rgba(0,0,0,.5)"></v-card-subtitle>
                <v-card-actions>
      <v-btn color="success" :to="{name: 'admin-customers-id-unique',params: {id: individual.details._id, unique: individual.details.uniqueID, images: individual.details.images, auth: auth }}"
      absolute right>Details</v-btn>

      <v-btn
       color="warning"
      absolute left

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
             <v-container fluid v-else>
          <v-row>
            <v-col
              v-for="(person) in persons"
              :key="person._id"
              class="d-flex child-flex"
              cols="3"
            >
              <v-card flat tile class="d-flex">

                <v-img
                  :src="person.images[0]"

              class="white--text align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              height="200px"
                >
                  <v-card-subtitle v-text="person.uniqueID" class="white--text text-center"
                   style=" background: rgba(0,0,0,.5)"></v-card-subtitle>
                <v-card-actions>
      <v-btn color="success" :to="{name: 'admin-customers-id-unique',params: {id: person._id, unique: person.uniqueID, images: person.images, auth: auth }}"
      absolute right>Details</v-btn>

      <v-btn
       color="warning"
      absolute left

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
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import {mapGetters} from 'vuex';
import { GET_INDIVIDUALS } from "~/lib/queries/queries.js"
import CreateIndividualForm from "../../../../components/Customers/CreateIndividualForm";
export default {
components: {
  CreateIndividualForm
},

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


  return {
    id: params.id,
    auth: store.getters["token"],
   persons: persons.individuals
    }
 },
 mounted () {
   this.consoling()
 },
 computed: {
   individuals(){
     return this.$store.getters["individuals"].filter(el => this.id === el.id)
   }
 },
 methods: {
   consoling(){
     console.log(this.individuals, this.id)
   }
 },
 middleware: "isAuth"
}
</script>

<style>

</style>
