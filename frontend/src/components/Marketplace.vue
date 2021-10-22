<template>
  <div>
    <h1>Marketplace</h1>
    <blob-list v-if="blobs" :blobs="blobs" :forSale="true" />
  </div>
</template>

<script>
import BlobList from "./BlobList.vue";

export default {
  name: "Marketplace",
  components: {
    "blob-list": BlobList,
  },
  computed: {
    blobs() {
      return this.$store.getters.blobsForSale;
    },
  },
};
</script>

<style>
</style>
