<template>
  <div class="hello">
    <h1>{{ msg }}</h1>

    <h2 class="error" v-if="error">{{ error }}</h2>

    <template v-else-if="web3 && contract">
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
  async beforeCreate() {
    await this.$store.dispatch("registerWeb3");
  },
  methods: {
    async connectAccount() {
      this.$store.dispatch("connectAccount");
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
