import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        menus: ["trim", "filter", "text", "drawing"],
        selectedMenuIndex: 0,
        canvasJson: {}
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
        }
    },
    mutations: {
        SET_SELECTED_MENU_INDEX(state, index){
            state.selectedMenuIndex = index;
        },
        SET_CANVAS_JSON(state, json) {
            json.objects = json.objects.map(function(value, index) {
                // eslint-disable-next-line no-prototype-builtins
                if(value.hasOwnProperty("src")){
                    value.src = "";
                }
                console.log("value:", value, "index:",index);
                return value;
            });
            state.canvasJson = json;
        }
    },
    actions: {}
})

export default store