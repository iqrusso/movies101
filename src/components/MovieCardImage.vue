<template>
  <router-link :to="'/movie/' + movie.id">
    <v-img
      :src="'https://image.tmdb.org/t/p/w780' + movie.poster_path"
      :aspect-ratio="2 / 3"
      :alt="movie.title"
    ></v-img>
  </router-link>
</template>

<script>
export default {
  name: "MovieCardImage",
  props: {
    movie: Object
  }
};
</script>
