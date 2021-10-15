<template>
  <div class="hello">
    <h1>{{ msg }}</h1>

    <h2 class="error" v-if="error">{{ error }}</h2>

    <template v-if="eth">
      <button v-if="!account" v-on:click="connectAccount">
        Connect your account
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
  beforeCreate() {
    this.$store.dispatch("registerEthereum");
  },
  methods: {
    async connectAccount() {
      const eth = this.eth;
      console.log(eth);

      const accounts = await eth.request({ method: "eth_requestAccounts" });
      const account = accounts[0];

      this.$store.dispatch("setAccount", { account });
    },
  },
  computed: {
    eth() {
      return this.$store.state.eth;
    },
    account() {
      return this.$store.state.account;
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
