import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter,asyncRouterMap,constantRoutes } from '@/router'


const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    roles:[],
    routers:[]
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES:(state,roles) => { 
    state.roles = roles
  },
  SET_ROUTERS:(state,routers)=>{
    state.routers = [...constantRoutes,...routers]
  }
}
const filterRouterMap = (routers)=>{
  const res = [];
  routers.forEach((item)=>{
    if(item.meta && item.meta.role && item.meta.role.includes(state.roles[0]) || item.meta.role[0] == "*"){
      if(item.children){
        item.children = filterRouterMap(item.children)
      }
      res.push(item)
    }
  })
  return res;
}

const actions = {
  auth({commit}){
    const routers = filterRouterMap(asyncRouterMap)
    console.log(routers)
    commit('SET_ROUTERS', routers)
    return routers;
  },
  // user login
  login({ commit },loginForm) {
    return new Promise(async (resolve,reject)=>{
      try{
        const {data}  = await login(loginForm);
        if(data){
          commit('SET_TOKEN', data.token)
          setToken( data.token)
          resolve()
        }else{
          reject()
        }
      }catch(err){
        reject()
      }
     
    })
   

  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise(async (resolve, reject) => {
      try{
  
        const {data} =  await getInfo(state.token);
   
        if (!data) {
          reject('Verification failed, please Login again.')
        }else{
          const { name, avatar,roles } = data
  
          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar)
          commit('SET_ROLES', roles)
          resolve(data)
        }
  
      }catch(err){
        reject(err)
   
     }
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise(async (resolve, reject) => {
        try{
          await logout(state.token)
          removeToken() // must remove  token  first
          resetRouter()
          commit('RESET_STATE')
          resolve()
        }catch(error) {
        reject(error)
      }
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

