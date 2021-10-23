<template>
  <div>
    <h1>My CryptoBlobs</h1>
    <blob-list v-if="blobs" :blobIds="blobs" :owned="true" />
  </div>
</template>

<script>
import BlobList from "./BlobList.vue";

export default {
  name: "OwnedBlobs",
  components: {
    "blob-list": BlobList,
  },
  computed: {
    blobs() {
      return this.$store.state.ownedBlobsIds;
    },
  },
};
</script>

<style>
</style>
