<template>
  <div>
    <div :class="{'button-container': $vuetify.breakpoint.smAndUp}">
      <v-container>
        <v-row :class="{'flex-column': $vuetify.breakpoint.xsOnly}">
          <v-col>
            <div>
              <v-btn elevation="0" color="simonyi" class="main-button" to="/terem">Teremfoglalás</v-btn>
            </div>
          </v-col>
          <v-col>
            <div>
              <v-btn elevation="0" color="simonyi" class="main-button" to="/eszkoz">Eszközfoglalás</v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div></div>
  </div>
</template>

<script>
export default {
  name: "Main"
};
</script>

<style scoped>
.main-button {
  height: 10rem !important;
  width: 100%;
  color: white;
  font-size: 1.5rem;
}
.button-container {
  display: flex;
  height: 50vh;
  align-items: center;
}
</style>