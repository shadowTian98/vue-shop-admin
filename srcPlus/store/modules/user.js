import {Message} from "element-ui"
import router from "@/router"
import {login} from "@/api/user"
const state = ()=>{
    let info=localStorage.getItem("info")?JSON.parse(localStorage.getItem("info")):{};
    return {
     info   
    }
}
const getters={
    username(state){
        console.log(state);
        return state.info.username
    }
}
const mutations={
    SET_INFO(state,info){
        state.info=info
    }
}
const actions={
    async set_info({commit},data){
        let info = await login(data)
          if (info.code == 200) {
            localStorage.setItem("info",JSON.stringify(info.list))
            commit("SET_INFO",info.list)
            router.replace("/");
          } else {
            Message.error(info.msg);
          }

    }
}
const user={
    namespaced:true,
    state,
    getters,
    mutations,
    actions
}
export default user