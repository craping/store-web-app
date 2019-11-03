import request from '@/utils/request'
import { format } from "@/utils/util";

export default {
	namespaced: true,
	state: {
		queryParams: {
			type: null, // 收支类型 0:支出,1:收入
			srcType: null, // 账单类型 [1_1:购物返现,1_2:直推佣金,1_3:分销佣金,1_4:取消订单,1_5:售后退款,0_1:订单交易,0_2:提现申请]
			date: null,// 搜索月份 格式：yyyy-MM
			beginDate: null,// 搜索月份 格式 yyyy-MM-dd
			endDate: null,// 搜索月份 格式：yyyy-MM-dd
			pageNum: 1,
			pageSize: 10
		},
		bills: []
	},
	getters: {
		billGroup: state => {
			let monthObj = {}
			let result = []
			if (state.bills.length > 0) {
				if (!state.queryParams.beginDate && !state.queryParams.endDate) {
					state.bills.forEach(element => {
						let monthKey = format(element.createTime, 'yyyy-MM')
						if (monthObj.hasOwnProperty(monthKey)) {
							monthObj[monthKey].push(element)
						} else {
							monthObj[monthKey] = [element]
						}
					});
					Object.keys(monthObj).forEach((key) => {
						result.push({ monthStr: key, list: monthObj[key], dateType:'month'})
					});
				} else {
					let beginStr = format(state.queryParams.beginDate, 'yyyy-MM-dd')
					let endStr = format(state.queryParams.endStr, 'yyyy-MM-dd')
					result =[{ beginStr, endStr, list: state.bills, dateType: 1}]
				}
			} else {
				if (!state.queryParams.beginDate && !state.queryParams.endDate) {
					if (state.queryParams.date) {
						let monthKey = format(state.queryParams.date, 'yyyy-MM')
						result = [{ monthStr: monthKey, list: [], dateType: 0}]
					} else {
						result = []
					}
				} else {
					let beginStr = format(state.queryParams.beginDate, 'yyyy-MM-dd')
					let endStr = format(state.queryParams.endStr, 'yyyy-MM-dd')
					result =[{ beginStr, endStr, list: [], dateType: 1}]
				}
			}
			return result
		}
	},
	mutations: {
		RESET_QUERYPARAMS(state) {
			state.queryParams = {
				type: null,
				srcType: null,
				date: null,
				beginDate: null,
				endDate: null,
				pageNum: 1,
				pageSize: 10
			}
		},
		SET_TYPE(state, data) {
			state.queryParams.type = data
		},
		SET_SRCTYPE(state, data) {
			state.queryParams.srcType = data
		},
		SET_DATE(state, data) {
			state.queryParams.date = data ? format(data, "yyyy-MM") : null
		},
		SET_BEGINDATE(state, data) {
			state.queryParams.beginDate = data ? format(data, "yyyy-MM-dd") : null
		},
		SET_ENDDATE(state, data) {
			state.queryParams.endDate = data ? format(data, "yyyy-MM-dd") : null
		},
		SET_PAGENUM(state, data) {
			state.queryParams.pageNum = data
		},
		SET_BILLS(state, data) {
			state.bills = data
		},
	},
	actions: {
		queryBill({ commit, state }) {
			return new Promise((resolve, reject) => {
				request.post("/account/bill/list", state.queryParams).then(data => {
					commit('SET_BILLS', state.bills.concat(data.info))
					commit('SET_PAGENUM', data.page + 1)
					resolve(data)
				}).catch(error => {
					reject(error)
				})
			})
		}

	}
}