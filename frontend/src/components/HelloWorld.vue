<template>
  <div class="hello">
    <h1>{{ msg }}</h1>

    <h2 class="error" v-if="error">{{ error }}</h2>

    <template v-if="web3">
      <button v-if="!account" v-on:click="connectAccount">
        Connect your account
      </button>
      <template v-else-if="contract">
        <mint-nft />
        <list-nft />
      </template>
    </template>
  </div>
</template>

<script>
import ListNFT from "./ListNFT.vue";
import MintNFT from "./MintNFT.vue";

export default {
  name: "HelloWorld",
  components: {
    "mint-nft": MintNFT,
    "list-nft": ListNFT,
  },
  props: {
    msg: String,
  },
  data: () => ({
    txHash: null,
  }),
  async beforeCreate() {
    await this.$store.dispatch("registerWeb3");
    await this.$store.dispatch("registerContract");
  },
  methods: {
    async connectAccount() {
      let account;
      try {
        const accounts = await this.web3.eth.requestAccounts();
        account = accounts[0];
      } catch (e) {
        this.$toast.error(e.message);
        return;
      }

      // According to the Metamask documentation, it currently always returns 1 account.
      this.$store.dispatch("setAccount", { account });
    },

    async createCryptoBlob(name) {
      const tx = await this.contract.methods.createRandomBlob(name);
      const receipt = await tx.send({ from: this.account });
      console.log(receipt);

      this.$toast.success("You just minted a Crypto Blob NFT!");
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.error {
  color: red;
}
</style>
