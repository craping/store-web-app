import request from '../../utils/request'

export default {
    namespaced: true,
    state: {
        currentCard: {
            bankCardNumber: "",
            bankName: "",
            userName: "",
            openingBank: ""
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
                    openingBank: ""
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