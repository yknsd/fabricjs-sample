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

    <v-row>
      <p v-if="0 < errorMessages.length" class="red--text body-2">{{ errorMessages }}</p>
      <v-img
        v-if="imgSrc"
        :src="imgSrc"
        max-height="200"
        contain
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
    };
  },
  computed: {
    isError() {
      return 0 < this.errorMessages;
    }
  },
  methods: {
    async loadImageFunction(file) {
      console.log(file);
      const options = {
        canvas: true,
        maxWidth: 100,
        maxHeight: 100,
        crop: true
      };
      const resizedUrl = await loadImage(file, options)
        .then(function (data) {
            console.log("canvasタグ:", data.image);
            console.log("canvasをURLに変換する");
            return data.image.toDataURL(file.type);
          }
        )
        .catch(function (error) {
          console.log(error);
        });

      if (resizedUrl) {
        this.imgSrc = resizedUrl;
      }
    },
    clear() {
      this.$set(this, "errorMessages", []);
    }
  }
}
</script>
