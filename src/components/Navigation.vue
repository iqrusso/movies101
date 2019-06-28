<template>
  <div id="navigation">
    <!-- Toolbar -->
    <v-toolbar clipped-left app dark class="primary">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title class="mr-5 text-uppercase">
        <router-link :to="'/'">
          <span class="font-weight-light white--text">Movies</span>
          <span class="font-weight-black white--text">101</span>
        </router-link>
      </v-toolbar-title>
      <v-text-field
        hide-details
        solo-inverted
        flat
        prepend-inner-icon="search"
        label="Cerca"
        v-model="query"
        @keyup.enter="search()"
      ></v-text-field>
    </v-toolbar>
    <!-- Navigation drawer -->
    <v-navigation-drawer app clipped v-model="drawer">
      <v-list v-for="(item, index) in drawerItems" :key="index">
        <v-flex xs6>
          <v-subheader v-if="item.subheader">
            {{ item.subheader }}
          </v-subheader>
        </v-flex>
        <v-list-tile
          v-for="(item, index) in item.tiles"
          :key="index"
          :to="item.route"
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              {{ item.title }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  name: "Navigation",
  data() {
    return {
      drawer: true, // valore di apertura/chiusura del drawer
      query: "", // stringa di ricerca (di default è vuota)
      drawerItems: {
        // voci del menù
        firstChunk: {
          subheader: "Film",
          tiles: [
            { title: "Popolari", icon: "star", route: "/popular" },
            { title: "Più votati", icon: "thumb_up", route: "/top-rated" },
            { title: "Nuove uscite", icon: "new_releases", route: "/latest" },
            { title: "In arrivo", icon: "local_movies", route: "/upcoming" }
          ]
        },
        secondChunk: {
          subheader: "Liste",
          tiles: [
            { title: "Preferiti", icon: "favorite", route: "/favorites" },
            { title: "Cronologia", icon: "check_circle", route: "/history" },
            // eslint-disable-next-line
            { title: "Watchlist", icon: "playlist_add_check", route: "/watchlist" }
          ]
        }
      }
    };
  },
  computed: {
    encodedQuery() {
      return encodeURI(this.query.replace(/ /g, "+"));
      // nella query dobbiamo sostituire gli spazi con il segno '+'
      // e fare l'opportuna codifica
    }
  },
  methods: {
    search() {
      this.$router.push("/search/" + this.encodedQuery);
      // quando l'utente preme invio nella barra di ricerca
      // l'applicazione cambia route e inserisce come parametro
      // la query, che sarà utilizzata dal componente per
      // fare la richiesta API
    }
  }
};
</script>
