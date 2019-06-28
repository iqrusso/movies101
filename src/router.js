import Vue from "vue";
import Router from "vue-router";
import List from "./views/List";
import Detail from "./views/Detail";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      redirect: "/popular"
    },
    {
      path: "/popular", // lista di TMDb
      component: List,
      props: { pageTitle: "Film popolari", listToGet: "popular", mode: "api" }
    },
    {
      path: "/top-rated", // lista di TMDb
      component: List,
      props: {
        pageTitle: "Film più votati",
        listToGet: "top_rated",
        mode: "api"
      }
    },
    {
      path: "/latest", // lista di TMDb
      component: List,
      props: {
        pageTitle: "Film recenti",
        listToGet: "now_playing",
        mode: "api"
      }
    },
    {
      path: "/upcoming", // lista di TMDb
      component: List,
      props: { pageTitle: "Film in arrivo", listToGet: "upcoming", mode: "api" }
    },
    {
      path: "/movie/:id",
      component: Detail
    },
    {
      path: "/favorites",
      component: List,
      props: {
        pageTitle: "Film preferiti",
        listToGet: "favorites", // collection su Firebase
        mode: "firebase"
      }
    },
    {
      path: "/history",
      component: List,
      props: {
        pageTitle: "Film guardati",
        listToGet: "history", // collection su Firebase
        mode: "firebase"
      }
    },
    {
      path: "/watchlist",
      component: List,
      props: {
        pageTitle: "Film da guardare",
        listToGet: "watchlist", // collection su Firebase
        mode: "firebase"
      }
    },
    {
      path: "/search/:query",
      component: List,
      props: {
        pageTitle: "Risultati della ricerca",
        mode: "search"
      }
    }
  ]
});
