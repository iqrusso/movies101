<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 xl8>
        <!-- Sfondo -->
        <v-parallax
          :src="'https://image.tmdb.org/t/p/w1280' + movie.backdrop_path"
          height="300"
        >
        </v-parallax>
        <!-- Card principale del film -->
        <v-flex xs12 md10 offset-md1>
          <DetailMovieCard :movie="movie" />
        </v-flex>
      </v-flex>
      <!-- Film correlati -->
      <v-flex xs12 xl3 offset-xl1>
        <span class="subheading">Film simili</span>
        <v-flex xs12 v-for="(movie, index) in someSimilar" :key="index">
          <MovieCard :movie="movie" horizontal />
        </v-flex>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios";
import DetailMovieCard from "@/components/DetailMovieCard";
import MovieCard from "@/components/MovieCard";
export default {
  name: "Detail",
  components: {
    DetailMovieCard,
    MovieCard
  },
  data() {
    return {
      id: null, // l'id del film viene ottenuto dalla route
      movie: null, // questo dato sarà la destinazione della prima chiamata API
      allSimilar: [] // in questa array andranno i film simili/correlati
    };
  },
  created() {
    this.id = this.$route.params.id;
    // in questo caso la risposta che riceveremo dall'API è diversa dalle altre
    // quindi non useremo il metodo apiRequest() che avevamo definito
    /* eslint-disable */
    axios.get(`https://api.themoviedb.org/3/movie/${this.id}?api_key=${this.$root.apiKey}&language=it-IT`)
    .then(response => {this.movie = response.data})
    .catch(error => {console.log(error)});
    // raccolta dei film simili/correlati
    let endpoint = `https://api.themoviedb.org/3/movie/${this.id}/similar?api_key=${this.$root.apiKey}&language=it-IT`
    this.$root.apiRequest(endpoint, "results", this.allSimilar)
    /* eslint-enable */
  },
  computed: {
    someSimilar: function() {
      // vogliamo mostrare solo alcuni dei film simili, quindi
      // prendiamo una porzione dell'array allSimilar
      return this.allSimilar.slice(1, 8);
    }
  }
};
</script>
