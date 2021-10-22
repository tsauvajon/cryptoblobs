<template>
  <input
    type="text"
    v-model="displayValue"
    @blur="isInputActive = false"
    @focus="isInputActive = true"
  />
</template>

<script>
export default {
  name: "CurrencyInput",
  props: ["value"],
  data: () => ({
    isInputActive: false,
  }),
  computed: {
    displayValue: {
      get() {
        // Show raw value when editing, formatted value otherwise
        return this.isInputActive
          ? this.value.toString()
          : "Ξ " + this.value.toString(10);
      },
      set(modifiedValue) {
        // To work with v-model
        this.$emit("input", modifiedValue);
      },
    },
  },
};
</script>

<style>
input {
  /* border: 1px solid #888; */
  /* font-size: 1.2rem; */
  /* padding: 0.5rem; */
}
</style>
