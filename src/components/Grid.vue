<template>
  <v-container>
    <v-layout>
      <v-flex mb-5>
        <h1 class="headline">{{ pageTitle }}</h1>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex
        xs12
        sm4
        lg3
        xl2
        v-for="(movie, index) in movieList"
        :key="index"
        pb-3
        pr-3
      >
        <MovieCard :movie="movie" vertical style="height: 100%" />
      </v-flex>
      <Observer
        v-if="this.mode != 'firebase' && this.morePages"
        @intersect="pageEnd()"
      />
      <!-- lo scrolling infinito è previsto solo per le liste ottenute tramite API
      perché è possibile riceverle in pagine separate  -->
    </v-layout>
  </v-container>
</template>

<script>
import MovieCard from "./MovieCard";
import Observer from "./Observer";
export default {
  name: "Grid",
  components: {
    MovieCard,
    Observer
  },
  props: {
    pageTitle: String,
    movieList: Array,
    mode: String,
    morePages: Boolean
  },
  methods: {
    // giunti all'ultima card della griglia, viene emesso
    // un evento da comunicare al componente genitore
    // (List.vue)
    pageEnd() {
      this.$parent.$emit("pageEnd");
    }
  }
};
</script>
