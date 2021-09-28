<template>
  <v-card
    v-if="imgSrc"
    class="card-class"
  >
    <v-card-title class="text-left">Image</v-card-title>
    <v-card-text class="text-left">
      <canvas
        id="img-pad"
        @mousedown="mouseDown"
        @mousemove="mouseMove"
        @mouseup="mouseUp"
        :width="canvasWidth"
        :height="canvasHeight"
      />
      <Footer
        @trim="trimImage"
        @filter="filterImage"
        @text="text"
        @drawing="drawing"
        @erase="erase"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import {fabric} from "fabric";
import Footer from "./Footer";
import { mapGetters } from "vuex";

const MAX_WIDTH = 800;
const MAX_HEIGHT = 800;

export default {
  components: {
    Footer
  },
  props: {
    imgSrc: {
      type: String
    },
    canvasWidth: {
      type: Number,
      default: MAX_WIDTH
    },
    canvasHeight: {
      type: Number,
      default: MAX_HEIGHT
    }
  },
  data() {
    return {
      canvas: {
        type: Object
      },
      trimSquare: null,
      imgObj: null,
      itext: null,
      textBox: null
    };
  },
  computed: {
    ...mapGetters([
      "selectedMenuIndex",
      "selectedFontName",
      "textSize",
      "textWeight",
      "underline",
      "lineThrough",
      "fontStyle"
    ])
  },
  watch: {
    selectedMenuIndex(newIndex){
      console.log("selectedMenuIndex");
      if(newIndex !== 3){
        this.$set(this.canvas, "isDrawingMode", false);
      }
      this.canvas.sendToBack(this.imgObj);
      const json = this.canvas.toJSON();
      console.log("canvas.toJSON:",json);
      this.$store.commit("SET_CANVAS_JSON", json);
    },
    selectedFontName(name) {
      this.itext.set("fontFamily",name);
      this.textBox.set("fontFamily",name);
      this.itext.setCoords();
      this.textBox.setCoords();
    },
    textSize(size){
      this.itext.set("fontsSize",size);
      this.textBox.set("fontSize",size);
      this.itext.setCoords();
      this.textBox.setCoords();
    },
    textWeight(weight) {
      this.itext.set("fontWeight",weight);
      this.textBox.set("fontWeight",weight);
      this.itext.setCoords();
      this.textBox.setCoords();
    },
    underline(isShow) {
      this.itext.set("underline",isShow);
      this.textBox.set("underline",isShow);
      this.itext.setCoords();
      this.textBox.setCoords();
    },
    lineThrough(isShow) {
      this.itext.set("linethrough",isShow);
      this.textBox.set("linethrough",isShow);
      this.itext.setCoords();
      this.textBox.setCoords();
    },
    fontStyle(style) {
      this.itext.set("fontStyle",style);
      this.textBox.set("fontStyle", style);
      this.itext.setCoords();
      this.textBox.setCoords();
    }
  },
  mounted() {
    const canvas = new fabric.Canvas('img-pad');
    const width = this.canvasWidth;
    const height = this.canvasHeight;
    let img;
    if (this.imgSrc) {
      fabric.Image.fromURL(this.imgSrc, function (objImg) {
        console.log("mounted: objImg, ", objImg);
        objImg.set({
          cornerStrokeColor: "rgb(110,110,125)",
          scaleX: width / MAX_WIDTH,
          scaleY: height / MAX_HEIGHT,
          selectable: true
        });
        objImg.setControlsVisibility({
          mt: false,
          mb: false,
          ml: false,
          mr: false
        });
        img = objImg;
        // canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
        canvas.add(objImg);
        canvas.setActiveObject(objImg);
      });
      this.imgObj = img;
      console.log("imgObj:", this.imgObj);
    }
    this.$set(this, "canvas", canvas);
    console.log("canvas:", this.canvas);
  },
  methods: {
    /**
     * Mouse down
     */
    mouseDown(event) {
      console.log("mouse down:", event);
      if (this.selectedMenuIndex === 0) {
        this.trimSquare.left = event.e.pageX;
        this.trimSquare.top = event.e.pageY;
        this.trimSquare.visible = true;
        this.canvas.bringToFront(this.trimSquare);
      }
    },
    /**
     * Mouse move
     */
    mouseMove(event) {
      console.log("mouse move", event);
    },
    /**
     * Mouse up
     */
    mouseUp(event) {
      console.log("mouse up:", event);
      if (this.selectedMenuIndex === 0) {
        let left = this.trimSquare.left - this.imgObj.left * (1/0.25);
        let top = this.trimSquare.top - this.imgObj.top * (1/0.25);
        let width = this.trimSquare.width * 1/0.25;
        let height = this.trimSquare.height * 1/0.25;

        this.imgObj.clipTo = function (ctx) {
          ctx.rect(left, top, width, height);
        };
        this.trimSquare.visible = false;
        this.canvas.renderAll();
      }
    },
    /**
     * Trim
     */
    trimImage() {
      console.log("trim image:");
      let rect = new fabric.Rect({
        fill: 'transparent',
        originX: 'left',
        originY: 'top',
        stroke: '#ccc',
        strokeDashArray: [2, 2],
        opacity: 1,
        width: 1,
        height: 1
      });
      rect.visible = false;
      console.log("trim square:", rect);
      // this.canvas.setActiveObject(rect);
      this.canvas.discardActiveObject();
      this.canvas.renderAll();
      this.canvas.forEachObject(function(object){
        object.selectable = false;
      });
      this.canvas.add(rect);
    },
    /**
     * Filter
     */
    filterImage() {
      let obj = this.canvas.getActiveObject();
      if (obj && obj.filters) {
        obj.filters.push(
          new fabric.Image.filters.Sepia()
        );
        obj.applyFilters();
        this.canvas.renderAll();
      }
    },
    /**
     * Add text
     */
    addText() {
      const itext = new fabric.IText("Hello world",
        {
          left: 100,
          top: 100,
          textAlign: 'center',
          charSpacing: 50,
          fill: '#26C6DA',
          strokeWidth: 2,
          stroke: "#1DE9B6",
          fontFamily: this.selectedFontName,
          fontSize: this.textSize,
          fontWeight: this.textWeight,
          underline: this.underline,
          linethrough: this.lineThrough
        }
      );
      this.itext = itext;
      const textBox = new fabric.Textbox("TextBox",
        {
          left: 100,
          top: 200,
          textAlign: 'center',
          charSpacing: 50,
          fill: '#C6FF00',
          strokeWidth: 2,
          stroke: "#FFCA28",
          fontFamily: this.selectedFontName,
          fontSize: this.textSize,
          fontWeight: this.textWeight,
          underline: this.underline,
          linethrough: this.lineThrough
        });
      this.textBox = textBox;
      this.canvas.add(itext, textBox);
      this.canvas.setActiveObject(itext);
      console.log("canvas:", this.canvas);
    },
    text() {
      if (!this.itext) {
        this.addText();
      } else {
        this.canvas.setActiveObject(this.itext);
        this.canvas.setActiveObject(this.textBox);
      }
    },
    /**
     * Drawing
     */
    drawing() {
      console.log("drawing");
      this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
      this.canvas.freeDrawingBrush.color = "#42A5F5";
      this.canvas.freeDrawingBrush.width = 10;
      this.canvas.isDrawingMode = true;
    },
    /**
     * Erase
     */
    erase(){
      console.log("erase");
    }
  }
}
</script>

<style scoped>
.card-class {
  width      : 100%;
  min-height : 400px;
}
canvas {
  border : 1px solid;
}
</style>
