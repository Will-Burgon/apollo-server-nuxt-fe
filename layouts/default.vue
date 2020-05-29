<template>
  <v-app>
       <div id="overlay-blur"></div>
    <!-- Side Navbar -->
    <v-navigation-drawer app temporary fixed v-model="sideNav" class="hidden-sm-and-up">
      <v-toolbar color="secondary" dark >
        <!--Side Navbar App Title -->
 <v-icon @click="toggleSideNav" style="cursor:pointer;">menu</v-icon>
      <v-toolbar-title >
         <nuxt-link to="/" prefetch exact style="cursor:pointer;" >
         <h1 class="title pl-3">VuePhoto</h1>
         </nuxt-link>
      </v-toolbar-title>
       </v-toolbar>
      <!--Side Navbar App Title End-->

      <v-divider></v-divider>

      <!-- Side Navbar Links -->
      <v-list>
        <v-list-item
        v-for="item in sideNavItems"
        :key="item.title"
        :to="item.link"
       nuxt
       color="secondary"
        >
        <v-list-item-action>
           <v-icon >{{item.icon}}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
           {{item.title}}
        </v-list-item-content>

        </v-list-item>
        <v-list-item v-if="(admin ||token)" @click="handleSignOutUser">
          <v-list-item-action>
            <v-icon>
              exit_to_app
            </v-icon>
          </v-list-item-action>
            <v-list-item-content>
              Signout
            </v-list-item-content>
        </v-list-item>
      </v-list>
      <!-- Side Navbar Links End-->

    </v-navigation-drawer>
    <!-- Side Navbar End -->
    <!-- Horizonal Navbar -->
    <v-toolbar fixed color="primary" dark>
<!-- App Title -->
    <v-icon @click="toggleSideNav" style="cursor:pointer;" class="hidden-sm-and-up">menu</v-icon>
      <v-toolbar-title class="hidden-sm-and-down" >
         <nuxt-link to="/" exact style="cursor:pointer;">
          <h1 class="title pl-3">VuePhoto</h1>
         </nuxt-link>
      </v-toolbar-title>
<!-- App Title  End-->
      <v-spacer></v-spacer>
      <!-- Search Input -->
      <v-text-field flex prepend-icon="search"
      placeholder ="Search Collections/Customers"
      color="accent"
      single-line
      hide-details></v-text-field>
      <!-- Search Input End -->
         <v-spacer></v-spacer>
     <!-- Horizontal Navbar Links -->
     <v-toolbar-items class="hidden-xs-only">
       <v-btn small color="secondary" text style="margin: 0 1rem" v-for="item in horzontalBarItems"
       :key="item.title"
       :to="item.link"
       nuxt
       >
         <v-icon class="hidden-sm-only" left>{{item.icon}}</v-icon>
         {{item.title}}
       </v-btn>
       <v-btn small text color="accent" v-if="(admin || token)" @click="handleSignOutUser">
         <v-icon class="hidden-sm-only" left>exit_to_app</v-icon>
         Signout
       </v-btn>
     </v-toolbar-items>
     <!-- Horizontal Navbar Links End-->
    </v-toolbar>
    <!-- Horizonal Navbar End -->


<!-- App Content -->
      <v-container>
        <transition name="fade">
        <nuxt />
        </transition>
      </v-container>
<!-- App Content End -->
  </v-app>
</template>

<script>
import { mapGetters } from "vuex"
export default {
data(){
  return {
    sideNav: false,
    isLoggedin: false,
    accessKey: process.env.ACCESS_KEY_ID,
  }
},
computed: {
  ...mapGetters([
    "admin",
    "token",
    "adminFromToken"
  ]),
  horzontalBarItems(){
    let items = [];
    if(!this.admin || !this.token){
      items = [

      {icon: "lock", title: "Login", link: "/admin/auth/login"},
      {icon: "edit", title: "Signup", link: "/admin/auth/signup"}
    ];
    }

    if(this.admin || this.token){
      items = [
      {icon: "camera_enhance", title: "Jobs", link: "/admin/customers"},
      {icon: "scatter_plot", title: "Generate Code", link: "/photo-id"}

      ]
    }
    return items
  },
  sideNavItems(){
    let items = [];
    if(!this.admin || !this.token){
      items = [

      {icon: "lock", title: "Login", link: "/admin/auth/login"},
      {icon: "edit", title: "Signup", link: "/admin/auth/signup"}
    ];
    }

    if(this.admin || this.token){
      items = [
      {icon: "camera_enhance", title: "Jobs", link: "/admin/customers"},
       {icon: "scatter_plot", title: "Generate Code", link: "/photo-id"}


      ]
    }
    return items
  }
},
methods: {
  toggleSideNav(){
    this.sideNav = !this.sideNav
  },
  handleSignOutUser(){
    this.$store.dispatch("signOutAdmin")
  }
},
watch: {
  token(value){
    if(!value){
      this.$router.push("/");
    }
  }
}
}
</script>

<style lang="css" >
.title {
  color: #fff !important;
}
  .fade-enter-active,
  .fade-leave-active {
    transition-property: all;
    transition-duration: 0.25s;
  }
  .fade-enter-active {
    transition-delay: 0.25s
  }
  .fade-enter,
  .fade-leave-active {
    opacity: 0;
    transform: translateX(-25px)
  }
 .v-toolbar {
   flex: 0;
 }
</style>
