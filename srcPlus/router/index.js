import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

let router =  new Router({
  routes: [
    {
      path:"/login",
      component:()=>import("@/views/Login")
    },
    {
      path:"/",
      component:()=>import("@/views/Layout")
    }
  ]
})
router.beforeEach((to,from,next)=>{
  let token =localStorage.getItem("info")?JSON.parse(localStorage.getItem("info")).token:false;
  if(token){
    if(to.path=="/login"){
      next(false)
    }else{
      next()
    }
  }else{
    if(to.path=="/login"){
      next()
    }else{
      next("/login")
    }
  }
})
export default router
