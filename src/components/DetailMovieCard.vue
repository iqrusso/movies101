<template>
  <v-card class="mb-3" id="DetailedMovieCard">
    <v-layout row wrap>
      <v-flex hidden-md-and-down lg2>
        <v-img
          :src="'https://image.tmdb.org/t/p/w780' + movie.poster_path"
          :aspect-ratio="2 / 3"
        ></v-img>
      </v-flex>
      <v-flex xs12 lg10 pt-2 px-2>
        <MovieCardTop :movie="movie" isDetailPage />
        <MovieCardBottom :movie="movie" isDetailPage />
      </v-flex>
      <v-flex xs12>
        <DetailMovieCardTabs :movie="movie" />
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import MovieCardTop from "./MovieCardTop";
import MovieCardBottom from "./MovieCardBottom";
import DetailMovieCardTabs from "./DetailMovieCardTabs";
export default {
  name: "DetailMovieCard",
  components: {
    MovieCardTop,
    MovieCardBottom,
    DetailMovieCardTabs
  },
  props: {
    movie: Object
  }
};
</script>

<style scoped>
#DetailedMovieCard {
  margin-top: -40px;
}
</style>
