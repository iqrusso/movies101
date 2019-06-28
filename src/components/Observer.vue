<template>
  <v-flex xs12 sm4 lg3 xl2 pb-3 pr-3 align-self-center class="ma-0">
    <v-progress-circular
      color="primary"
      :size="70"
      :width="7"
      :indeterminate="true"
    ></v-progress-circular>
  </v-flex>
</template>

<script>
export default {
  name: "Observer",
  data() {
    return {
      observer: null
    };
  },
  mounted() {
    this.observer = new IntersectionObserver(([entry]) => {
      if (entry && entry.isIntersecting) {
        this.$emit("intersect");
        // genero un evento quando questo componente
        // entra nella visualizzazione della schermata
      }
    });
    this.observer.observe(this.$el);
    // specifico l'elemento target da osservare
  }
};
</script>
