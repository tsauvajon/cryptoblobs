import Vue from 'vue'
import Vuex from 'vuex'
import getWeb3 from '../web3/get'

Vue.use(Vuex)

const REGISTER_ETHEREUM_INSTANCE = 'regweb3instance'
const SET_ACCOUNT = 'setacc'
const SET_ERROR = 'err'

export default new Vuex.Store({
  state: {
    eth: null,
    error: null,
    account: null,
    contractInstance: null,
  },
  mutations: {
    [REGISTER_ETHEREUM_INSTANCE](state, { ethereum }) {
      state.eth = ethereum
    },

    [SET_ACCOUNT](state, { account }) {
      state.account = account
    },

    [SET_ERROR](state, payload) {
      Vue.$toast.error(payload)
      state.error = payload
    }
  },
  actions: {
    async registerEthereum({ commit }) {
      console.log('registering web3...')
      try {
        const result = await getWeb3();
        commit(REGISTER_ETHEREUM_INSTANCE, result)
        Vue.$toast.success('Metamask detected!')
      } catch (e) {
        console.log('register web3: ', e)
        commit(SET_ERROR, e.message)
      }
    },

    setAccount({ commit }, { account }) {
      // TODO: store in a cookie so we don't have to connect every time
      Vue.$toast.success(`Account ${account.substring(0, 6)}... connected!`)
      commit(SET_ACCOUNT, { account })
    }
  },
  modules: {
  }
})
