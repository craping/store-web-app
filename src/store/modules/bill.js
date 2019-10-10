import request from '@/utils/request'
import { format } from "@/utils/util";

export default {
	namespaced: true,
	state: {
		queryParams: {
			type: null, // 收支类型
			srcType: null, // 账单类型
			date: format(new Date(), "yyyy-MM"),// 搜索月份 格式：yyyy-MM
			beginDate: new Date(),// 搜索月份 格式 yyyy-MM-dd
			endDate: new Date(),// 搜索月份 格式：yyyy-MM-dd
			pageNum: 0,
			pageSize: 10
		},
		bills: []
	},
	mutations: {
		SET_QUERYPARAMS(state, data) {
			state.queryParams = data
		},
		SET_TYPE(state, data) {
			state.queryParams.type = data
		},
		SET_SRCTYPE(state, data) {
			state.queryParams.srcType = data
		},
		SET_DATE(state, data) {
			state.queryParams.date = format(data, "yyyy-MM")
		},
		SET_BEGINDATE(state, data) {
			state.queryParams.beginDate = format(data, "yyyy-MM-dd")
		},
		SET_ENDDATE(state, data) {
			state.queryParams.endDate = format(data, "yyyy-MM-dd")
		},
		SET_PAGENUM(state, data) {
			state.queryParams.pageNum = data
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
			console.log('st', state)
			return new Promise((resolve, reject) => {
				request.post("/account/bill/list", state.queryParams).then(data => {
					commit('SET_BILLS', data.info)
					resolve()
				}).catch(error => {
					reject(error)
				})
			})
		}

	}
}