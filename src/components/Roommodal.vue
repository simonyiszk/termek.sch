<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template #activator="{ on }">
      <slot :on="on"></slot>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Teremfoglalás - {{roomName}}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" class="pa-0">
              <div class="separator">Esemény adatai</div>
            </v-col>
            <v-col cols="12">
              <v-text-field label="Esemény neve*" dense required></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field label="Esemény leírása*" dense required></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-datetime-picker
                label="Kezdés időpontja*"
                clearText="Mégse"
                color="simonyi"
                dateFormat="yyyy.MM.dd."
                :datePickerProps="{'color': 'simonyi', 'no-title': true, 'first-day-of-week': '1', 'locale': 'hu-HU', 'scrollable': true}"
                :timePickerProps="{'color': 'simonyi', 'no-title': true, 'format': '24hr', 'allowed-minutes': allowedStep}"
                required
              ></v-datetime-picker>
            </v-col>
            <v-col cols="12" sm="6">
              <v-datetime-picker
                label="Befejezés időpontja*"
                clearText="Mégse"
                color="simonyi"
                dateFormat="yyyy.MM.dd."
                :datePickerProps="{'color': 'simonyi', 'no-title': true, 'first-day-of-week': '1', 'locale': 'hu-HU', 'scrollable': true}"
                :timePickerProps="{'color': 'simonyi', 'no-title': true, 'format': '24hr', 'allowed-minutes': allowedStep}"
                required
              ></v-datetime-picker>
            </v-col>
            <v-col cols="12" class="pa-0">
              <div class="separator">Szervező adatai</div>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field label="Név*" required></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field label="Telefonszám*" required></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field label="Email*" required></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-autocomplete
                :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                label="Interests"
                multiple
              ></v-autocomplete>
            </v-col>
          </v-row>
        </v-container>
        <small>*indicates required field</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
        <v-btn color="blue darken-1" text @click="dialog = false">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import VueTypes from "vue-types";

export default {
  name: "Roommodal",
  data() {
    return {
      dialog: false,
      nowDate: new Date().toISOString().slice(0, 10)
    };
  },
  methods: {
    allowedStep: m => m % 5 === 0
  },
  props: {
    roomName: VueTypes.string.isRequired
  }
};
</script>

<style scoped>
.separator {
  font-size: 20px;
  font-weight: bold;
  border-bottom: 2px solid;
}
</style>