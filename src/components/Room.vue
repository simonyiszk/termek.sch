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

      <v-tab v-for="i in tabNames" :key="i" :href="`#${i}`">{{ i }}</v-tab>

      <v-tab-item v-for="i in tabNames" :key="i" :value="`${i}`">
        <v-card flat tile>
          <v-card-text>{{ i }}</v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
    <Roommodal v-slot="{on}" :roomName="tab">
      <v-btn absolute dark fab large bottom right color="simonyi" style="bottom: 16px;" v-on="on">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </Roommodal>
  </div>
</template>

<script>
import Roommodal from "./Roommodal";

export default {
  name: "Room",
  components: { Roommodal },
  data() {
    return {
      tab: "102",
      centered: true,
      grow: true,
      tabs: {
        "102": {
          calLink:
            "simonyi.bme.hu_mg3b398rhn8p4kg4rmq9tap7bs@group.calendar.google.com",
          data: []
        },
        "103": {
          calLink:
            "simonyi.bme.hu_plp5ph2fhc3dl3ff1g7t766nnc@group.calendar.google.com",
          data: []
        },
        "1319": {
          calLink:
            "simonyi.bme.hu_0odiigi3skm33p3cgm44d36534@group.calendar.google.com",
          data: []
        },
        "1320": {
          calLink:
            "simonyi.bme.hu_us5tsrahsttruvlss4sq831hp0@group.calendar.google.com",
          data: []
        }
      },
      rootURL:
        "https://www.googleapis.com/calendar/v3/calendars/%s/events?key=%s&singleEvents=true&orderBy=starttime&maxResults=2000",
      apiKey: "X"
    };
  },
  beforeMount() {
    let links = [];
    for (let i in this.tabs) {
      links.push(this.parse(this.rootURL, this.tabs[i].calLink, this.apiKey));
    }
    Promise.all(links.map(l => fetch(l)))
      .then(r => Promise.all(r.map(v => v.json())))
      .then(e => {
        // eslint-disable-next-line no-console
        console.log(e);
        return e;
      })
      .then(e => {
        e.forEach(v => {
          const roomName = v.summary.split(" ")[1];
          this.tabs[roomName].data = v.items;
        });
      })
      .then(() => {
        // eslint-disable-next-line no-console
        console.log(this.tabs);
      });
  },
  computed: {
    tabNames() {
      return Object.keys(this.tabs);
    }
  },
  methods: {
    parse(str, ...args) {
      let i = 0;
      return str.replace(/%s/g, () => args[i++]);
    }
  }
};
</script>

<style scoped>
</style>