<template>
  <div>
    <!--iframe
      src="https://calendar.google.com/calendar/b/2/embed?height=600&amp;wkst=2&amp;bgcolor=%2333B679&amp;ctz=Europe%2FBudapest&amp;src=c2ltb255aS5ibWUuaHVfMG9kaWlnaTNza20zM3AzY2dtNDRkMzY1MzRAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&amp;color=%23A87070&amp;hl=hu&amp;showTz=1&amp;showTabs=1&amp;showPrint=0&amp;showDate=1&amp;showNav=1&amp;showCalendars=1"
      style="border:solid 1px #777"
      width="800"
      height="600"
      frameborder="0"
      scrolling="no"
    ></iframe-->
    <v-tabs v-model="tab" :centered="centered" :grow="grow" color="simonyi">
      <v-tabs-slider></v-tabs-slider>

      <v-tab v-for="i in tabs" :key="i.name" :href="`#${i.name}`">{{ i.name }}</v-tab>

      <v-tab-item v-for="i in tabs" :key="i.name" :value="`${i.name}`">
        <v-card flat tile>
          <v-card-text>{{ i.name }}</v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
export default {
  name: "Room",
  data() {
    return {
      tab: null,
      centered: true,
      grow: true,
      tabs: [
        {
          name: "102"
        },
        {
          name: "103"
        },
        {
          name: "1319"
        },
        {
          name: "1320"
        }
      ]
    };
  }
};
</script>

<style scoped>
</style>