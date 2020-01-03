import "material-design-icons-iconfont/dist/material-design-icons.css";
import "@fortawesome/fontawesome-free/css/all.css";
import Vue from "vue";
import Vuetify from "vuetify/lib";
import DatetimePicker from './vuetify-datetime-picker/index'

import colors from "vuetify/lib/util/colors";

Vue.use(Vuetify);
Vue.use(DatetimePicker);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: colors.red.darken1, // #E53935
        secondary: colors.red.lighten4, // #FFCDD2
        accent: colors.indigo.base, // #3F51B5
        simonyi: "#63bc47",
        gray: "#3D3D3D"
      }
    }
  }
});
