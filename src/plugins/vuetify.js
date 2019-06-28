import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import it from "vuetify/es5/locale/it";
import colors from "vuetify/es5/util/colors";

Vue.use(Vuetify, {
  theme: {
    primary: colors.red.darken4,
    secondary: colors.grey.darken4
    // sovrascrivo i colori 'primary' e 'secondary'
    // del tema di default
  },
  iconfont: "md",
  lang: {
    locales: { it },
    current: "it"
  }
});
