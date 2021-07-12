<template>
  <v-col cols="10">
    <v-row>
      <v-file-input
        show-size
        label="File input"
        accept="image/png, image/jpeg"
        :rules="rules"
        @change="loadImageFunction"
      ></v-file-input>
    </v-row>

    <v-row class="mt-10">
      <v-card v-if="exif">
        <v-card-title class="text-left">Exif Info</v-card-title>
        <v-card-text>{{ exif }}</v-card-text>
      </v-card>
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
      exif: null,
    };
  },
  methods: {
    async loadImageFunction(file) {
      const exif = loadImage.parseMetaData(
        file,
        { maxMetaDataSize: 262144 }
      ).then(function(data) {
        return data.exif;
      });
      this.exif = (await exif);
    }
  }
}
</script>
