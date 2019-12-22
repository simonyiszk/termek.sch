<template>
  <div id="#app">
    <v-app>
      <Header />
      <v-content>
        <router-view></router-view>
      </v-content>
      <Footer />
    </v-app>
  </div>
</template>

<script>
import Header from "./components/Header";
import Footer from "./components/Footer";

export default {
  name: "App",

  components: {
    Header,
    Footer
  },

  data: () => ({
    //
  })
};
</script>
