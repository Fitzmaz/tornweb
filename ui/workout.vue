
<template>
  <div>
    <div v-if="isEditing">
      <div weui-form>
        <div class="weui-form__control-area">
          <div class="weui-cells__group weui-cells__group_form">
            <div class="weui-cells__title">gym simulator</div>
            <div class="weui-cells weui-cells_form">
              <div class="weui-cell weui-cell_active weui-cell_select">
                <div class="weui-cell__bd">
                  <select class="weui-select" v-model="selectedStat">
                    <option disabled value="">Please Select Stat</option>
                    <option value="strength">STR</option>
                    <option value="speed">SPD</option>
                    <option value="defense">DEF</option>
                    <option value="dexterity">DEX</option>
                  </select>
                </div>
              </div>
              <div class="weui-cell weui-cell_active weui-cell_select">
                <div class="weui-cell__bd">
                  <select class="weui-select" v-model="selectedGymNumber">
                    <option disabled value="">Please Select Gym</option>
                    <template v-for="(gymObject, gymNumber) in gymsData">
                      <option v-bind:value="gymNumber">
                        {{ gymObject.name }}
                      </option>
                    </template>
                  </select>
                </div>
              </div>
              <inputcell name="Gymfactor" v-model="gymFactor"></inputcell>
              <inputcell name="GymE" v-model="gymEnergy"></inputcell>
              <inputcell name="Happy" v-model="happy"></inputcell>
              <inputcell name="Perks" v-model="perks"></inputcell>
              <inputcell name="Energy" v-model="energy"></inputcell>
            </div>
          </div>
        </div>

        <div weui-form__opr-area>
          <button class="weui-btn weui-btn_primary" @click="save">save</button>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="workout-container" @click="isEditing = true">
        <div class="weui-flex">
          <div
            class="weui-flex__item"
            v-for="(value, name) in { stat: selectedStat, gym: gymFactor }"
          >
            <div class="workout-label">{{ `${name}: ${value}` }}</div>
          </div>
        </div>
        <div class="weui-flex">
          <div
            class="weui-flex__item"
            v-for="(value, name) in { happy, perks: Number(perks).toFixed(3), energy }"
          >
            <div class="workout-label">{{ `${name}: ${value}` }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "weui";
import weui from "../lib/weui.min.js";
const gymsData = require("../data/gyms").gyms;

export default {
  components: {
    inputcell: require("../ui/inputcell"),
  },
  props: ["workoutData"],
  data() {
    return {
      isEditing: false,
      gymsData: gymsData,
      selectedStat: (this.workoutData && this.workoutData.selectedStat) || "",
      selectedGymNumber:
        (this.workoutData && this.workoutData.selectedGymNumber) || "",
      happy: (this.workoutData && this.workoutData.happy) || "99999",
      perks: (this.workoutData && this.workoutData.perks) || "1.02",
      energy: (this.workoutData && this.workoutData.energy) || "10",
    };
  },
  computed: {
    gymFactor() {
      if (!this.selectedGymNumber || !this.selectedStat) {
        return "-";
      }
      let factor = gymsData[this.selectedGymNumber][this.selectedStat];
      return Math.round(factor) / 10;
    },
    gymEnergy() {
      if (!this.selectedGymNumber) {
        return "-";
      }
      return gymsData[this.selectedGymNumber].energy;
    },
  },
  methods: {
    save() {
      if (!this.selectedGymNumber || !this.selectedStat) {
        return;
      }
      let workoutData = {
        selectedStat: this.selectedStat,
        selectedGymNumber: this.selectedGymNumber,
        happy: this.happy,
        perks: this.perks,
        energy: this.energy,
        gymFactor: this.gymFactor,
        gymEnergy: this.gymEnergy,
      };
      this.$emit("save", workoutData);
      this.isEditing = false;
    },
  },
};
</script>

<style lang="less">
.workout-container {
  // background-color: #ededed;
  padding: 2px;
  background-color: #333;
}
.workout-label {
  // margin: 5px;
  margin: 2px;
  // padding: 0 10px;
  padding: 0 4px;
  // background-color: var(--weui-BG-1);
  // background-color: #f7f7f7;
  background-color: #555;
  height: 2.3em;
  line-height: 2.3em;
  text-align: center;
  // color: var(--weui-FG-1);
  // color: rgba(0, 0, 0, 0.5);
  color: rgba(255, 255, 255, 0.5);

  font-size: 13px;
}
</style>
