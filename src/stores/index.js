import Vue from 'vue';
import Vuex from 'vuex';
import {fabric} from "fabric";

Vue.use(Vuex);
export const fontFamilies = [
    "TimesNewRoman",
    "Comic Sans",
    "Delicious",
    "Hoefler Text",

];

const store = new Vuex.Store({
    state: {
        menus: ["trim", "filter", "text", "drawing", "erase", "trash"],
        selectedMenuIndex: 0,
        canvasJson: {},
        fontFamily: fontFamilies[0],
        colorRgba: "#b8ea08",
        textSize: 20,
        textWeight: 200,
        underline: false,
        lineThrough: false,
        fontStyle: "normal",
        fontAlign: "center",
        drawingColor: "#42A5F5",
        drawingWidth: 10,
        filters: [
            {
                name: "Normal"
            },
            {
                name: "Sepia",
                func: function() { return new fabric.Image.filters.Sepia(); }
            },
            {
                name: "Grayscale",
                func: function() { return new fabric.Image.filters.Grayscale(); }
            },
            {
                name: "Invert",
                func: function() { return new fabric.Image.filters.Invert(); }
            },
            {
                name: "Noise",
                func: function() {
                    return new fabric.Image.filters.Noise({ noise: 700 });
                }
            },
            {
                name: "Pixelate",
                func: function() {
                    return new fabric.Image.filters.Pixelate({ blocksize: 7 });
                }
            }
        ],
        selectedFilterIndex: 0
    },
    getters: {
        selectedMenuIndex(state){
            return state.selectedMenuIndex;
        },
        selectedMenu(state) {
            return state.menus[state.selectedMenuIndex];
        },
        canvasJson(state) {
            return state.canvasJson;
        },
        fontFamilyList() {
            return fontFamilies;
        },
        fontFamily(state) {
            return state.fontFamily;
        },
        colorRgba(state) {
            return state.colorRgba;
        },
        textSize(state) {
            return state.textSize;
        },
        textWeight(state) {
            return state.textWeight;
        },
        underline(state) {
            return state.underline;
        },
        lineThrough(state) {
            return state.lineThrough;
        },
        fontStyle(state) {
            return state.fontStyle;
        },
        fontAlign(state) {
            return state.fontAlign;
        },
        drawingColor(state) {
            return state.drawingColor;
        },
        drawingWidth(state) {
            return state.drawingWidth;
        },
        filters(state) {
            return state.filters;
        },
        selectedFilterIndex(state) {
            return state.selectedFilterIndex;
        }
    },
    mutations: {
        SET_SELECTED_MENU_INDEX(state, index){
            state.selectedMenuIndex = index;
        },
        SET_CANVAS_JSON(state, json) {
            json.objects = json.objects.map(function(value) {
                // eslint-disable-next-line no-prototype-builtins
                if(value.hasOwnProperty("src")){
                    value.src = "";
                }
                return value;
            });
            state.canvasJson = json;
        },
        SET_FONT_FAMILY(state, name) {
            state.fontFamily = fontFamilies.includes(name) ? name : fontFamilies[0];
        },
        SET_COLOR_RGBA(state, color) {
            state.colorRgba = color;
        },
        SET_TEXT_SIZE(state, size) {
            state.textSize = size;
        },
        SET_TEXT_WEIGHT(state, weight) {
            state.textWeight = weight;
        },
        SET_UNDERLINE(state, isShow) {
            state.underline = isShow;
        },
        SET_LINE_THROUGH(state, isShow) {
            state.lineThrough = isShow;
        },
        SET_FONT_STYLE(state, style) {
            state.fontStyle = style;
        },
        SET_FONT_ALIGN(state, align) {
            state.fontAlign = align;
        },
        SET_DRAWING_COLOR(state, code) {
            state.drawingColor = code;
        },
        SET_DRAWING_WIDTH(state, width) {
            state.drawingWidth = width;
        },
        SET_SELECTED_FILTER(state, index) {
            state.selectedFilterIndex = index;
        }
    },
    actions: {}
})

export default store
