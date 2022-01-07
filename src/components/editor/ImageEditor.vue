<template>
  <v-card
    v-if="imgSrc"
    class="card-class"
  >
    <v-card-text class="text-center d-flex">
      <canvas
        id="img-pad"
        @mousedown="mouseDown"
        @mousemove="mouseMove"
        @mouseup="mouseUp"
        :width="canvasW"
        :height="canvasHeight"
      />
      <Footer
        class="func-toggle"
        :style="`left: ${canvasW - 50}px;top: 25px;`"
        @trim="trimImage"
        @filter="filterImage"
        @text="text"
        @drawing="drawing"
        @erase="erase"
      />
      <FooterTrim v-if="selectedMenuIndex === 0" class="ma-auto sub-menu-div" />
      <FooterFilter v-else-if="selectedMenuIndex===1" class="ma-auto sub-menu-div" />
      <FooterText v-else-if="selectedMenuIndex===2" class="ma-auto sub-menu-div"/>
      <FooterDrawing v-else-if="selectedMenuIndex === 3" class="ma-auto sub-menu-div" />
      <FooterErase v-else-if="selectedMenuIndex === 4" class="ma-auto sub-menu-div" />
    </v-card-text>
  </v-card>
</template>

<script>
import {fabric} from "fabric";
import Footer from "./Footer";
import FooterText from "./FooterText";
import { mapGetters } from "vuex";
import FooterDrawing from "./FooterDrawing";
import FooterErase from "./FooterErase";
import FooterFilter from "./FooterFilter";
import FooterTrim from "./FooterTrim";

const MAX_WIDTH = 800;
const MAX_HEIGHT = 800;
const CANVAS_PADDING = 100;

export default {
  components: {
    FooterTrim,
    FooterFilter,
    FooterErase,
    Footer,
    FooterText,
    FooterDrawing
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
      "fontStyle",
      "drawingColor",
      "drawingWidth"
    ]),
    canvasW() {
      return this.$props.canvasWidth < 400 ? 400 : this.$props.canvasWidth;
    }
  },
  watch: {
    selectedMenuIndex(newIndex, oldIndex){
      console.log("selectedMenuIndex:", oldIndex, "->", newIndex);
      if (newIndex !== 3) {
        this.$set(this.canvas, "isDrawingMode", false);
      } else {
        this.$set(this.canvas, "isDrawingMode", true);
      }
      const image = this.canvas.item(0);
      this.canvas.sendToBack(image);
      const json = this.canvas.toJSON();
      console.log("canvas.toJSON:",json);
      this.$store.commit("SET_CANVAS_JSON", json);
      if (newIndex === 0) {
        // image.set({
        //   evented: true,
        //   selectable: true
        // });
        this.canvas.setActiveObject(image);
      }
      this.canvas.requestRenderAll();
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
    // let img;
    if (this.imgSrc) {
      fabric.Image.fromURL(this.imgSrc, function (objImg) {
        console.log("mounted: objImg, ", objImg);
        const scale = width < height ? height / (MAX_HEIGHT + CANVAS_PADDING) : width / (MAX_WIDTH + CANVAS_PADDING);
        objImg.set({
          cornerStrokeColor: "rgb(110,110,125)",
          scaleX: scale,
          scaleY: scale,
          selectable: true
        });
        objImg.setControlsVisibility({
          mt: false,
          mb: false,
          ml: false,
          mr: false,
          mtr: false
        });
        // img = objImg;
        // canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
        canvas.add(objImg);
        canvas.centerObject(objImg);
        canvas.setActiveObject(objImg);
        canvas.renderAll();
      });
      // this.imgObj = img;
      // console.log("imgObj:", this.imgObj);
    }
    this.$set(this, "canvas", canvas);
    console.log("canvas:", this.canvas);
    this.$store.commit("SET_SELECTED_MENU_INDEX", 0);
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
        const image = this.canvas.item(0);
        const left = this.trimSquare.left - image.left * (1/0.25);
        const top = this.trimSquare.top - image.top * (1/0.25);
        const width = this.trimSquare.width * 1/0.25;
        const height = this.trimSquare.height * 1/0.25;

        image.clipTo = function (ctx) {
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
      this.canvas.freeDrawingBrush.color = this.drawingColor;
      this.canvas.freeDrawingBrush.width = this.drawingWidth;
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
.func-toggle {
  position: absolute;
}
.sub-menu-div {
  max-width        : 250px;
  max-height       : 280px;
  background-color : rgba(239, 239, 239, 0.7);
  border-radius    : 15px;
  padding          : 20px;
}
canvas {
  border : 1px solid;
}
</style>
