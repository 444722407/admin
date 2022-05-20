import getTradMarkData from "@/api/tradeMark"

const state = {
    list:[]
  }
  
  const mutations = {
    GET_DATA:(state,data) => {
        state.list = data.data.list;
    }
  }
  
  const actions = {
   async getData({commit}) {
      const data = await getTradMarkData();
      commit('GET_DATA',data)
    }
  }

export default {
    namespaced: true,
    state,
    mutations,
    actions
  }
  
  