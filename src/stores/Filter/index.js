import {fabric} from "fabric";

export default {
    namespaced: true,
    state: {
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
        filters(state) {
            return state.filters;
        },
        selectedFilterIndex(state) {
            return state.selectedFilterIndex;
        }
    },
    mutations: {
        SET_SELECTED_FILTER(state, index) {
            state.selectedFilterIndex = index;
        }
    },
    actions: {}
}
