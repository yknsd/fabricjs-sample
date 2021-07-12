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
        <v-card-title class="text-left">Meta data</v-card-title>
        <v-card-text class="text-left">
          <v-row v-if="iptc">
            <template v-if="iptc.hasOwnProperty('80')">
              <v-col cols="3">author</v-col>
              <v-col cols="9"> {{ iptc["80"] }}</v-col>
            </template>
            <template v-if="iptc.hasOwnProperty('110')">
              <v-col cols="3">credit</v-col>
              <v-col cols="9"> {{ iptc["110"] }}</v-col>
            </template>
          </v-row>
          <v-row v-if="exif">
            <template v-if="exif.hasOwnProperty('270')">
              <v-col cols="3">image description</v-col>
              <v-col cols="9">{{ exif["270"] }}</v-col>
            </template>
            <template v-if="exif.hasOwnProperty('305')">
              <v-col cols="3">software</v-col>
              <v-col cols="9">{{ exif["305"] }}</v-col>
            </template>
            <template v-if="exif.hasOwnProperty('306')">
              <v-col cols="3">datetime</v-col>
              <v-col cols="9">{{ exif["306"] }}</v-col>
            </template>
          </v-row>
        </v-card-text>
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
      iptc: null
    };
  },
  methods: {
    async loadImageFunction(file) {
      const meta = loadImage.parseMetaData(
        file,
        {maxMetaDataSize: 262144}
      ).then(function (data) {
        return {
          iptc: data.iptc ? data.iptc : null,
          exif: data.exif ? data.exif : null
        };
      });
      this.$set(this, "exif",(await meta).exif);
      this.$set(this, "iptc", (await meta).iptc);
    }
  }
}
</script>
