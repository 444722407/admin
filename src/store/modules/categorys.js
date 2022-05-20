import {getCategorys} from "@/api/categorys"

const state = {
    list1:[],
    list2:[],
    list3:[]
  } 
  
  const mutations = {
    GET_DATA:(state,{data,id}) => {
        state[ 'list'+ id ] = data.data.categorys;
      
    }
  }
  
  const actions = {
   async getData({commit},id) {
      const data = await getCategorys(id);
      commit('GET_DATA',{data,id})
    }
    
  }

export default {
    namespaced: true,
    state,
    mutations,
    actions
  }
  
  