<template>
  <div>
    <v-toolbar app color="gray" dark fixed elevation="0">
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          src="../assets/simonyi_white.svg"
          :width="calcLogo()"
          @click="toHome"
        />
      </div>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down mr-n4">
        <v-btn
          v-for="(item, index) in menu"
          :key="index"
          :to="item.link"
          color="gray"
          elevation="0"
        >
          {{
          item.title
          }}
        </v-btn>
      </v-toolbar-items>
      <div class="hidden-md-and-up">
        <v-menu>
          <template v-slot:activator="{ on }">
            <v-icon v-on="on">fas fa-ellipsis-v</v-icon>
          </template>
          <v-list>
            <v-list-item v-for="(item, index) in menu" :key="index" :to="item.link">{{ item.title }}</v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-toolbar>
  </div>
</template>

<script>
export default {
  name: "Header",
  data: () => ({
    menu: [
      { title: "Főoldal", link: "/" },
      { title: "Terembérlés", link: "/terem" },
      { title: "Eszközbérlés", link: "/eszkoz" }
    ]
  }),
  methods: {
    toHome() {
      this.$router.push("/");
    },
    calcLogo() {
      return this.$vuetify.breakpoint.smAndDown ? 150 : 250;
    }
  }
};
</script>

<style scoped>
</style>