import Vue from 'vue';
import Vuex from 'vuex';
import {fabric} from "fabric";
import wText from "./Text";

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        wText
    },
    state: {
        filename: "",
        menus: ["filter", "text", "drawing", "trash", "export"],
        selectedMenuIndex: 0,
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
        filename(state) {
            return state.filename;
        },
        selectedMenuIndex(state){
            return state.selectedMenuIndex;
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
        SET_FILENAME(state, name) {
            state.filename = name;
        },
        SET_SELECTED_MENU_INDEX(state, index){
            state.selectedMenuIndex = index;
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
