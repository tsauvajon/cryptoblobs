<template>
  <div class="hello">
    <h1>{{ msg }}</h1>

    <h2 class="error" v-if="error">{{ error }}</h2>

    <template v-if="web3">
      <button v-if="!account" v-on:click="connectAccount">
        Connect your account
      </button>
      <button v-else-if="contract" v-on:click="createCryptoZombie('thomas')">
        Mint your NFT
      </button>
    </template>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
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

    async createCryptoZombie(name) {
      const tx = await this.contract.methods.createRandomZombie(name);
      const receipt = await tx.send({ from: this.account });
      console.log(receipt);

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
