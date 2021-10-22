<template>
  <div class="container">
    <div class="blob" ref="image" />
    <br />
    Name: {{ name }}<br />
    DNA: {{ dna }}<br />
    <template v-if="owned">
      <button v-on:click="send">Send to</button>&nbsp;<input
        placeholder="0x...."
        v-model="sendTo"
      />
      <br />
      <button v-on:click="send" v-if="forSale">Cancel sale</button>
      <button v-on:click="listForSale" v-else>List for sale</button
      >&nbsp;<currency-input v-model="price" />
    </template>
    <button v-else-if="forSale">Buy</button>
  </div>
</template>

<script>
const BlobCharacter = require("../blobs/generate");

import CurrencyInput from "./CurrencyInput.vue";

const defaultPrice = "0.0";
const ethereumAddressLength = "0x481F83DB3cD7342364bf16FB4ABBD7978d09BaCe"
  .length;

export default {
  name: "Blob",
  props: {
    name: String,
    dna: Number,
    blobId: Number,
    owned: Boolean,
    forSale: Boolean,
  },
  components: {
    "currency-input": CurrencyInput,
  },
  data: () => ({
    sendTo: "",
    price: defaultPrice,
  }),
  methods: {
    async send() {
      const { blobId, sendTo, account, contract } = this;

      if (sendTo.length !== ethereumAddressLength) {
        this.$toast.error("The 'send to' address is invalid");
        return;
      }

      if (sendTo === this.account) {
        this.$toast.error("Can't send yourself a CryptoBlob");
        return;
      }

      const tx = await contract.methods.transferFrom(account, sendTo, blobId);

      let receipt;
      try {
        receipt = await tx.send({ from: this.account });
      } catch (e) {
        console.error(e);
        this.$toast.error(e.message);
        return;
      }

      console.log("receipt:", receipt);

      this.$toast.success(
        `You just sent ${this.name} to ${sendTo.substring(0, 6)}!`
      );
      await this.$store.dispatch("refreshBlobs");
    },

    async listForSale() {
      const { blobId, price, web3, contract } = this;

      if (!parseFloat(price) > 0.0) {
        this.$toast.error("Price must be more than 0");
        return;
      }

      const tx = await contract.methods.listBlobForSale(
        blobId,
        web3.utils.toWei(price, "ether")
      );

      this.price = defaultPrice;

      let receipt;
      try {
        receipt = await tx.send({ from: this.account });
      } catch (e) {
        console.error(e);
        this.$toast.error(e.message);
        return;
      }

      console.log("receipt:", receipt);

      this.$toast.success(`You just listed ${this.name} for ${price}!`);
      await this.$store.dispatch("refreshBlobs");
    },
  },
  mounted() {
    this.$nextTick(() => {
      const character = new BlobCharacter.BlobCharacter(
        200,
        200,
        this.$refs.image,
        this.dna
      );
      character.draw();
    });
  },
  computed: {
    account() {
      return this.$store.state.account;
    },
    contract() {
      return this.$store.state.contractInstance;
    },
    web3() {
      return this.$store.state.web3;
    },
  },
};
</script>

<style scoped>
svg {
  width: 75vmin;
  height: 75vmin;
}

.container {
  margin: 0 30px;
}

.blob {
  width: 200px;
  height: 200px;
  margin: auto;
}
</style>
