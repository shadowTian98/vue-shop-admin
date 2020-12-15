import Vue from "vue"
import Vuex from "vuex"
Vue.use(Vuex)
let info=localStorage.getItem("info")?JSON.parse(localStorage.getItem("info")):{};
let store = new Vuex.Store({
    state:{
        info,
    },
    getters:{
        username(state){
            return state.info.username
        },
    },
    mutations:{
        SET_INFO(state,payload){
            state.info=payload
        },
    },
    actions:{

    },
    modules:{

    }
})
export default store