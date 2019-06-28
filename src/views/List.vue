<template>
  <div>
    <Grid
      :pageTitle="pageTitle"
      :movieList="movieList"
      :mode="this.mode"
      :morePages="this.morePages"
    />
  </div>
</template>

<script>
import axios from "axios";
import Grid from "@/components/Grid";
export default {
  name: "List",
  components: {
    Grid
  },
  props: {
    pageTitle: String, // l'intestazione da dare alla pagina
    listToGet: String, // la lista da chiedere
    mode: String // se 'api' o 'search' la lista va presa subito tramite API (e.g. popular, latest), se 'firebase' i film della lista vanno prima individuati in firebase (e.g. favorites, watchlist)
  },
  data() {
    return {
      movieList: [], // in questa array andranno i film raccolti con l'API
      page: 2, // numero di pagina della richiesta API, serve per lo scroll infinito
      endpoint: "", // url dove effettuare la chiamata API
      morePages: true // per capire quando interrompere lo scrolling infinito (e disattivare Observer.vue)
    };
  },
  created() {
    /* eslint-disable */
    if (this.mode == "api") {
      this.endpoint = `https://api.themoviedb.org/3/movie/${this.listToGet}?api_key=${this.$root.apiKey}&language=it-IT`;
      this.$root.apiRequest(this.endpoint, "results", this.movieList);
      // grazie al metodo apiRequest() definito nella root dell'istanza Vue,
      // dobbiamo solo specificare l'endpoint dell'API,
      // quale oggetto del json ci interessa
      // e in quale lista inserire i risultati
    } else if (this.mode == "firebase") {
      for (let id of this.$root[this.listToGet]) {
        axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${this.$root.apiKey}&language=it-IT`)
        .then(response => {this.movieList.push(response.data)})
        .catch(error => console.log(error))
      }
    } else if (this.mode == "search") {
      let query = this.$route.params.query
      this.endpoint = `https://api.themoviedb.org/3/search/movie?api_key=${this.$root.apiKey}&query=${query}&language=it-IT`
      this.$root.apiRequest(this.endpoint, "results", this.movieList)
    }
    /* eslint-enable */
  },
  mounted() {
    // quando l'evento removedMovie viene attivato
    this.$root.$on("removedMovie", (collection, id) => {
      // invece di riscaricare tutta la lista aggiornata da firestore
      // semplicemente eseguiamo la stessa operazione sulla lista locale
      // che avevamo scaricato al momento dell'istanziazione di Vue
      this.$root[collection] = this.$root[collection].filter(item => {
        return item != id;
      });
      // se siamo in una lista custom (riconoscibile dalla
      // modalità firebase attivata) dobbiamo anche rimuovere
      // il film dalla lista, perché non deve più apparire
      // in elenco
      if (this.mode == "firebase") {
        this.movieList = this.movieList.filter(item => {
          return item.id != id;
        });
      }
    });
    // quando l'evento pageEnd è attivo
    // si aggiungono nuovi film alla lista
    this.$on("pageEnd", function() {
      if (this.morePages) {
        this.endpoint = this.endpoint + `&page=${this.page}`;
        axios.get(this.endpoint).then(response => {
          for (let item of response.data.results) {
            this.movieList.push(item);
          }
          if (response.data.page >= response.data.total_pages) {
            this.morePages = false;
          }
        });
        this.page++;
      }
    });
  }
};
</script>
