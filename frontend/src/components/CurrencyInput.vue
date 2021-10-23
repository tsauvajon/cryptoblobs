<template>
  <input
    type="text"
    v-model="displayValue"
    :class="{ invalid: !valid }"
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
        return this.isInputActive ? this.value : "Ξ " + this.value;
      },
      set(modifiedValue) {
        // To work with v-model
        this.$emit("input", modifiedValue);
      },
    },
    valid() {
      if (isNaN(this.value)) {
        return false;
      }

      return parseFloat(this.value) > 0.0;
    },
  },
};
</script>

<style scoped>
.invalid {
  color: #ff5252;
}
</style>
