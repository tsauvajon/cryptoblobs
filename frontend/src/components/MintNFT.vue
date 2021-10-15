<template>
  <div>
    <input v-model="name" placeholder="Name your blob" />
    <button v-on:click="createCryptoBlob(name)">Mint your Blob NFT</button>
  </div>
</template>

<script>
export default {
  name: "MintNFT",
  data: () => ({
    name: "",
    txHash: null,
  }),
  methods: {
    async createCryptoBlob(name) {
      const tx = await this.contract.methods.createRandomBlob(name);

      let receipt;
      try {
        receipt = await tx.send({ from: this.account });
      } catch (e) {
        this.$toast.error(e.message);
        return;
      }

      console.log("receipt:", receipt);

      this.$toast.success("You just minted a CryptoBlob NFT!");
      await this.$store.dispatch("refreshBlobs");
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
