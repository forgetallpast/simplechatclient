import axios from 'axios'
import store from '../store'
import storage from './storage'
import router from '../router'
axios.defaults.withCredentials = true
// const apiDomain = process.env.VUE_APP_APIDOMAIN
async function getData(serverRoute, params = {}){
    if(!params.token && store.state.token){
        params.token = store.state.token
    }
    let response = await axios.get(serverRoute, {params: params})
    let result = {}
    if(typeof response.data === 'string'){
        result = {}
    }else{
        result = response.data
    }
    // token 已经过期
    if(result && result.code && result.code == 401){
        storage.del('token')
        store.commit("setToken", '')
        router.go({path: '/'})
    }
    return result
}
async function postData(serverRoute, params = {}, options = {}){
    if(!params.token && store.state.token){
        params.token = store.state.token
    }
    let response = await axios.post(serverRoute, params, options)
    console.log(response)
    let result = {}
    if(typeof response.data === 'string'){
        result = {}
    }else{
        result = response.data
    }
    // token 已经过期
    if(result && result.code && result.code == 401){
        storage.del('token')
        store.commit("setToken", '')
        router.go({path: '/'})
    }
    return result
}
export default {getData, postData}