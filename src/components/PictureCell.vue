<template>
  <div class="card">
    <img v-if="imageUrl" id="card-img" class="img-fluid" :src="imageUrl" />
    <button v-else class="btn" v-on:click="$emit('pick-image', gridIndex)">
      <i class="fa fa-plus fa-3x"></i>
    </button>
  </div>
</template>

<script>
export default {
  name: "PictureCell",
  props: {
    gridIndex: Number,
    center: Object
  },
  data: function() {
    return {
      imageUrl: null
    };
  },
  watch: {
    center(newCenter) {
      if (newCenter.urlPromise) {
        newCenter.urlPromise.then(url => (this.imageUrl = url));
      }
    }
  }
};
</script>

<style scoped>
.card {
  display: flex;
  justify-content: center;
  margin: 1rem;
  padding: 1rem;
  height: 90%;
}

#card-img {
  max-width: 100%;
  max-height: 100%;
  margin: auto;
  display: block;
}
</style>
