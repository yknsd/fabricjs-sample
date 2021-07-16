<template>
  <v-col cols="10">
    <v-row>
      <v-file-input
        show-size
        label="File input"
        accept="image/png, image/jpeg"
        :rules="rules"
        @change="showExif"
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
          <v-row v-if="iptc.author" align="center">
              <v-col cols="3">author</v-col>
              <v-col cols="9"> {{ iptc.author }}</v-col>
          </v-row>
          <v-row v-if="iptc.credit" align="center">
              <v-col cols="3">credit</v-col>
              <v-col cols="9"> {{ iptc.credit }}</v-col>
          </v-row>
          <v-row v-if="exif.description" align="center">
            <v-col cols="3">description</v-col>
            <v-col cols="9">{{ exif.description }}</v-col>
          </v-row>
          <v-row v-if="exif.software" align="center">
              <v-col cols="3">software</v-col>
              <v-col cols="9">{{ exif.software }}</v-col>
          </v-row>
          <v-row v-if="exif.datetime" align="center">
              <v-col cols="3">datetime</v-col>
              <v-col cols="9">{{ exif.datetime }}</v-col>
          </v-row>
          <v-row v-if="exif.orientation" align="center">
            <v-col cols="3">orientation</v-col>
            <v-col cols="9">
              <v-select
                v-if="canOverrideExif"
                :value="selectedOrientation"
                :items="orientations"
                @change="overrideExif"
              ></v-select>
              <p v-else>{{ selectedOrientation }}</p>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-row v-else-if="changed && !hasMetaData">
        <v-col cols="12">Not Found Meta Data</v-col>
      </v-row>
    </v-row>

    <v-row class="mt-5">
      <v-card
        v-if="imgSrc"
        class="card-class"
      >
        <v-card-title class="text-left">Image</v-card-title>
        <v-card-text class="text-left">
          <v-img
            :src="imgSrc"
            :max-width="maxWidth"
            :max-height="maxHeight"
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
const MAX_HEIGHT = 500;

