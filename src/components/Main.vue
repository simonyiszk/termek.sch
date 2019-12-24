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
    <div class="d-flex justify-center">
        <Peoplelist title="Teremfelelősök" :people="teremfelelos" />
        <Peoplelist title="Elnökség" :people="elnokseg" />
    </div>
  </div>
</template>

<script>
import Peoplelist from "./Peoplelist";

export default {
  name: "Main",

  components: { Peoplelist },

  data: () => ({
    elnokseg: [
      {
        name: "Frey Balázs",
        email: "frey.balazs@simonyi.bme.hu",
        phone: "+36 70 210 0880",
        room: "SCH1313"
      },
      {
        name: "Bozsik Szabolcs",
        email: "bozsik.szabolcs@simonyi.bme.hu",
        phone: "+36 20 384 2721",
        room: "SCH1312"
      },
      {
        name: "Kiss Ádám",
        email: "kiss.adam@simonyi.bme.hu",
        phone: "+36 30 731 0629",
        room: "SCH 1306"
      },
      {
        name: "Vankó Dániel",
        email: "vanko.daniel@simonyi.bme.hu",
        phone: "+36 70 590 9950",
        room: "SCH 1316"
      }
    ],
    teremfelelos: [
      {
        name: "Bélteky Zsuzsanna",
        email: "sushi@simonyi.bme.hu",
        phone: "+36 20 331 3007",
        room: "SCH 1310"
      },
      {
        name: "Hajas Márk",
        email: "mark.hajas@gmail.com",
        phone: "+36 30 480 4616",
        room: "SCH 816"
      },
      {
        name: "Südi Beáta",
        email: "bea@simonyi.bme.hu",
        phone: "+36 30 692 0223",
        room: "SCH 1311"
      },
      {
        name: "Várszegi Júlia",
        email: "varszegi.julia@gmail.com",
        phone: "+36 30 710 7494",
        room: "SCH 1311"
      }
    ]
  })
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