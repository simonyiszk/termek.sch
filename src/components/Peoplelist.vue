<template>
  <v-card dark class="peoplelist-container mx-10" color="simonyi">
    <div class="peoplelist-title">{{title}}</div>
    <div v-for="p in people" :key="p.name" class="peoplelist-box">
      <div v-if="p.name">{{p.name}}</div>
      <div v-if="p.email">{{p.email}}</div>
      <div v-if="p.phone">{{p.phone}}</div>
      <div v-if="p.room">{{p.room}}</div>
    </div>
  </v-card>
</template>
<script>
import VueTypes from "vue-types";

const Person = VueTypes.shape({
  name: VueTypes.string.isRequired,
  email: VueTypes.string,
  phone: VueTypes.string,
  room: VueTypes.string
});

export default {
  name: "Peoplelist",
  props: {
    title: VueTypes.string.isRequired,
    people: VueTypes.arrayOf(Person)
  }
};
</script>
<style scoped>
.peoplelist-container {
  padding: 1rem;
  flex-basis: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.peoplelist-title {
  font-size: 1.5rem;
}
.peoplelist-box {
  width: 100%;
}
</style>