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
      component:()=>import("@/views/Layout"),
      children:[
        {
          path:"index",
          component:()=>import("@/views/layout/Index")
        },
        {
          path:"menu",
          component:()=>import("@/views/layout/Menu")
        },
        {
          path:"role",
          component:()=>import("@/views/layout/Role")
        },
        {
          path:"user",
          component:()=>import("@/views/layout/User")
        },
        {
          path:"category",
          component:()=>import("@/views/layout/Category")
        },
        {
          path:"specs",
          component:()=>import("@/views/layout/Specs")
        },
        {
          path:"goods",
          component:()=>import("@/views/layout/Goods")
        },
        {
          path:"member",
          component:()=>import("@/views/layout/Member")
        },
        {
          path:"banner",
          component:()=>import("@/views/layout/Banner")
        },
        {
          path:"seckill",
          component:()=>import("@/views/layout/Seck")
        },
        {
          path:"*",
          redirect:"index"
        }
      ]
    }
  ]
})
router.beforeEach((to,from,next)=>{
  let token=localStorage.getItem("info")?JSON.parse(localStorage.getItem("info")).token:false;
  let usefulUrl=localStorage.getItem("info")?JSON.parse(localStorage.getItem("info")).menus_url:false;
  if(token){
    if(to.path=="/login"){
      next(false)
    }else{
      usefulUrl.push('/index','/');
      if(usefulUrl.indexOf(to.path)==-1){
        next(false)
      }else{
        next();
      }
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
