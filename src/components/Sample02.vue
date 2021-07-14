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

    <v-row>
      <p v-if="0 < errorMessages.length" class="red--text body-2">{{ errorMessages }}</p>
      <v-img
        v-if="imgSrc"
        :src="imgSrc"
        max-height="700"
      />
    </v-row>
  </v-col>
</template>

<script>
import loadImage from 'blueimp-load-image';

export default {
  data() {
    return {
      rules: [
        value => !value || value.size < 2000000 || 'Image size should be less than 2 MB!',
      ],
      imgSrc: null,
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

      const rotatedUrl = await loadImage(file, options)
        .then(function (data) {
            return data.image.toDataURL(file.type);
          }
        )
        .catch(function (error) {
          console.log(error);
        });

      if (rotatedUrl) {
        this.imgSrc = rotatedUrl;
      }

    },
    clear() {
      this.imgSrc = null;
      this.$set(this, "errorMessages", []);
    }
  }
}
</script>
