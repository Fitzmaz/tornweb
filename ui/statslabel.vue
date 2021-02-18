<template>
  <div class="stats-container">
    <div class="weui-flex">
      <div class="weui-flex__item" v-for="(value, name) in { STR, DEF }">
        <div class="stats-label">{{ `${name}: ${value}` }}</div>
      </div>
    </div>
    <div class="weui-flex">
      <div class="weui-flex__item" v-for="(value, name) in { SPD, DEX }">
        <div class="stats-label">{{ `${name}: ${value}` }}</div>
      </div>
    </div>
  </div>
</template>

<script>
const { StatName } = require("../js/gym");
function formattedText(statName, stats, beforestats) {
  let text = stats[statName];
  //TODO: text is too long
  //   if (beforestats) {
  //     let delta = Number(stats[statName]) - Number(beforestats[statName]);
  //     if (delta > 0) {
  //       text += `(+${delta.toFixed(2)})`;
  //     }
  //   }
  return text;
}
export default {
  data() {
    return {};
  },
  props: ["stats", "beforestats"],
  computed: {
    STR: function () {
      if (!this.stats) return "0";
      return formattedText(StatName.STR, this.stats, this.beforestats);
    },
    DEF: function () {
      if (!this.stats) return "0";
      return formattedText(StatName.DEF, this.stats, this.beforestats);
    },
    SPD: function () {
      if (!this.stats) return "0";
      return formattedText(StatName.SPD, this.stats, this.beforestats);
    },
    DEX: function () {
      if (!this.stats) return "0";
      return formattedText(StatName.DEX, this.stats, this.beforestats);
    },
  },
};
</script>

<style lang="less">
.stats-container {
  margin: 2px;
}

.stats-label {
//   margin: 5px;
  margin: 2px;
//   padding: 0 10px;
  padding: 0 4px;
//   background-color: var(--weui-BG-1);
//   background-color: #f7f7f7;
  background-color: #ededed;
  height: 2.3em;
  line-height: 2.3em;
  text-align: center;
//   color: var(--weui-FG-1);
  color: rgba(0, 0, 0, 0.5);

  font-size: 13px;
}
</style>
