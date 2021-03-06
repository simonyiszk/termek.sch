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
                color="simonyi"
                :events="getEvents"
                :event-color="getEventColor"
                :now="today"
                :type="type"
                :weekdays="[1,2,3,4,5,6,0]"
                :eventName="eventName"
                @click:event="showEvent"
                @click:more="viewWeek"
                @change="updateRange"
              ></v-calendar>
              <v-menu
                v-model="selectedOpen"
                :close-on-content-click="false"
                :activator="selectedElement"
                offset-x
              >
                <v-card color="grey lighten-4" min-width="350px" flat>
                  <v-toolbar color="simonyi" dark elevation="0">
                    <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                  </v-toolbar>
                  <v-card-text>
                    <div>
                      <strong>{{selectedEventTitle}}</strong>
                    </div>
                    <div class="mt-4" v-if="selectedEvent.description">
                      <span v-html="selectedEvent.description"></span>
                    </div>
                  </v-card-text>
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
      apiKey: "AIzaSyCXWIUkCfcgBT7WWIfJ0Fc-OugT9opo9vI",

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
          this.tabs[roomName].data = v.items.map(d => {
            return {
              name: d.summary,
              start: this.convertDatetime(d.start),
              end: this.convertDatetime(d.end, true),
              description: this.escapeHTML(d.description)
            };
          });
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
      const r = this.tabs[this.tab].data;
      // eslint-disable-next-line no-console
      console.log(r);
      return r;
    },
    title() {
      if (!this.start || !this.end) {
        return "";
      }

      const startMonth = this.monthFormatter(this.start);
      const endMonth = this.monthFormatter(this.end);
      const suffixMonth = startMonth === endMonth ? "" : endMonth;

      const startYear = this.start.year;
      const endYear = this.end.year;
      const suffixYear = startYear === endYear ? "" : endYear + ".";

      const startDay = this.start.day;
      const endDay = this.end.day;

      switch (this.type) {
        case "month":
          return `${startYear}. ${startMonth}`;
        case "week":
          return `${startYear}. ${startMonth} ${startDay}. - ${suffixYear} ${suffixMonth} ${endDay}.`;
        case "day":
          return `${startYear}. ${startMonth} ${startDay}.`;
      }
      return "";
    },
    selectedEventTitle() {
      const startDate = new Date(this.selectedEvent.start);
      const endDate = new Date(this.selectedEvent.end);

      const startYear = startDate.getFullYear();
      const endYear = endDate.getFullYear();
      const hideYear = startYear === endYear;

      const startMonth = startDate.toLocaleString("default", { month: "long" });
      const endMonth = endDate.toLocaleString("default", { month: "long" });

      const startDay = startDate.getDate();
      const endDay = endDate.getDate();
      const hideMonthDay = startDay === endDay;

      const startHour = startDate
        .getHours()
        .toString()
        .padStart(2, "0");
      const endHour = endDate
        .getHours()
        .toString()
        .padStart(2, "0");
      const startMinute = startDate
        .getMinutes()
        .toString()
        .padStart(2, "0");
      const endMinute = endDate
        .getMinutes()
        .toString()
        .padStart(2, "0");

      return `${
        hideYear ? "" : endYear + "."
      } ${startMonth} ${startDay}. ${startHour}:${startMinute} - ${
        hideYear ? "" : endYear + "."
      } ${hideMonthDay ? "" : endMonth + "."} ${
        hideMonthDay ? "" : endDay + "."
      } ${endHour}:${endMinute}`;
    },
    monthFormatter() {
      return this.$refs.calendar[0].getFormatter({
        timeZone: "UTC",
        month: "long"
      });
    },
    timeFormatter() {
      return this.$refs.calendar[0].getFormatter({
        timeZone: "UTC",
        hour: "numeric",
        minute: "numeric"
      });
    }
  },
  methods: {
    parse(str, ...args) {
      let i = 0;
      return str.replace(/%s/g, () => args[i++]);
    },
    convertDatetime(d, reduce = false) {
      if (d.dateTime) {
        const tsplit = d.dateTime.split("T");
        return tsplit[0] + " " + tsplit[1].split("+")[0];
      } else {
        if (!reduce) {
          return d.date;
        } else {
          return this.dayOffsetFix(d.date);
        }
      }
    },
    dayOffsetFix(d) {
      let actual = new Date(d);
      actual.setDate(actual.getDate() - 1);
      const r = actual.toISOString().slice(0, 10);
      return r;
    },
    viewWeek({ date }) {
      this.focus = date;
      this.type = "week";
    },
    getEventColor() {
      return "simonyi";
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
      // eslint-disable-next-line no-console
      console.log(event);
      nativeEvent.stopPropagation();
    },
    updateRange({ start, end }) {
      if (!this.start || this.start.date !== start.date) {
        this.start = start;
      }
      if (!this.end || this.end.date !== end.date) {
        this.end = end;
      }
    },
    eventName(event, timedEvent) {
      const name = this.escapeHTML(event.input["name"]);

      if (event.start.hasTime) {
        if (timedEvent) {
          const start = this.timeFormatter(event.start);
          const end = this.timeFormatter(event.end);
          return `<strong>${name}</strong><br>${start} - ${end}`;
        } else {
          const time = this.timeFormatter(event.start);
          return `<strong>${time}</strong> ${name}`;
        }
      }

      return name;
    },
    escapeHTML(str) {
      if (!str) return "";

      const tagsToReplace = {
        /*"&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",*/
        "\r": "<br>",
        "\n": "<br>",
        "\r\n": "</br>"
      };
      const keys = Object.keys(tagsToReplace)
        .reduce((acc, curr) => {
          return acc + curr + "|";
        }, "")
        .slice(0, -1);
      const regexp = new RegExp(`(${keys})`, "g");
      return str.replace(regexp, tag => tagsToReplace[tag] || tag);
    }
  },
  watch: {
    tab() {
      setTimeout(() => this.$refs.calendar[0].updateEventVisibility(), 10);
    }
  }
};
</script>

<style scoped>
</style>