<template>
  <v-card-actions>
    <span v-if="this.isDetailPage">
      <v-rating
        medium
        dense
        half-increments
        hover
        clearable
        :color="ratingColor()"
        background-color="grey"
        class="ml-1"
        v-model="starVote"
      ></v-rating>
    </span>
    <span v-else class="ml-1 grey--text" title="Valutazione media">
      <v-icon small>thumb_up</v-icon> {{ movie.vote_average * 10 }}%
    </span>
    <v-spacer></v-spacer>
    <div class="mr-1">
      <v-tooltip
        right
        bottom
        v-for="(collection, index) in collections"
        :key="index"
      >
        <template v-slot:activator="{ on }">
          <v-icon
            v-if="isInArray(collection.name, movie.id)"
            color="primary"
            v-on="on"
            @click="removeMovie(collection.name, movie.id)"
            class="mx-1"
          >
            {{ collection.iconRemove }}
          </v-icon>
          <v-icon
            v-else
            v-on="on"
            @click="addMovie(collection.name, movie.id)"
            class="mx-1"
          >
            {{ collection.iconAdd }}
          </v-icon>
        </template>
        <span v-if="isInArray(collection.name, movie.id)">
          {{ collection.tooltipRemove }}
        </span>
        <span v-else>
          {{ collection.tooltipAdd }}
        </span>
      </v-tooltip>
    </div>
    <v-snackbar bottom right v-model="snackbar.active">
      {{ snackbar.text }}
      <v-btn color="primary" flat @click="undo(snackbar.collection)">
        Annulla
      </v-btn>
    </v-snackbar>
  </v-card-actions>
</template>

<script>
import db from "@/firebase";
export default {
  name: "MovieCardBottom",

  props: {
    movie: Object,
    isDetailPage: Boolean
  },
  data() {
    return {
      userVote: null,
      snackbar: {
        active: false,
        text: "",
        collection: ""
      },
      collections: [
        {
          name: "watchlist",
          iconRemove: "playlist_add_check",
          iconAdd: "playlist_add",
          tooltipRemove: "Rimuovi dalla watchlist",
          tooltipAdd: "Aggiungi alla watchlist",
          snackbarAdded: "Film aggiunto alla watchlist"
        },
        {
          name: "history",
          iconRemove: "check_circle",
          iconAdd: "check_circle_outline",
          tooltipRemove: "Rimuovi dalla cronologia",
          tooltipAdd: "Aggiungi alla cronologia",
          snackbarAdded: "Film aggiunto alla cronologia"
        },
        {
          name: "favorites",
          iconRemove: "favorite",
          iconAdd: "favorite_border",
          tooltipRemove: "Rimuovi dai preferiti",
          tooltipAdd: "Aggiungi ai preferiti",
          snackbarAdded: "Film aggiunto ai preferiti"
        }
      ]
    };
  },
  created() {
    // controlliamo se l'utente ha già dato un voto a questo film
    db.collection("ratings")
      .doc(String(this.movie.id))
      .get()
      .then(doc => {
        if (doc.exists) {
          this.userVote = doc.data().rating;
        }
      });
  },
  computed: {
    starVote: {
      // se l'utente ha già dato un voto al film,
      // lo visualizzeremo
      get() {
        if (this.userVote !== null) {
          return this.userVote;
        } else {
          // ...altrimenti visualizzeremo il voto medio
          return (this.movie.vote_average * 5) / 10;
        }
      },
      // se l'utente dà una nuova valutazione,
      // aggiorniamo il dato userVote
      set(stars) {
        if (stars != 0) {
          this.userVote = stars;
        } else {
          // però se l'utente annulla il voto, va eliminato dal db
          this.userVote = null;
          db.collection("ratings")
            .doc(String(this.movie.id))
            .delete();
        }
      }
    }
  },
  watch: {
    userVote() {
      // quando il dato userVote cambia, l'aggiornamento
      // viene scritto su firebase
      if (this.userVote !== null) {
        db.collection("ratings")
          .doc(String(this.movie.id))
          .set({
            rating: this.userVote
          });
      }
    }
  },
  methods: {
    isInArray(array, id) {
      if (this.$root[array].includes(id)) {
        return true;
      } else {
        return false;
      }
    },
    addMovie(collection, id) {
      db.collection(collection).add({
        id: id
      });
      this.$root[collection].push(id);
      // attivare la snackbar e impostare il testo
      let collectionIndex = this.collections.findIndex(
        x => x.name == collection
      );
      this.snackbar.text = this.collections[collectionIndex].snackbarAdded;
      this.snackbar.active = true;
      this.snackbar.collection = collection;
    },
    removeMovie(collection, id) {
      db.collection(collection)
        .where("id", "==", id)
        .get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            doc.ref.delete();
          });
        });
      // quando un film viene rimosso da una lista
      // viene generato un evento, ricevuto dal componente List.vue
      this.$root.$emit("removedMovie", collection, id);
      // disattivare la snackbar
      this.snackbar.active = false;
    },
    undo(collection) {
      // recupero l'id dell'ultimo elemento aggiunto nell'array
      let id = this.$root[collection][this.$root[collection].length - 1];
      this.removeMovie(collection, id);
      this.snackbar.active = false;
    },
    ratingColor() {
      // se l'utente ha dato una valutazione al film, le stelle
      // saranno colorate di rosso, altrimenti verrà visualizzata
      // la valutazione media, colorata di grigio
      if (this.userVote !== null) {
        return "primary";
      } else {
        return "grey";
      }
    }
  }
};
</script>
