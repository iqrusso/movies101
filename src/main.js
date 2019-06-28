import "@babel/polyfill";
import "./firebase";
import db from "@/firebase";
import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import axios from "axios";

Vue.config.productionTip = false;

new Vue({
  router,
  data() {
    return {
      apiKey: "d3fea767148bb96fd18548561d1c1f0c",
      genresMap: [],
      favorites: [],
      history: [],
      watchlist: []
    };
  },
  methods: {
    // poiché dovremo fare numerose chiamate API
    // creiamo un metodo che velocizzi quest'operazione
    apiRequest(url, object, destination) {
      axios
        .get(url)
        .then(response => {
          for (let item of response.data[object]) {
            destination.push(item);
          }
        })
        // eslint-disable-next-line
        .catch(error => console.log(error, url))
    }
  },
  created() {
    // poiché negli elenchi di film restituiti dall'API
    // i generi sono forniti solo sotto forma di ID
    // prendiamo il "dizionario" che ci servirà a
    // "tradurre" gli id nel relativo genere
    // eslint-disable-next-line
    let endpoint = `https://api.themoviedb.org/3/genre/movie/list?api_key=${this.apiKey}&language=it-IT`;
    this.apiRequest(endpoint, "genres", this.genresMap);
    // prendiamo da firestore la lista di preferiti, cronologia e watchlist
    // e ne salviamo una copia in locale
    // (d'ora in poi tutte le operazioni verranno fatte con la copia locale)
    for (let collection of ["favorites", "history", "watchlist"]) {
      db.collection(collection)
        .get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            this[collection].push(doc.data().id);
          });
        });
    }
  },
  render: h => h(App)
}).$mount("#app");
