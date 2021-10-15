<template>
  <div>
    <input v-model="name" placeholder="Name your blob" />
    <button v-on:click="createCryptoZombie('thomas')">Mint your NFT</button>
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
    async createCryptoZombie(name) {
      const tx = await this.contract.methods.createRandomZombie(name);

      let receipt;
      try {
        receipt = await tx.send({ from: this.account });
      } catch (e) {
        this.$toast.error(e.message);
        return;
      }

      console.log("receipt:", receipt);

      this.$toast.success("You just minted a Crypto Zombie NFT!");
      this.txHash = receipt.transactionHash;
    },
  },
  computed: {
    web3() {
      return this.$store.state.web3;
    },
    account() {
      return this.$store.state.account;
    },
    contract() {
      return this.$store.state.contractInstance;
    },
    error() {
      return this.$store.state.error;
    },
  },
};
</script>
