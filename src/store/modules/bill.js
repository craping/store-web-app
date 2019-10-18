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
		billByMonth: state => {
			let monthObj = {}
			let result = []
			state.bills.forEach(element => {
				let monthKey = format(element.createTime, 'yyyy年MM月')
				if (monthObj.hasOwnProperty(monthKey)) {
					this.monthObj[monthKey].push(element)
				} else {
					this.monthObj[monthKey] = []
				}
			});
			Object.keys(monthObj).forEach((key) => {
				result.push({ monthStr: key, list: monthObj[key] })
			});
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
		queryBill({ commit, state }) {
			return new Promise((resolve, reject) => {
				request.post("/account/bill/list", state.queryParams).then(data => {
					commit('SET_BILLS', data.info)
					commit('SET_PAGENUM', data.page + 1)
					resolve(data)
				}).catch(error => {
					reject(error)
				})
			})
		}

	}
}