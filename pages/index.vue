
 <template>
 <v-app>
   <v-container>

   <h1 v-if="token">Welcome {{ adminName }}</h1>
   <v-layout row wrap>
     <v-flex xs12 offset-sm3 ml-3>
        <h3>What would you like to do today?</h3>
        <v-layout row wrap v-if="(admin || token)">
             <v-btn color="primary"  to="./admin/customers" class="main--btn" mt-5 nuxt>
             Manage Customers
             </v-btn>
        </v-layout>
        <v-layout v-else>
           <v-btn color="primary"  to="./admin/auth/login" class="main--btn" mt-5 nuxt>
            Login
             </v-btn>
        </v-layout>
     </v-flex>


   </v-layout>


     <v-container  grid-list-md text-xs-center  >
         <v-layout  >
<v-flex v-if="(admin || token)" style="width: 1000px;" class="d-flex" flex-wrap  center>
       <v-card raised shaped max-width="250" color="secondary" class="ml-5 mt-5"  v-for="customer in customers" :key="customer._id">
         <v-img :src="customer.logo" height= "200px" width="100%"  class="white--text align-end" v-if="customer.logo.length"></v-img>
          <v-img :src="require('../assets/images/gaypride-683739_1920.jpg')"  height= "200px" width="100%"  class="white--text align-end" v-else>
          <div class="placeholder-gay">This is a Gay Placeholder</div>
          </v-img>
              <v-card-title style="background: transparent">{{ customer.job }}</v-card-title>
          <v-card-subtitle class="pb-0 white--text">{{ customer.email }}</v-card-subtitle>
          <v-card-actions>
            <v-btn :to="`/admin/customers/${customer._id}`" nuxt >
              See More
            </v-btn>
          </v-card-actions>
       </v-card>
       </v-flex>
           </v-layout>
     </v-container>
</v-container>
   </v-app>
 </template>

 <script>
 import { mapGetters } from "vuex";

 export default {
  data(){
    return {
      ListOfCustomers: []
    }
  },
  created () {
    this.getCustomerList()
  },
   computed: {
        ...mapGetters(["admin", "adminName","customers", "token", "adminFromToken"]),
   },
   methods: {
     getCustomerList(){
         this.$store.dispatch("getCustomers")
     }
   },
   middleware: "isAuth"
 }
 </script>

 <style lang="scss">
 .main--btn:last-child {
margin-left: 10px;
}
.placeholder-gay {
  text-transform: uppercase;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0,0,0,0.4);
}
 </style>


