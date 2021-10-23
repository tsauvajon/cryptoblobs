<template>
  <div class="list">
    <blob v-for="blobId in blobIds" :key="blobId" :id="blobId" />
    <div v-if="blobIds !== null && blobIds.length === 0">No blobs yet!</div>
  </div>
</template>

<script>
import Blob from "./Blob.vue";
export default {
  name: "BlobList",
  props: {
    blobIds: Array,
  },
  components: {
    blob: Blob,
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
