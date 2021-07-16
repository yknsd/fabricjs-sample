<template>
  <v-col cols="10">
    <v-row>
      <v-file-input
        show-size
        label="File input"
        accept="image/png, image/jpeg"
        :rules="rules"
        :error="error"
        :error-messages="errorMessages"
        @change="rotateImage"
        @click:clear="clear"
      ></v-file-input>
    </v-row>

    <v-row class="mt-5">
      <v-card
        v-if="imgSrc"
        class="card-class"
      >
        <v-card-title class="text-left">Image</v-card-title>
        <v-card-text class="text-left">

          <p v-if="0 < errorMessages.length" class="red--text body-2">{{ errorMessages }}</p>
          <v-img
            :src="imgSrc"
            :max-height="maxHeight"
            :max-width="maxWidth"
            contain
          />
        </v-card-text>
      </v-card>
    </v-row>
  </v-col>
</template>

<script>
import loadImage from 'blueimp-load-image';

const MAX_WIDTH = 500;
const MAX_HEIGHT=500;

export default {
  data() {
    return {
      rules: [
        value => !value || value.size < 2000000 || 'Image size should be less than 2 MB!',
      ],
      imgSrc: null,
      maxWidth: MAX_WIDTH,
      maxHeight: MAX_HEIGHT,
      errorMessages: [],
      error: false
    };
  },
  methods: {
    async rotateImage(file) {
      if (!file) {
        return;
      }
      console.log("rotateImage:",file);
      const options = {
        canvas: true,
        orientation: 3
      };

      const result = await loadImage(file, options).then(function (data) {
        return data;
      }).catch(function (error) {
        console.log("loading error:", error);
      });

      console.log("result:", result);
      if (this.imgSrc) {
        URL.revokeObjectURL(this.imgSrc);
      }
      this.imgSrc = result.image.toDataURL(file.type);
      this.maxWidth = result.originalWidth < MAX_WIDTH ? result.originalWidth : MAX_WIDTH;
      this.maxHeight = result.originalHeight < MAX_HEIGHT ? result.originalHeight : MAX_HEIGHT;
    },
    clear() {
      if (this.imgSrc) {
        URL.revokeObjectURL(this.imgSrc);
      }
      this.imgSrc = null;
      this.$set(this, "errorMessages", []);
    }
  },
  beforeDestroy() {
    this.clear();
  }
}
</script>
