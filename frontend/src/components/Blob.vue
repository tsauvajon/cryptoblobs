<template>
  <div>
    Image:
    <div class="blob" ref="image" />
    <br />
    Name: {{ name }}<br />
    DNA: {{ dna }}<br />
  </div>
</template>

<script>
const BlobCharacter = require("./../blobs/generate");

export default {
  name: "Blob",
  props: {
    name: String,
    dna: Number,
  },
  mounted() {
    this.$nextTick(() => {
      console.log(this.$refs);

      const character = new BlobCharacter.BlobCharacter(
        200,
        200,
        this.$refs.image,
        this.dna
      );
      character.draw();
    });
  },
};
</script>

<style scoped>
svg {
  width: 75vmin;
  height: 75vmin;
}

.blob {
  width: 200px;
  height: 200px;
  margin: auto;
}
</style>
