<template>
  <div>
    <!-- TODO: put in an action instead -->
    <button v-on:click="getBlobs">Refresh Blobs</button>
    <br />
    <div v-for="blob in blobs" :key="blob[2]">
      <blob :name="blob[0]" :dna="parseInt(blob.dna)" />
    </div>
  </div>
</template>

<script>
import Blob from "./Blob.vue";
export default {
  name: "ListNFT",
  components: {
    blob: Blob,
  },
  data: () => ({
    blobs: null,
  }),
  methods: {
    async getBlobs() {
      const tx = await this.contract.methods.getZombiesByOwner(this.account);

      let ids;
      try {
        ids = await tx.call({ from: this.account });
      } catch (e) {
        console.error(e);
        this.$toast.error(e.message);
        return;
      }

      const blobs = await Promise.all(
        ids.map(async (id) => {
          const blob = await this.getBlob(id);
          return blob;
        })
      );

      this.blobs = blobs; // TODO: put in state instead
    },

    async getBlob(id) {
      const tx = await this.contract.methods.zombies(id);

      let blob;
      try {
        blob = await tx.call({ from: this.account });
      } catch (e) {
        console.error(e);
        this.$toast.error(e.message);
        return;
      }

      return blob;
    },
  },
  computed: {
    account() {
      return this.$store.state.account;
    },
    contract() {
      return this.$store.state.contractInstance;
    },
  },
};
</script>