export default {
  data() {
    return {
      rules: [
        value => !value || value.size < 2000000 || 'Image size should be less than 2 MB!',
      ],
      exif: {
        description: null,
        software: null,
        datetime: null,
        orientation: null
      },
      iptc: {
        author: null,
        credit: null
      },
      changed: false,
      originalBlob: null,
      inputData: null,
      selectedOrientation: { text: "natural", value: 1 },
      orientations: [
        { text: "natural", value: 1 },
        { text: "Horizontal flip", value: 2 },
        { text: "180° Rotate CCW", value: 3 },
        { text: "Vertical flip", value: 4 },
        { text: "Horizontal flip + 90° Rotate CCW", value: 5 },
        { text: "90° Rotate CCW", value: 6 },
        { text: "Vertical flip + 90° Rotate CCW", value: 7 },
        { text: "90° Rotate CW", value: 8 }
      ],
      imgSrc: null,
      maxWidth: MAX_WIDTH,
      maxHeight: MAX_HEIGHT
    };
  },
  computed: {
    hasMetaData() {
      const values = Object.values(this.exif).concat(Object.values(this.iptc)).filter(value => value != null);
      return 0 < values.length;
    },
    canOverrideExif(){
      return this.inputData.imageHead && this.inputData.exif;
    }
  },
  methods: {
    /**
     * Check the object has a key
     * https://eslint.org/docs/rules/no-prototype-builtins
     *
     * @param obj
     * @param key
     */
    hasKey(obj, key) {
      return obj && Object.prototype.hasOwnProperty.call(obj, key);
    },
    /**
     * Show exif
     * @param file
     */
    async showExif(file) {
      if (!file) {
        return;
      }
      this.clear();
      console.log("showExif: ", file);
      let meta = loadImage.parseMetaData(
        file,
        {maxMetaDataSize: 262144}
      );
      meta = await meta;
      console.log("meta:",meta);
      this.$set(this, "inputData", meta);
      if (meta.exif) {
        this.$set(this, "exif", {
            description: this.hasKey(meta.exif, "270") ? meta.exif["270"] : null,
            software: this.hasKey(meta.exif, "305") ? meta.exif["305"] : null,
            datetime: this.hasKey(meta.exif, "306") ? meta.exif["306"] : null,
            orientation: this.hasKey(meta.exif, "274") ? meta.exif["274"] : null
          }
        );
        if(this.exif.orientation) {
          this.setSelectedOrientation();
        }
      }
      if (meta.iptc) {
        this.$set(this, "iptc", {
          author: this.hasKey(meta.iptc, "80") ? meta.iptc["80"] : null,
          credit: this.hasKey(meta.iptc, "110") ? meta.iptc["110"] : null
        });
      }
      this.changed = true;
      await this.loadImageFunction(file);
    },
    /**
     * Load image
     * @param file
     * @param options
     */
    async loadImageFunction(file, options = {}) {
      options.canvas = true;
      options.maxWidth = MAX_WIDTH;
      options.maxHeight = MAX_HEIGHT;
      options.contain = true;
      console.log("loadImageFunction:", file, options);

      const result = await loadImage(file, options).then(function (data) {
        return new Promise(function (resolve) {
          data.image.toBlob(function (blob) {
            data.blob = blob;
            resolve(data);
          }, file.type);
        }).catch(function (error) {
          console.log("loading error:", error);
        });
      });
      console.log("result:", result);
      this.originalBlob = result.blob;
      // NOTE: https://ja.javascript.info/blob#ref-33
      // blob のマッピングがある間、blob 自身はメモリ内に存在し続けます。ブラウザはそれを解放することはできません。
      // マッピングは、ドキュメントがアンロードされると自動的にクリアされ、blob もそのとき解放されます。しかしアプリケーションの寿命が長ければ、すぐにはそれは起きません。
      // したがって、URL を作成すると、それ以上必要なくなっても、blob はメモリに溜まります。
      // URL.revokeObjectURL(url) は内部のマッピングから参照を削除します。これにより blob が削除され(他に参照がない場合)、メモリを解放することができます。
      if (this.imgSrc) {
        URL.revokeObjectURL(this.imgSrc);
      }
      this.imgSrc = URL.createObjectURL(this.originalBlob);
      this.maxWidth = result.originalWidth < MAX_WIDTH ? result.originalWidth : MAX_WIDTH;
      this.maxHeight = result.originalHeight < MAX_HEIGHT ? result.originalHeight : MAX_HEIGHT;
    },
    /**
     * Rotate image
     */
    async rotateImage(options) {
      options.canvas = true;
      console.log("rotateImage:",this.originalBlob, options);

      const result = await loadImage(this.originalBlob, options).then(function (data) {
        return data;
      }).catch(function (error) {
        console.log("loading error:", error);
      });

      console.log("result:", result);
      if (this.imgSrc) {
        URL.revokeObjectURL(this.imgSrc);
      }
      this.imgSrc = result.image.toDataURL(this.originalBlob.type);
    },
    /**
     * Clear input data
     */
    clear() {
      this.$set(this, "changed", false);
      this.$set(this, "exif", {});
      this.$set(this, "iptc", {});
      if (this.imgSrc) {
        URL.revokeObjectURL(this.imgSrc);
      }
      this.imgSrc = null;
    },
    /**
     * Override exif
     * @param orientation
     * @returns {Promise<void>}
     */
    async overrideExif(orientation) {
      console.log("overrideExif: ",orientation);
      if (!this.canOverrideExif) {
        console.log("can not override exif");
        return;
      } else if (orientation === this.exif.orientation) {
        console.log("Skip processing due to same value");
        return;
      }
      const updatedImageHead = loadImage.writeExifData(this.inputData.imageHead, this.inputData, "Orientation", orientation);
      console.log("result:",updatedImageHead);
      this.exif.orientation = orientation;
      this.inputData.imageHead = updatedImageHead;

      await this.rotateImage({orientation: orientation});

      // 上書きしたExifからBlob生成
      // console.log("Uint8ClampedArray:", new Uint8ClampedArray(updatedImageHead));
      // const updatedBlob = new Blob([this.inputData], { type: this.inputBlob.type });
      // console.log("updatedBlob:", updatedBlob);
      // URL.revokeObjectURL(this.imgSrc);
      // this.imgSrc = URL.createObjectURL(updatedBlob);
      // this.inputBlob = updatedBlob;
      // console.log(this.imgSrc);
    },
    /**
     * Set selectedOrientation
     */
    setSelectedOrientation() {
      const index = this.orientations.findIndex(({value}) => value === this.exif.orientation);
      if (0 <= index) {
        this.$set(this, "selectedOrientation", this.orientations[index]);
      }
    }
  },
  beforeDestroy() {
    this.clear();
  }
}
</script>

<style>
.card-class {
  width : 100%;
}
</style>
