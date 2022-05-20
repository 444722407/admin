import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import tardeMark from './modules/tradeMark'
import categorys from './modules/categorys'
import attrs from './modules/attrs'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    tardeMark,
    categorys,
    attrs
  },
  getters
})

export default store
