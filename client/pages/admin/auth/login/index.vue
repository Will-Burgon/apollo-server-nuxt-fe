<template>
  <v-app>
    <v-container>
   <SignInForm />
    </v-container>
  </v-app>
</template>

<script>
import SignInForm from "~/components/Auth/LogInForm"
export default {
  components: {
    SignInForm
  }
}
</script>
