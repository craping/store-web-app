import request from '../../utils/request'

export default {
    namespaced: true,
    state: {
        queryParams: {
            inExType: 0, // 收支类型
            typeFilter: 0, // 快捷筛选
            dateTime: 0, // 选择日期
        },
        bills:[]
    },
    mutations: {
        SET_QUERYPARAMS(state, data) {
            state.queryParams = data
        },
        SET_BILLS(state, data) {
            state.bills = data
        },
    },
    actions: {
        setQueryparams({ commit, state }, data) {
            const params = Object.assign({}, state.queryParams, data)
            commit('SET_QUERYPARAMS', params)
        },
        queryBill({ commit, state }) {
            console.log('st',state)
            return new Promise((resolve, reject) => {
                request.get("", state.queryParams).then(data => {
                    commit('SET_BILLS', data.info)
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        }

    }
}