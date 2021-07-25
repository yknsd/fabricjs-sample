import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        menus: ["trim", "filter", "text", "drawing"],
        selectedMenuIndex: 0
    },
    getters: {
        selectedMenuIndex(state){
            return state.selectedMenuIndex;
        },
        selectedMenu(state) {
            return state.menus[state.selectedMenuIndex];
        }
    },
    mutations: {
        SET_SELECTED_MENU_INDEX(state, index){
            state.selectedMenuIndex = index;
        },
    },
    actions: {}
})

export default store