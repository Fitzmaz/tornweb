
<template>
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
                  <option v-bind:value="gymNumber">{{ gymObject.name }}</option>
                </template>
              </select>
            </div>
          </div>
          <inputcell name="Gymfactor" v-model="gymFactor"></inputcell>
          <inputcell name="GymE" v-model="gymEnergy"></inputcell>
          <inputcell name="Happy" v-model="happy"></inputcell>
          <inputcell name="Perks" v-model="perks"></inputcell>
          <inputcell name="From stat" v-model="stat"></inputcell>
          <inputcell name="To stat" v-model="expectedStat"></inputcell>
          <inputcell name="Gains" v-model="gain"></inputcell>
          <inputcell name="Energy" v-model="energy"></inputcell>
        </div>
      </div>
    </div>

    <div weui-form__opr-area>
      <button class="weui-btn weui-btn_primary" @click="calStat">
        calculate stat
      </button>
      <button class="weui-btn weui-btn_primary" @click="calEnergy">
        calculate energy
      </button>
    </div>
  </div>
</template>

<script>
import "weui";
import weui from "../lib/weui.min.js";
const gymsData = require("../data/gyms").gyms;
const { doTrains, doTrains2 } = require("../js/gym");
export default {
  components: {
    inputcell: require("../ui/inputcell"),
  },
  data() {
    return {
      gymsData: gymsData,
      selectedStat: "",
      selectedGymNumber: "",
      stat: 30000,
      expectedStat: null,
      happy: 5025,
      perks: 1.02,
      energy: 0,
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
    gain() {
      if (!this.stat || !this.expectedStat) {
        return "-";
      }
      return this.expectedStat - this.stat;
    },
  },
  methods: {
    calStat() {
      if (!this.selectedGymNumber || !this.selectedStat) {
        return;
      }
      let finalStat = doTrains(
        Number(this.energy),
        Number(this.gymEnergy),
        Number(this.stat),
        Number(this.happy),
        Number(this.gymFactor),
        Number(this.perks),
        this.selectedStat
      );
      this.expectedStat = finalStat;
    },
    calEnergy() {
      if (!this.selectedGymNumber || !this.selectedStat) {
        return;
      }
      let e = doTrains2(
        Number(this.expectedStat),
        Number(this.gymEnergy),
        Number(this.stat),
        Number(this.happy),
        Number(this.gymFactor),
        Number(this.perks),
        this.selectedStat
      );
      this.energy = e;
    },
  },
};
</script>

<style lang="less">
</style>
