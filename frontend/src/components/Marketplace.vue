<template>
  <div>
    <h1>Marketplace</h1>
    <blob-list :blobs="$store.state.blobsForSale" :forSale="true" />
  </div>
</template>

<script>
import BlobList from "./BlobList.vue";

export default {
  name: "Marketplace",
  components: {
    "blob-list": BlobList,
  },
};
</script>

<style>
</style>
