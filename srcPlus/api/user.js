import axios from "@/utils/http"
//登录
async function login(data){
    let res = await axios.post("/api/userlogin", data)
    return res
}
export {login}