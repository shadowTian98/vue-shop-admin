import axios from "axios"
import store from "@/store"
import router from "@/router"
import qs from "qs"
//请求拦截器
axios.interceptors.request.use(config => {
    // Do something before request is sent
    if (localStorage.getItem("info")) {
        config.headers.Authorization = JSON.parse(localStorage.getItem("info")).token;
    }
    config.data = qs.stringify(config.data);
    return config;
}, error => {
    // Do something with request error
    return Promise.reject(error);
});
//响应拦截器
axios.interceptors.response.use(response => {
    // Do something before response is sent
    if (response.data.code == 403) {
        localStorage.clear();
        store.commit("SET_INFO", {});
        router.replace("/login")
    }
    return response.data;
}, error => {
    // Do something with response error
    return Promise.reject(error);
});
//创建一个axios的独立拷贝upload,上传文件
//请求拦截器
let upload = axios.create();
upload.interceptors.request.use(config => {
    // Do something before request is sent
    if (localStorage.getItem("info")) {
        config.headers.Authorization = JSON.parse(localStorage.getItem("info")).token;
    }
    let type='Content-Type'
    config.headers[type]="multipart/form-data";
    // console.log(config.data);
    console.log(config);
    let formDataBox = new FormData();
    for (let item in config.data) {
        formDataBox.append(item, config.data[item])
    }
    config.data = formDataBox;
    return config;
}, error => {
    // Do something with request error
    return Promise.reject(error);
});
//响应拦截器
upload.interceptors.response.use(response => {
    // Do something before response is sent
    if (response.data.code == 403) {
        localStorage.clear();
        store.commit("SET_INFO", {});
        router.replace("/login")
    }
    return response.data;
}, error => {
    // Do something with response error
    return Promise.reject(error);
});
export default { axios, upload }