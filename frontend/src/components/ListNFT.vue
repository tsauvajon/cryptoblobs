<template>
  <div class="list">
    <blob
      v-for="blob in blobs"
      :key="blob.id"
      :name="blob.name"
      :dna="parseInt(blob.dna)"
    />
    <div v-if="blobs !== null && blobs.length === 0">No blobs yet!</div>
  </div>
</template>

<script>
import Blob from "./Blob.vue";
export default {
  name: "ListNFT",
  components: {
    blob: Blob,
  },
  computed: {
    blobs() {
      return this.$store.state.blobs;
    },
  },
};
</script>

<style scoped>
.list {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: 50px 0;
}
</style>
