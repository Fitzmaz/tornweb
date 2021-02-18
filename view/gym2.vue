
<template>
  <div>
    <template v-for="(workout, index) in workouts">
      <statslabel
        :key="workoutIdentifier(workout.data) + `label${index}`"
        :stats="preStats[index]"
      ></statslabel>
      <workout-form
        :key="workoutIdentifier(workout.data) + `form${index}`"
        :workout-data="workout.data"
        @save="onSave($event, index)"
      ></workout-form>
    </template>
  </div>
</template>

<script>
/*
selectedStat: this.workoutData.selectedStat || "",
selectedGymNumber: this.workoutData.selectedGymNumber || "",
happy: this.workoutData.happy || "5025",
perks: this.workoutData.perks || "1.02",
energy: this.workoutData.energy || "",

statName: "",
gymNumber: "",
happy: "",
perks: "",
energy: "",
*/
// function Workout(statName, gymNumber, happy, perks, energy) {
//   this.setData = function (data) {
//     this.data = data;
//     this.action = thunkWorkout(data);
//   };
//   this.setData(data);
// }

import "weui";
import weui from "../lib/weui.min.js";
const gymsData = require("../data/gyms").gyms;
const { thunkWorkout, StatName } = require("../js/gym");

function thunkAction(workout) {
  let data = workout.data;
  return thunkWorkout(
    data.selectedStat,
    Number(data.gymFactor),
    Number(data.gymEnergy),
    Number(data.happy),
    Number(data.perks),
    Number(data.energy)
  );
}

let storage = {
  get(key) {
    let value = localStorage.getItem(key);
    if (value != null) {
      return JSON.parse(value);
    }
    return null;
  },
  set(key, value) {
    return localStorage.setItem(key, JSON.stringify(value));
  },
};

const StorageKey = "workouts_data";
function saveData(object) {
  storage.set(StorageKey, object);
}
function loadData() {
  return storage.get(StorageKey);
}

export default {
  components: {
    inputcell: require("../ui/inputcell"),
    workoutForm: require("../ui/workout"),
    statslabel: require("../ui/statslabel"),
  },
  data() {
    let data = loadData();
    let workouts, preStats;
    if (data == null) {
      workouts = [{}];
      preStats = [
        {
          [StatName.STR]: "114914",
          [StatName.SPD]: "410092",
          [StatName.DEF]: "1149533",
          [StatName.DEX]: "8967",
        },
      ];
    } else {
      workouts = data;
      preStats = [
        {
          [StatName.STR]: "114914",
          [StatName.SPD]: "410092",
          [StatName.DEF]: "1149533",
          [StatName.DEX]: "8967",
        },
      ];
      workouts.forEach((workout, idx) => {
        if (!workout.ready) return;
        preStats.push(thunkAction(workout)(preStats[idx]));
        console.log(`update preStats[${idx + 1}]`);
      });
    }
    return {
      preStats,
      workouts,
    };
  },
  computed: {
    // preStats: function(){}
  },
  methods: {
    workoutIdentifier(data) {
      if (typeof data === "undefined") return "placeholder";
      return `${data.selectedStat}/${data.selectedGymNumber}/${data.happy}/${data.perks}/${data.energy}`;
    },
    calculateStats(fromIndex) {
      this.preStats.splice(fromIndex + 1);
      var that = this;
      this.workouts.forEach((workout, idx) => {
        if (idx < fromIndex) return;
        if (!workout.ready) return;
        that.preStats.push(thunkAction(workout)(that.preStats[idx]));
        console.log(`update preStats[${idx + 1}]`);
      });
    },
    onSave(data, index) {
      let workout = this.workouts[index];
      this.workouts[index].data = data;
      if (!workout.ready) {
        workout.ready = true;
        this.workouts.push({});
      }
      this.calculateStats(index);
      saveData(this.workouts);
    },
  },
  mounted() {},
};
</script>

<style lang="less">
</style>
