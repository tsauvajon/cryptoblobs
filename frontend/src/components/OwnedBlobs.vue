<template>
  <div>
    <h1>My CryptoBlobs</h1>
    <blob-list :blobs="$store.state.ownedBlobs" :owned="true" />
  </div>
</template>

<script>
import BlobList from "./BlobList.vue";

export default {
  name: "OwnedBlobs",
  components: {
    "blob-list": BlobList,
  },
};
</script>

<style>
</style>
