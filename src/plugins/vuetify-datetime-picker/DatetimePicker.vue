<template>
  <v-dialog v-model="display" :width="dialogWidth">
    <template v-slot:activator="{ on }">
      <v-text-field
        v-bind="textFieldProps"
        :disabled="disabled"
        :loading="loading"
        :label="label"
        :value="formattedDatetime"
        v-on="on"
        readonly
      >
        <template v-slot:progress>
          <slot name="progress">
            <v-progress-linear :color="color" indeterminate absolute height="2"></v-progress-linear>
          </slot>
        </template>
      </v-text-field>
    </template>

    <v-card>
      <v-card-text class="px-0 py-0">
        <v-card dark class="datetime-title px-5 py-5 d-flex justify-space-between" tile color="simonyi">
          <div>{{formattedDate}}</div>
          <div>{{formattedTime}}</div>
        </v-card>
        <v-tabs fixed-tabs v-model="activeTab" :color="color">
          <v-tab key="calendar">
            <slot name="dateIcon">
              <v-icon>event</v-icon>
            </slot>
          </v-tab>
          <v-tab key="timer" :disabled="dateSelected">
            <slot name="timeIcon">
              <v-icon>access_time</v-icon>
            </slot>
          </v-tab>
          <v-tab-item key="calendar">
            <v-date-picker
              v-model="date"
              v-bind="datePickerProps"
              @input="showTimePicker"
              full-width
            ></v-date-picker>
          </v-tab-item>
          <v-tab-item key="timer">
            <v-time-picker
              ref="timer"
              class="v-time-picker-custom"
              v-model="time"
              v-bind="timePickerProps"
              full-width
            ></v-time-picker>
          </v-tab-item>
        </v-tabs>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <slot name="actions" :parent="this">
          <v-btn color="grey lighten-1" text @click.native="clearHandler">{{ clearText }}</v-btn>
          <v-btn color="green darken-1" text @click="okHandler">{{ okText }}</v-btn>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { format, parse } from "date-fns";

const DEFAULT_DATE = new Date().toISOString().slice(0, 10);
const DEFAULT_TIME = "00:00:00";
const DEFAULT_DATE_FORMAT = "yyyy-MM-dd";
const DEFAULT_TIME_FORMAT = "HH:mm:ss";
const DEFAULT_DIALOG_WIDTH = 340;
const DEFAULT_CLEAR_TEXT = "CLEAR";
const DEFAULT_OK_TEXT = "OK";

export default {
  name: "v-datetime-picker",
  model: {
    prop: "datetime",
    event: "input"
  },
  props: {
    color: {
      type: String,
      default: "primary"
    },
    datetime: {
      type: [Date, String],
      default: null
    },
    disabled: {
      type: Boolean
    },
    loading: {
      type: Boolean
    },
    label: {
      type: String,
      default: ""
    },
    dialogWidth: {
      type: Number,
      default: DEFAULT_DIALOG_WIDTH
    },
    dateFormat: {
      type: String,
      default: DEFAULT_DATE_FORMAT
    },
    timeFormat: {
      type: String,
      default: "HH:mm"
    },
    clearText: {
      type: String,
      default: DEFAULT_CLEAR_TEXT
    },
    okText: {
      type: String,
      default: DEFAULT_OK_TEXT
    },
    textFieldProps: {
      type: Object
    },
    datePickerProps: {
      type: Object
    },
    timePickerProps: {
      type: Object
    }
  },
  data() {
    return {
      display: false,
      activeTab: 0,
      date: DEFAULT_DATE,
      time: DEFAULT_TIME
    };
  },
  mounted() {
    this.init();
  },
  computed: {
    dateTimeFormat() {
      return this.dateFormat + " " + this.timeFormat;
    },
    defaultDateTimeFormat() {
      return DEFAULT_DATE_FORMAT + " " + DEFAULT_TIME_FORMAT;
    },
    formattedDate() {
      return this.selectedDatetime
        ? format(this.selectedDatetime, this.dateFormat)
        : "";
    },
    formattedTime() {
      return this.selectedDatetime
        ? format(this.selectedDatetime, this.timeFormat)
        : "";
    },
    formattedDatetime() {
      return this.selectedDatetime
        ? format(this.selectedDatetime, this.dateTimeFormat)
        : "";
    },
    selectedDatetime() {
      if (this.date && this.time) {
        let datetimeString = this.date + " " + this.time;
        if (this.time.length === 5) {
          datetimeString += ":00";
        }
        return parse(datetimeString, this.defaultDateTimeFormat, new Date());
      } else {
        return null;
      }
    },
    dateSelected() {
      return !this.date;
    }
  },
  methods: {
    init() {
      if (!this.datetime) {
        return;
      }
      let initDateTime;
      if (this.datetime instanceof Date) {
        initDateTime = this.datetime;
      } else if (
        typeof this.datetime === "string" ||
        this.datetime instanceof String
      ) {
        // see https://stackoverflow.com/a/9436948
        initDateTime = parse(this.datetime, this.dateTimeFormat, new Date());
      }

      this.date = format(initDateTime, DEFAULT_DATE_FORMAT);
      this.time = format(initDateTime, DEFAULT_TIME_FORMAT);
    },
    okHandler() {
      if (this.dateSelected) {
        return;
      }
      if (this.activeTab == 0) {
        this.activeTab = 1;
      } else {
        this.resetPicker();
        this.$emit("input", this.selectedDatetime);
      }
    },
    clearHandler() {
      this.resetPicker();
      this.date = DEFAULT_DATE;
      this.time = DEFAULT_TIME;
      this.$emit("input", null);
    },
    resetPicker() {
      this.display = false;
      this.activeTab = 0;
      if (this.$refs.timer) {
        this.$refs.timer.selectingHour = true;
      }
    },
    showTimePicker() {
      //this.activeTab = 1
    }
  },
  watch: {
    datetime: function() {
      this.init();
    }
  }
};
</script>
<style scoped>
.datetime-title {
  font-size: 2rem;
  font-weight: bold;
}
</style>