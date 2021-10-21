<template>
  <div class="list">
    <blob
      v-for="blob in blobs"
      :key="blob.id"
      :blobId="parseInt(blob.id)"
      :name="blob.name"
      :dna="parseInt(blob.dna)"
      :owned="owned"
      :forSale="forSale"
    />
    <div v-if="blobs !== null && blobs.length === 0">No blobs yet!</div>
  </div>
</template>

<script>
import Blob from "./Blob.vue";
export default {
  name: "BlobList",
  props: {
    blobs: Array,
    owned: Boolean, // TODO: store ownership and "forSale" in store and calculate blob per blob instead
    forSale: Boolean,
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
