<template>
  <v-tabs grow slider-color="primary" v-model="active">
    <!-- Primo tab -->
    <v-tab>Info</v-tab>
    <v-tab-item>
      <v-card flat>
        <v-card-text>
          <p v-if="movie.overview" class="body-1">{{ movie.overview }}</p>
          <p v-else class="body-1">
            <!-- eslint-disable-next-line -->
            <em>La trama di questo film non è ancora disponibile in italiano.</em>
            <br /><br />
            {{ fallbackPlot() }}
          </p>
        </v-card-text>
        <VueperSlides autoplay speed="3000" :slide-ratio="9 / 16">
          <VueperSlide
            v-for="(path, index) in images"
            :key="index"
            :image="'https://image.tmdb.org/t/p/w1280' + path"
          ></VueperSlide>
        </VueperSlides>
      </v-card>
    </v-tab-item>
    <!-- Secondo tab -->
    <v-tab @click="loadCredits()">Cast</v-tab>
    <v-tab-item>
      <v-card flat>
        <v-list two-line>
          <v-flex xs12 v-for="(actor, index) in credits.cast" :key="index">
            <v-divider v-if="index > 0"></v-divider>
            <v-list-tile class="py-4">
              <v-list-tile-avatar size="100">
                <v-img
                  v-if="actor.profile_path"
                  :src="'https://image.tmdb.org/t/p/h632' + actor.profile_path"
                  :alt="actor.name"
                ></v-img>
                <v-img v-else src="/avatar.png" :alt="actor.name"></v-img>
              </v-list-tile-avatar>
              <v-list-tile-content class="pl-4">
                <v-list-tile-title>
                  <span class="title">{{ actor.name }}</span>
                </v-list-tile-title>
                <v-list-tile-sub-title>
                  <span class="subheading">
                    {{ actor.character }}
                  </span>
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-flex>
        </v-list>
      </v-card>
    </v-tab-item>
    <!-- Terzo tab -->
    <v-tab @click="loadVideos()">Video</v-tab>
    <v-tab-item>
      <v-card flat class="text-xs-center" v-if="videos.length > 0">
        <youtube
          v-for="video in videos"
          :video-id="video.key"
          :key="video.key"
        ></youtube>
      </v-card>
      <v-card flat v-else>
        <span class="my-5 mx-3">
          <!-- eslint-disable-next-line -->
          <em>Non abbiamo video da mostrare per questo film</em>
        </span>
      </v-card>
    </v-tab-item>
    <!-- Quarto tab -->
    <v-tab @click="loadReviews()">Recensioni</v-tab>
    <v-tab-item>
      <v-card flat>
        <v-card-text>
          <div v-for="review in reviews" :key="review.id" class="mb-3">
            <div class="body-2">
              <v-icon small>person</v-icon>{{ review.author }}:
            </div>
            <p-body-1>{{ review.content }}</p-body-1>
            <v-divider class="mt-3"></v-divider>
          </div>
        </v-card-text>
      </v-card>
    </v-tab-item>
  </v-tabs>
</template>

<script>
import axios from "axios";
import Vue from "vue";
import { VueperSlides, VueperSlide } from "vueperslides";
import "vueperslides/dist/vueperslides.css";
import VueYoutube from "vue-youtube";
Vue.use(VueYoutube);
export default {
  name: "DetailMovieCardTabs",
  props: {
    movie: Object
  },
  components: {
    VueperSlides,
    VueperSlide
  },
  data() {
    return {
      active: null,
      englishPlot: false,
      images: [],
      credits: [],
      videos: [],
      reviews: []
    };
  },
  /* eslint-disable */
  created() {
    let endpoint = `https://api.themoviedb.org/3/movie/${this.movie.id}/images?api_key=${this.$root.apiKey}`
    axios
      .get(endpoint)
      .then(response => {
      for (let item of response.data.backdrops) {
        if (item.aspect_ratio == 1.777777777777778) {
          this.images.push(item.file_path);
        }
      }})
      .catch(error => {console.log(error)})
  },
  methods: {
    fallbackPlot() {
      // se non è disponibile la trama in italiano, la prendiamo in inglese
      let endpoint = `https://api.themoviedb.org/3/movie/${this.movie.id}?api_key=${this.$root.apiKey}&language=en-EN`
      axios.get(endpoint).then(response => {this.englishPlot = response.data.overview}).catch(error => {console.log(error)})
      return this.englishPlot
    },
    loadCredits() {
      let endpoint = `https://api.themoviedb.org/3/movie/${this.movie.id}/credits?api_key=${this.$root.apiKey}&language=it-IT`
      axios.get(endpoint).then(response => {this.credits = response.data}).catch(error => {console.log(error)})
    },
    loadVideos() {
      let endpoint = `https://api.themoviedb.org/3/movie/${this.movie.id}/videos?api_key=${this.$root.apiKey}&language=it-IT`
      axios.get(endpoint).then(response  => {this.videos = response.data.results}).catch(error => console.log(error))
    },
    loadReviews() {
      let endpoint = `https://api.themoviedb.org/3/movie/${this.movie.id}/reviews?api_key=${this.$root.apiKey}&language=en-EN`
      axios.get(endpoint).then(response  => {this.reviews = response.data.results}).catch(error => console.log(error))
    }
  }
  /* eslint-enable */
};
</script>
