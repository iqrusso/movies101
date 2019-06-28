<template>
  <v-card-title>
    <div class="text-truncate">
      <span class="caption">
        {{ this.movieReleaseYear }}
      </span>
      <span v-if="movie.runtime" :class="switchClass('caption', 'body-1')">
        <!-- poiché la durata del film è compresa solo in alcune
        chiamate API, la sua presenza viene controllata con un v-if -->
        | {{ this.movieRuntime }}
      </span>
      <router-link :to="'/movie/' + movie.id">
        <h2
          :class="switchClass('title', 'display-1')"
          class="pt-1 pb-2 black--text"
          :title="movie.title"
        >
          {{ movie.title }}
        </h2>
      </router-link>
      <span
        :class="switchClass('body-1', 'subheading')"
        :title="this.movieGenres"
      >
        {{ this.movieGenres }}
      </span>
    </div>
  </v-card-title>
</template>

<script>
export default {
  name: "MovieCardTop",
  props: {
    movie: Object,
    isDetailPage: Boolean
  },
  computed: {
    movieReleaseYear: function() {
      return this.movie.release_date.substring(0, 4);
    },
    movieRuntime: function() {
      let minutes = this.movie.runtime;
      return Math.floor(minutes / 60) + "h " + (minutes % 60) + "min";
    },
    movieGenres: function() {
      return this.filterGenres();
    }
  },
  methods: {
    filterGenres() {
      // i generi del film vengono restituiti in due modi diversi
      // in base al tipo di chiamata API, quindi questa funzione
      // controlla prima il modo in cui li ha ricevuti e dopo
      // li elabora nella maniera appropriata
      if (this.movie.genre_ids) {
        // se nel json ci sono solo gli id, dovremo consultare
        // la lista di generi presenti in main.js per tradurli
        let list = [];
        for (let id of this.movie.genre_ids) {
          for (let map of this.$root.genresMap) {
            if (id == map.id) {
              list.push(map.name);
              if (this.movie.genre_ids[this.movie.genre_ids.length - 1] == id) {
                return list.join(", ");
              }
            }
          }
        }
      } else if (this.movie.genres) {
        // se nel json ci sono anche i nomi del genere
        // per esteso, basta unirli in una stringa
        // separati da una virgola
        let list = [];
        for (let item of this.movie.genres) {
          list.push(item.name);
        }
        return list.join(", ");
      }
    },
    switchClass(first, second) {
      // questo metodo assegna una classe CSS diversa
      // se la proprietà isDetailPage è 'true'
      if (this.isDetailPage) {
        return second;
      } else {
        return first;
      }
    }
  }
};
</script>

<style>
a {
  text-decoration: none;
}
</style>
