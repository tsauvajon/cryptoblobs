<template>
  <div>
    <h1>Marketplace</h1>
    <blob-list v-if="blobs" :blobIds="blobs" :forSale="true" />
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
      return this.$store.state.blobsForSaleIds;
    },
  },
};
</script>

<style>
</style>
