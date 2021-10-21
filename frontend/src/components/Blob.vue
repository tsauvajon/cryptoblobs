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
    </template>
    <button v-else-if="forSale">Buy</button>
  </div>
</template>

<script>
const BlobCharacter = require("./../blobs/generate");

export default {
  name: "Blob",
  props: {
    name: String,
    dna: Number,
    blobId: Number,
    owned: Boolean,
    forSale: Boolean,
  },
  data: () => ({
    sendTo: "",
  }),
  methods: {
    async send() {
      const { blobId, sendTo, account, contract } = this;
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
