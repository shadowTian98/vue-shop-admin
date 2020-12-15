import axios from "axios"
//请求拦截器
axios.interceptors.request.use(config => {
// Do something before request is sent
config.headers.Authorization=localStorage.getItem("token");
return config;
},error => {
// Do something with request error
return Promise.reject(error);
});
//响应拦截器
axios.interceptors.response.use(response => {
// Do something before response is sent
return response.data;
},error => {
// Do something with response error
return Promise.reject(error);
});
export default axios