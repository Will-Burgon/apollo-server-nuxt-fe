<template>
  <v-app>
    <v-container>
    <h1>Safe, yeah</h1>
   </v-container>
 </v-app>
</template>

<script>
export default {
  middleware: "isAuth"
}
</script>
