<template>
  <v-col cols="10">
    <v-btn color="primary" @click="$refs.InputImage.click()">Select image</v-btn>
    <p v-if="warnMsg" class="red--text caption">{{ warnMsg }}</p>
    <input
      ref="InputImage"
      type="file"
      accept="image/png, image/jpeg"
      @change="loadImageFunction"
      hidden
    />
    <v-row v-if="imgSrc" class="mt-10">
      <ImageEditor
        :img-src="imgSrc"
        :canvas-width="canvasWidth"
        :canvas-height="canvasHeight"
      />
    </v-row>
  </v-col>
</template>

<script>
import loadImage from 'blueimp-load-image';
import ImageEditor from "./editor/ImageEditor";

const MAX_WIDTH = 800;
const MIN_WIDTH = 300;
const MAX_HEIGHT = 800;
const MIN_HEIGHT = 300;

export default {
  components: {
    ImageEditor
  },
  data() {
    return {
      rules: [
        value => !value || value.size < 2000000 || 'Image size should be less than 2 MB!',
      ],
      imgSrc: null,
      canvasWidth: MAX_WIDTH,
      canvasHeight: MAX_HEIGHT,
      originalBlob: null,
      warnMsg: undefined,
    };
  },
  computed: {
    // isError() {
    //   return 0 < this.errorMessages;
    // },
  },
  beforeDestroy() {
    this.clear();
  },
  methods: {
    /**
     * Load image
     * @param event
     */
    async loadImageFunction(event) {
      console.log("loadImage:", event);
      if (!event) {
        console.log("no event");
        this.warnMsg = "Invalid event";
        return;
      }
      if(!event.target.files || 1 < event.target.files.length) {
        console.log("invalid files");
        this.warnMsg = "Invalid files";
        return;
      }
      const file = event.target.files[0];
      if (1e6 < file.size) {
        console.log("size over:", file.size);
        this.warnMsg = "Size over 1M";
        return;
      }
      const options = {
        canvas: true,
        maxWidth: MAX_WIDTH,
        maxHeight: MAX_HEIGHT,
        contain: true
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
      this.canvasWidth = result.originalWidth < MAX_WIDTH ? (result.originalWidth < MIN_WIDTH ? MIN_WIDTH : result.originalWidth) : MAX_WIDTH;
      this.canvasHeight = result.originalHeight < MAX_HEIGHT ? (result.originalHeight < MIN_HEIGHT ? MIN_HEIGHT : result.originalHeight) : MAX_HEIGHT;
      this.imgSrc = result.url;
      this.originalBlob = result.blob;
    },
    clear() {
      if (this.imgSrc) {
        URL.revokeObjectURL(this.imgSrc);
      }
      this.imgSrc = null;
      this.warnMsg = undefined;
    },
  }
}
</script>
