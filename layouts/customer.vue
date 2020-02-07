<template>
  <v-app>
     <v-navigation-drawer app temporary fixed class="hidden-sm-and-up">
      <v-toolbar color="secondary" dark >
        <!--Side Navbar App Title -->

      <v-toolbar-title >

         <h1 class="title pl-3">VuePhoto</h1>

      </v-toolbar-title>
       </v-toolbar>
      <!--Side Navbar App Title End-->

      <v-divider></v-divider>



    </v-navigation-drawer>
    <!-- Side Navbar End -->
    <!-- Horizonal Navbar -->
    <v-toolbar fixed color="primary" dark>
<!-- App Title -->
      <v-toolbar-title class="hidden-sm-and-down" >
          <h1 class="title pl-3">VuePhoto</h1>
      </v-toolbar-title>
<!-- App Title  End-->
      <v-spacer></v-spacer>
      <!-- Search Input -->
        </v-toolbar>
    <!-- Horizonal Navbar End -->
    <v-container>
        <transition name="fade">
        <nuxt />
        </transition>
      </v-container>
  </v-app>
</template>

<script>
export default {

}
</script>

<style>

</style>
