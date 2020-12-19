
<template>
  <div class="weui-cell weui-cell_active weui-cell_readonly">
    <div class="weui-cell__hd">
      <label class="weui-label">{{ name }}</label>
    </div>
    <div class="weui-cell__bd">
      <input
        class="weui-input"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: ["name", "value"],
};
</script>
<style lang="less">
</style>
