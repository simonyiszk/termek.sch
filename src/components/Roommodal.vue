<template>
  <v-dialog v-model="dialog" max-width="600px">
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
            <v-col class="py-0" cols="12">
              <v-text-field
                v-model="model.eventName"
                :rules="rules.eventName"
                label="Esemény neve"
                required
              ></v-text-field>
            </v-col>
            <v-col class="py-0" cols="12">
              <v-text-field
                v-model="model.eventDesc"
                :rules="rules.eventDesc"
                label="Esemény leírása"
                dense
                required
              ></v-text-field>
            </v-col>
            <v-col class="py-0" cols="12" sm="6">
              <v-datetime-picker
                v-model="model.eventStart"
                :rules="rules.eventStart"
                label="Kezdés időpontja"
                clearText="Mégse"
                color="simonyi"
                dateFormat="yyyy.MM.dd."
                :datePickerProps="{'color': 'simonyi', 'no-title': true, 'first-day-of-week': '1', 'locale': 'hu-HU', 'scrollable': true}"
                :timePickerProps="{'color': 'simonyi', 'no-title': true, 'format': '24hr', 'allowed-minutes': allowedStep}"
                required
              ></v-datetime-picker>
            </v-col>
            <v-col class="py-0" cols="12" sm="6">
              <v-datetime-picker
                v-model="model.eventEnd"
                :rules="rules.eventEnd"
                label="Befejezés időpontja"
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
            <v-col class="py-0" cols="12" sm="6">
              <v-text-field v-model="model.orgName" :rules="rules.orgName" label="Név" required></v-text-field>
            </v-col>
            <v-col class="py-0" cols="12" sm="6">
              <v-text-field
                v-model="model.orgPhone"
                :rules="rules.orgPhone"
                label="Telefonszám"
                required
              ></v-text-field>
            </v-col>
            <v-col class="py-0" cols="12">
              <v-text-field v-model="model.orgEmail" :rules="rules.orgEmail" label="Email" required></v-text-field>
            </v-col>
            <v-col class="py-0" cols="12" sm="6">
              <v-autocomplete
                :items="getResorts"
                v-model="model.orgResort"
                :rules="rules.orgResort"
                @input="resortChanged"
                label="Reszort"
              ></v-autocomplete>
            </v-col>
            <v-col class="py-0" cols="12" sm="6">
              <v-autocomplete
                v-if="isMultipleGroupedResortSelected"
                :items="getGroups"
                v-model="model.orgGroup"
                :rules="rules.orgGroup"
                label="Kör"
              ></v-autocomplete>
              <v-text-field
                v-else-if="isOtherSelected"
                v-model="model.orgGroup"
                :rules="rules.orgGroup"
                label="Egyéb"
                hint="EMT, QPA, Személyes használat stb."
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="pa-0">
              <div class="separator">Kulcsátvétel</div>
            </v-col>
            <v-col class="py-0" cols="12" sm="6">
              <v-text-field
                v-model="model.keyOut"
                :rules="rules.keyOut"
                label="Átvétel ideje"
                required
              ></v-text-field>
            </v-col>
            <v-col class="py-0" cols="12" sm="6">
              <v-text-field
                v-model="model.keyRet"
                :rules="rules.keyRet"
                label="Visszaadás ideje"
                required
              ></v-text-field>
            </v-col>
            <v-col class="py-0" cols="12">
              <v-text-field v-model="model.comment" :rules="rules.comment" label="Megjegyzés" dense></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="resetHandler">Reset</v-btn>
        <v-btn color="blue darken-1" text @click="okHandler">Save</v-btn>
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
      model: {
        eventName: null,
        eventDesc: null,
        eventStart: null,
        eventEnd: null,
        orgName: null,
        orgPhone: null,
        orgEmail: null,
        orgResort: null,
        orgGroup: null,
        keyOut: null,
        keyRet: null,
        comment: null
      },
      nowDate: new Date().toISOString().slice(0, 10),
      notEmptyRule(v) {
        return !!v || "Kötelező kitölteni";
      },
      rules: {
        eventName: null,
        eventDesc: null,
        eventStart: null,
        eventEnd: null,
        orgName: null,
        orgPhone: null,
        orgEmail: null,
        orgResort: null,
        orgGroup: null,
        keyOut: null,
        keyRet: null,
        comment: null
      },
      groups: {
        Simonyi: [
          "AC",
          "BSS",
          "HA5KFU",
          "KIR-Dev",
          "LEGO",
          "MGMT",
          "schdesign",
          "SEM",
          "SPOT"
        ],
        Bulis: [
          "Dezső Buli",
          "Just Dance",
          "Lanosch",
          "LevelUp",
          "Parkett Klub",
          "Schörpong",
          "Szakest"
        ],
        KOFER: ["KFB", "SziTa", "Sternenschau"],
        KSZK: ["DevTeam", "HAT", "NETeam", "SecurITeam", "Sysadmin"],
        Kultúr: [
          "BBK",
          "Bűvészkör",
          "Impulzus",
          "Játszóház",
          "La'Place Café",
          "Local Heroes",
          "MMMK"
        ],
        Sport: ["Szertár", "DSK"],
        SSSL: [],
        SZOR: [
          "Americano",
          "Dzsájrosz",
          "Edénykölcsönző",
          "FoodEx",
          "Lángosch",
          "Palacsintázó",
          "Pizzásch",
          "Pulcsi és Foltmékör",
          "Szauna kör",
          "Vödör",
          "Vörös Kakas Fogadó",
          "WTF"
        ],
        Egyéb: null
      }
    };
  },
  computed: {
    getResorts() {
      return Object.keys(this.groups);
    },
    isResortSelected() {
      return this.resort != null;
    },
    isOtherSelected() {
      return this.isResortSelected && this.groups[this.resort] == null;
    },
    getGroups() {
      return this.isResortSelected ? this.groups[this.resort] : null;
    },
    isMultipleGroupedResortSelected() {
      return this.getGroups && this.getGroups.length > 0;
    }
  },
  methods: {
    allowedStep: m => m % 5 === 0,
    resortChanged() {
      this.model.orgGroup = null;
    },
    resetModel() {
      Object.keys(this.model).forEach(k => (this.model[k] = null));
    },
    resetHandler() {
      this.resetModel();
    },
    okHandler() {
      // eslint-disable-next-line no-console
      console.log(this.model);
      this.dialog = false;
    }
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