import {getCategorysData} from "@/api/categorys"

const state = {
    list:[],
  } 
  
  const mutations = {
    GET_DATA:(state,{data}) => {
     
        state.list = data.data.data.list;
    }
  }
  
  const actions = {
   async getData({commit},{categoryId,level}) {
      const data = await getCategorysData();
      console.log(categoryId,level)
      commit('GET_DATA',{data})
    }
    
  }

export default {
    namespaced: true,
    state,
    mutations,
    actions
  }
  
  