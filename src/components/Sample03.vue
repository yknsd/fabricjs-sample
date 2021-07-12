<template>
  <v-col cols="10">
    <v-row>
      <v-file-input
        show-size
        label="File input"
        accept="image/png, image/jpeg"
        :rules="rules"
        @change="loadImageFunction"
        @click:clear="clear"
      ></v-file-input>
    </v-row>

    <v-row class="mt-10">
      <v-card
        v-if="changed && hasMetaData"
        class="card-class"
      >
        <v-card-title class="text-left">Meta data</v-card-title>
        <v-card-text class="text-left">
          <v-row v-if="iptc.author">
              <v-col cols="3">author</v-col>
              <v-col cols="9"> {{ iptc.author }}</v-col>
          </v-row>
          <v-row v-if="iptc.credit">
              <v-col cols="3">credit</v-col>
              <v-col cols="9"> {{ iptc.credit }}</v-col>
          </v-row>
          <v-row v-if="exif.description">
              <v-col cols="3">image description</v-col>
              <v-col cols="9">{{ exif.description }}</v-col>
          </v-row>
          <v-row v-if="exif.software">
              <v-col cols="3">software</v-col>
              <v-col cols="9">{{ exif.software }}</v-col>
          </v-row>
          <v-row v-if="exif.datetime">
              <v-col cols="3">datetime</v-col>
              <v-col cols="9">{{ exif.datetime }}</v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-row v-else-if="changed && !hasMetaData">
        <v-col cols="12">Not Found Meta Data</v-col>
      </v-row>
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
      exif: {
        description: null,
        software: null,
        datetime: null
      },
      iptc: {
        author: null,
        credit: null
      },
      changed: false
    };
  },
  computed: {
    hasMetaData() {
      const values = Object.values(this.exif).concat(Object.values(this.iptc)).filter(value => value != null);
      return 0 < values.length;
    },
  },
  methods: {
    hasKey(obj, key) {
      console.log("obj:", obj);
      console.log("key:", key);
      return obj && Object.prototype.hasOwnProperty.call(obj, key);
    },
    async loadImageFunction(file) {
      let meta = loadImage.parseMetaData(
        file,
        {maxMetaDataSize: 262144}
      ).then(function (data) {
        return {
          iptc: data.iptc ? data.iptc : null,
          exif: data.exif ? data.exif : null
        };
      });
      meta = await meta;
      if (meta.exif) {
        this.$set(this, "exif", {
            description: this.hasKey(meta.exif, "270") ? meta.exif["270"] : null,
            software: this.hasKey(meta.exif, "305") ? meta.exif["305"] : null,
            datetime: this.hasKey(meta.exif, "306") ? meta.exif["306"] : null
          }
        );
      }
      if (meta.iptc) {
        this.$set(this, "iptc", {
          author: this.hasKey(meta.iptc, "80") ? meta.iptc["80"] : null,
          credit: this.hasKey(meta.iptc, "110") ? meta.iptc["110"] : null
        });
      }
      this.changed = true;
    },
    clear() {
      this.$set(this, "changed", false);
      this.$set(this, "exif", {});
      this.$set(this, "iptc", {});
    }
  },
  beforeDestroy() {
    // TODO: 解放
    this.clear();
  }
}
</script>

<style scoped>
.card-class {
  width : 100%;
}
</style>
