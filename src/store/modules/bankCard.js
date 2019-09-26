import request from '../../utils/request'

export default {
    namespaced: true,
    state: {
        currentCard: {
            bankCardNumber: "",
            bankName: "",
            userName: "",
            openingBank: "",
            id: null
        }
    },
    mutations: {
        SET_CURRENTCARD(state, data) {
            if (data) {
                state.currentCard = data
            } else {
                state.currentCard = {
                    bankCardNumber: "",
                    bankName: "",
                    userName: "",
                    openingBank: "",
                    id: null
                }
            }
        },
    },
    actions: {
        setCurrentCard({ commit }, data) {
            commit('SET_CURRENTCARD', data)
        },
    }
}