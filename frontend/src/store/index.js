import Vue from 'vue'
import Vuex from 'vuex'
import { register, getContract } from '@/ethereum/register'
import { BlobContract } from '@/blobs/fetch.js'

Vue.use(Vuex)

const RinkebyChainId = '0x4' // must be in hexadecimal

const REGISTER_WEB3_INSTANCE = 'REGISTER_WEB3_INSTANCE'
const REGISTER_CONTRACT_INSTANCE = 'REGISTER_CONTRACT_INSTANCE'
const SET_ACCOUNT = 'SET_ACCOUNT'
const SET_OWNED_BLOBS_IDS = 'SET_OWNED_BLOBS_IDS'
const SET_BLOBS_FOR_SALE_IDS = 'SET_BLOBS_FOR_SALE_IDS'
const SET_BLOBS = 'SET_BLOBS'
const SET_ERROR = 'SET_ERROR'

export default new Vuex.Store({
  state: {
    web3: null,
    error: null,
    account: null,
    contract: null,
    ownedBlobsIds: null,
    blobsForSaleIds: null,
    blobs: null,
  },
  getters: {
    blob: ({ blobs }) => (id) => blobs[id],
  },
  mutations: {
    [REGISTER_WEB3_INSTANCE](state, { web3 }) {
      state.web3 = web3
    },

    [REGISTER_CONTRACT_INSTANCE](state, { contractInstance }) {
      window.contractInstance = contractInstance
      state.contract = new BlobContract(contractInstance)
    },

    [SET_ACCOUNT](state, { account }) {
      state.account = account
    },

    [SET_OWNED_BLOBS_IDS](state, { ownedBlobsIds }) {
      state.ownedBlobsIds = ownedBlobsIds.map(id => parseInt(id, 10))
    },

    [SET_BLOBS_FOR_SALE_IDS](state, { blobsForSaleIds }) {
      state.blobsForSaleIds = blobsForSaleIds.map(id => parseInt(id, 10))
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

      const ethereum = this.state.web3.currentProvider

      // Try to connect to metamask for 10 seconds
      const timeout = setTimeout(() => {
        commit(SET_ERROR, 'Could not connect to Metamask, try reloading')
      }, 10000)

      // Metamask takes some time to connect.
      // So we retry until it connects.
      const interval = setInterval(() => {
        if (!ethereum.isConnected()) {
          return
        }

        clearInterval(interval)
        clearTimeout(timeout)

        dispatch('registerHooks')

        // Rinkeby = 0x4, but it's returned as '4' by Metamask
        if (ethereum.networkVersion != 4) {
          commit(SET_ERROR, 'This application only runs on Rinkeby, please update your network on Metamask')
          ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: RinkebyChainId }],
          });
          return
        }

        dispatch('registerContract')
      }, 100)
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

    async connectAccount({ commit, dispatch }) {
      // TODO: store in a cookie so we don't have to connect every time
      let account;
      try {
        const accounts = await this.state.web3.eth.requestAccounts();
        // According to the Metamask documentation, it currently always returns 1 account.
        account = accounts[0];
      } catch (e) {
        Vue.$toast.error(e.message);
        return;
      }

      Vue.$toast.success(`Account ${account.substring(0, 6)}... connected!`)
      commit(SET_ACCOUNT, { account })

      dispatch('refreshBlobs')
    },

    // We refresh:
    // - owned blobs ids
    // - blobs for sale ids
    // - of the above blobs data
    async refreshBlobs({ commit }) {
      const { account, contract } = this.state

      const { ownedBlobsIds, blobsForSaleIds, blobs } = await contract.getBlobs(account)

      commit(SET_BLOBS, { blobs })
      commit(SET_OWNED_BLOBS_IDS, { ownedBlobsIds })
      commit(SET_BLOBS_FOR_SALE_IDS, { blobsForSaleIds })

      Vue.$toast.info('Blobs refreshed');
    }
  },
  modules: {
  }
})
