import Vue from 'vue'
import Vuex from 'vuex'
import { register, getContract } from '../ethereum/register'

Vue.use(Vuex)

const REGISTER_WEB3_INSTANCE = 'REGISTER_WEB3_INSTANCE'
const REGISTER_CONTRACT_INSTANCE = 'REGISTER_CONTRACT_INSTANCE'
const SET_ACCOUNT = 'SET_ACCOUNT'
const SET_BLOBS = 'SET_BLOBS'
const SET_ERROR = 'SET_ERROR'

export default new Vuex.Store({
  state: {
    web3: null,
    error: null,
    account: null,
    contractInstance: null,
    blobs: null,
  },
  mutations: {
    [REGISTER_WEB3_INSTANCE](state, { web3 }) {
      state.web3 = web3
    },

    [REGISTER_CONTRACT_INSTANCE](state, { contractInstance }) {
      state.contractInstance = contractInstance
    },

    [SET_ACCOUNT](state, { account }) {
      state.account = account
    },

    [SET_BLOBS](state, { blobs }) {
      state.blobs = blobs
    },

    [SET_ERROR](state, payload) {
      Vue.$toast.error(payload)
      state.error = payload
    }
  },
  actions: {
    async registerWeb3({ commit, dispatch }) {
      let result
      try {
        result = await register();
        commit(REGISTER_WEB3_INSTANCE, result)
        Vue.$toast.success('Metamask detected!')
      } catch (e) {
        console.error('register web3: ', e)
        commit(SET_ERROR, e.message)

        throw e
      }

      // TODO
      // window.ethereum is not immediately fully injected/initialised.
      // This setTimeout to sleep is a dumb solution and should be improved
      // INSTEAD: Subscribe to metamask hooks
      setTimeout(() => {
        const { web3 } = result
        const ethereum = web3.currentProvider
        if (!ethereum.isConnected() || !ethereum.networkVersion) {
          commit(SET_ERROR, 'Could not connect to Metamask, try reloading')
          return
        }

        // accepting both 4 and "4"
        if (ethereum.networkVersion != 4) {
          commit(SET_ERROR, 'This application only runs on Rinkeby, please update your network on Metamask')
          return
        }

        dispatch('registerHooks')
      }, 1500)
    },

    registerHooks({ commit, dispatch }) {
      const ethereum = this.state.web3.currentProvider

      // If the network changes or the user disconnects their account, reload the app
      ethereum.on('chainChanged', () => { window.location.reload() })
      ethereum.on('disconnect', () => { window.location.reload() })

      ethereum.on('accountsChanged', (accounts) => {
        const account = accounts[0]
        console.log('account changed:', account)

        commit(SET_ACCOUNT, { account })
        dispatch('refreshBlobs')
      })
    },

    async registerContract({ commit }) {
      try {
        const contractInstance = await getContract(this.state.web3)
        commit(REGISTER_CONTRACT_INSTANCE, { contractInstance })
        Vue.$toast.success('Connected to the smart contract')
      } catch (e) {
        console.error('register contract instance: ', e)
        commit(SET_ERROR, e.message)
      }
    },

    setAccount({ commit, dispatch }, { account }) {
      // TODO: store in a cookie so we don't have to connect every time
      Vue.$toast.success(`Account ${account.substring(0, 6)}... connected!`)
      commit(SET_ACCOUNT, { account })

      dispatch('refreshBlobs')
    },

    async refreshBlobs({ commit }) {
      const { account } = this.state

      const tx = await this.state.contractInstance.methods.getBlobsByOwner(account);

      let ids;
      try {
        ids = await tx.call({ from: account });
      } catch (e) {
        console.error(e);
        Vue.$toast.error(e.message);
        return;
      }

      const getBlob = async (id) => {
        const tx = await this.state.contractInstance.methods.blobs(id);


        let blob;
        try {
          blob = await tx.call({ from: account });
        } catch (e) {
          console.error(e);
          Vue.$toast.error(e.message);
          return;
        }

        return blob;
      }

      const blobs = await Promise.all(
        ids.map(async (id) => {
          const blob = await getBlob(id);
          return {
            id,
            name: blob[0],
            ...blob,
          };
        })
      );

      commit(SET_BLOBS, { blobs })
      Vue.$toast.info('Blobs refreshed');
    }
  },
  modules: {
  }
})
