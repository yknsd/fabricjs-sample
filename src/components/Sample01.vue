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
        <v-card-title class="text-left">Crop</v-card-title>
        <v-card-text class="text-left">
          <v-row align="center">
            <v-col cols="6">
              <v-select
                label="width"
                :value="selectedWidth"
                :items="widthList"
                @change="setSelectedIndexFromW"
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-select
                label="height"
                :value="selectedHeight"
                :items="heightList"
                @change="setSelectedIndexFromH"
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-row>

    <v-row class="mt-5">
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
      maxWidth: MAX_WIDTH,
      maxHeight: MAX_HEIGHT,
      originalBlob: null,
      errorMessages: [],
      lists: [
        {width: 0, height: 0}
      ],
      selectedIndex: 10,
      selectedWidth: 0,
      selectedHeight: 0
    };
  },
  computed: {
    isError() {
      return 0 < this.errorMessages;
    },
    widthList() {
      return this.lists.map(({width}) => width);
    },
    heightList() {
      return this.lists.map(({height}) => height);
    }
  },
  watch: {
    selectedIndex(newIndex) {
      const options = {
        maxWidth: this.lists[newIndex].width,
        maxHeight: this.lists[newIndex].height
      };
      this.cropImage(options);
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
        maxWidth: 8192,
        maxHeight: 8192
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
      this.maxWidth = result.originalWidth < MAX_WIDTH ? result.originalWidth : MAX_WIDTH;
      this.maxHeight = result.originalHeight < MAX_HEIGHT ? result.originalHeight : MAX_WIDTH;
      this.setLists();
    },
    /**
     * Crop image
     * @param options
     */
    async cropImage(options) {
      options.canvas = true;
      options.crop = true;
      console.log("cropImage:", options);

      const croppedImage = await loadImage(this.originalBlob, options)
        .then(function (data) {
            return data.image;
          }
        )
        .catch(function (error) {
          console.log(error);
        });

      console.log("croppedImage:", croppedImage);
      URL.revokeObjectURL(this.imgSrc);
      this.imgSrc = croppedImage.toDataURL(this.originalBlob.type);
    },
    clear() {
      this.imgSrc = null;
      this.$set(this, "errorMessages", []);
    },
    /**
     * Set lists
     */
    setLists() {
      if (this.maxWidth < 10 || this.maxHeight < 10) {
        this.$set(this, "lists", {
          width: [this.maxWidth],
          height: [this.maxHeight]
        });
        return;
      }
      const widthC = Math.trunc(this.maxWidth / 10);
      const heightC = Math.trunc(this.maxHeight / 10);
      let list = [];
      for (let i = 1; i < 10; i++) {
        list[i - 1] = {
          width: i * widthC,
          height: i * heightC
        };
      }
      list[9] = {
        width: this.maxWidth,
        height: this.maxHeight
      }
      console.log("list:", list);
      this.$set(this, "lists", list);
    },
    /**
     * Set selectedIndex from width
     * @param value
     */
    setSelectedIndexFromW(value) {
      const index = this.lists.findIndex(({width}) => width === value);
      if (this.selectedIndex === index) return;
      this.selectedIndex = index;
      this.selectedHeight = this.lists[index].height;
    },
    /**
     * Set selectedIndex from height
     * @param value
     */
    setSelectedIndexFromH(value) {
      const index = this.lists.findIndex(({height}) => height === value);
      if (this.selectedIndex === index) return;
      this.selectedIndex = index;
      this.selectedWidth = this.lists[index].width;
    }
  }
}
</script>
