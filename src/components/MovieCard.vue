<template>
  <!-- la card può essere verticale o orizzontale, dipende
  dalla proprietà che è stata settata nel componente -->
  <div id="MovieCard">
    <v-card v-if="this.vertical" height="100%">
      <MovieCardImage :movie="movie" />
      <MovieCardTop :movie="movie" />
      <MovieCardBottom :movie="movie" />
    </v-card>
    <v-card v-if="this.horizontal" class="my-3">
      <v-layout row wrap>
        <v-flex xs2 xl3>
          <router-link :to="'/movie/' + movie.id">
            <MovieCardImage :movie="movie" />
          </router-link>
        </v-flex>
        <v-flex xs10 xl9>
          <MovieCardTop :movie="movie" />
          <MovieCardBottom :movie="movie" />
        </v-flex>
      </v-layout>
    </v-card>
  </div>
</template>

<script>
import MovieCardImage from "./MovieCardImage";
import MovieCardTop from "./MovieCardTop";
import MovieCardBottom from "./MovieCardBottom";
export default {
  name: "MovieCard",
  components: {
    MovieCardImage,
    MovieCardTop,
    MovieCardBottom
  },
  props: {
    movie: Object,
    vertical: Boolean,
    horizontal: Boolean
  }
};
</script>
