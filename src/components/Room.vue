<template>
  <div>
    <v-tabs v-model="tab" :centered="centered" :grow="grow" color="simonyi">
      <v-tabs-slider></v-tabs-slider>

      <v-tab v-for="i in tabNames" :key="i" :href="`#${i}`">{{ i }}</v-tab>

      <v-tab-item v-for="i in tabNames" :key="i" :value="`${i}`">
        <v-row class="fill-height">
          <v-col>
            <v-sheet height="64">
              <v-toolbar flat color="white">
                <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">Today</v-btn>
                <v-btn fab text small color="grey darken-2" @click="prev">
                  <v-icon small>mdi-chevron-left</v-icon>
                </v-btn>
                <v-btn fab text small color="grey darken-2" @click="next">
                  <v-icon small>mdi-chevron-right</v-icon>
                </v-btn>
                <v-toolbar-title>{{ title }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-menu bottom right>
                  <template v-slot:activator="{ on }">
                    <v-btn outlined color="grey darken-2" v-on="on">
                      <span>{{ typeToLabel[type] }}</span>
                      <v-icon right>mdi-menu-down</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item @click="type = 'day'">
                      <v-list-item-title>Day</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="type = 'week'">
                      <v-list-item-title>Week</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="type = 'month'">
                      <v-list-item-title>Month</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-toolbar>
            </v-sheet>
            <v-sheet height="600">
              <v-calendar
                ref="calendar"
                v-model="focus"
                color="primary"
                :events="getEvents"
                :event-color="getEventColor"
                :now="today"
                :type="type"
                :weekdays="[1,2,3,4,5,6,0]"
                @click:event="showEvent"
                @click:more="viewDay"
                @click:date="viewDay"
                @change="updateRange"
              ></v-calendar>
              <v-menu
                v-model="selectedOpen"
                :close-on-content-click="false"
                :activator="selectedElement"
                offset-x
              >
                <v-card color="grey lighten-4" min-width="350px" flat>
                  <v-toolbar :color="selectedEvent.color" dark>
                    <v-btn icon>
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon>
                      <v-icon>mdi-heart</v-icon>
                    </v-btn>
                    <v-btn icon>
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </v-toolbar>
                  <v-card-text>
                    <span v-html="selectedEvent.details"></span>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn text color="secondary" @click="selectedOpen = false">Cancel</v-btn>
                  </v-card-actions>
                </v-card>
              </v-menu>
            </v-sheet>
          </v-col>
        </v-row>
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
      apiKey: "X",

      focus: "",
      type: "month",
      today: new Date().toISOString().slice(0, 10),
      typeToLabel: {
        month: "Month",
        week: "Week",
        day: "Day"
      },
      start: null,
      end: null,
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      colors: [
        "blue",
        "indigo",
        "deep-purple",
        "cyan",
        "green",
        "orange",
        "grey darken-1"
      ]
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
      });
  },
  mounted() {
    this.$refs.calendar[0].checkChange();
  },
  computed: {
    tabNames() {
      return Object.keys(this.tabs);
    },
    getEvents() {
      return this.tabs[this.tab].data.map(e => {
        return {
          name: e.summary,
          start: this.convertDatetime(e.start),
          end: this.convertDatetime(e.end)
        };
      });
    },
    title() {
      const { start, end } = this;
      if (!start || !end) {
        return "";
      }

      const startMonth = this.monthFormatter(start);
      const endMonth = this.monthFormatter(end);
      const suffixMonth = startMonth === endMonth ? "" : endMonth;

      const startYear = start.year;
      const endYear = end.year;
      const suffixYear = startYear === endYear ? "" : endYear;

      const startDay = start.day;
      const endDay = end.day;

      switch (this.type) {
        case "month":
          return `${startMonth} ${startYear}`;
        case "week":
        case "4day":
          return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`;
        case "day":
          return `${startMonth} ${startDay} ${startYear}`;
      }
      return "";
    },
    monthFormatter() {
      return this.$refs.calendar[0].getFormatter({
        timeZone: "UTC",
        month: "long"
      });
    }
  },
  methods: {
    parse(str, ...args) {
      let i = 0;
      return str.replace(/%s/g, () => args[i++]);
    },
    convertDatetime(d) {
      if (d.dateTime) {
        const tsplit = d.dateTime.split("T");
        return tsplit[0] + " " + tsplit[1].split("+")[0];
      } else {
        return d.date;
      }
    },
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor() {
      return "blue";
    },
    setToday() {
      this.focus = this.today;
    },
    prev() {
      this.$refs.calendar[0].prev();
    },
    next() {
      this.$refs.calendar[0].next();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => (this.selectedOpen = true), 10);
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    updateRange({ start, end }) {
      this.start = start;
      this.end = end;
    }
  }
};
</script>

<style scoped>
</style>