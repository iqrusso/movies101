<template>
  <v-app id="app">
    <Navigation />
    <v-content class="ma-4">
      <router-view :key="$route.path"></router-view>
    </v-content>
  </v-app>
</template>

<script>
import Navigation from "./components/Navigation";
export default {
  components: {
    Navigation
  }
};
</script>
