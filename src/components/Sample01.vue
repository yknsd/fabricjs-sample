<template>
  <v-col cols="10">
    <ValidationProvider rules="required|size:2000000|image" v-slot="{ errors }">
      <v-file-input
        show-size
        label="File input"
        accept="image/png, image/jpeg"
        :rules="rules"
        :error="0 < errors.length"
        :error-messages="errors[0]"
        @change="loadImageFunction"
        @click:clear="clear"
      ></v-file-input>
    </ValidationProvider>

    <v-row class="mt-10">
      <v-card
        v-if="imgSrc"
        class="card-class"
      >
        <v-card-title class="text-left">Image</v-card-title>
        <v-card-text class="text-left">
          <p v-if="0 < errorMessages.length" class="red--text body-2">{{ errorMessages }}</p>
          <img
            :src="imgSrc"
            alt="preview"
          />
        </v-card-text>
      </v-card>
    </v-row>
  </v-col>
</template>

<script>
import loadImage from 'blueimp-load-image';

const MAX_WIDTH = 8192;
const MAX_HEIGHT = 8192;

export default {
  data() {
    return {
      rules: [
        value => !value || value.size < 2000000 || 'Image size should be less than 2 MB!',
      ],
      imgSrc: null,
      originalBlob: null,
      errorMessages: [],
    };
  },
  computed: {
    isError() {
      return 0 < this.errorMessages;
    },
  },
  methods: {
    /**
     * Load image
     * @param file
     */
    async loadImageFunction(file) {
      if (!file) {
        return;
      }
      const options = {
        canvas: true,
        maxWidth: MAX_WIDTH,
        maxHeight: MAX_HEIGHT
      };
      console.log("loadImageFunction:", file, options);
      const result = await loadImage(file, options)
        .then(function (data) {
            return new Promise(function (resolve) {
              data.url = data.image.toDataURL(file.type);
              data.image.toBlob(function (blob) {
                data.blob = blob;
                resolve(data);
              }, file.type);
            });
        })
        .catch(function (error) {
          console.log(error);
        });

      console.log("result:", result);
      this.imgSrc = result.url;
      this.originalBlob = result.blob;
    },
    clear() {
      if (this.imgSrc) {
        URL.revokeObjectURL(this.imgSrc);
      }
      this.imgSrc = null;
      this.$set(this, "errorMessages", []);
    },
  },
  beforeDestroy() {
    this.clear();
  }
}
</script>

<style>
.card-class{
  width: 100%;
  min-height: 400px;
}
</style>