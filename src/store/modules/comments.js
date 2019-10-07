import request from '@/utils/request'

export default {
	namespaced: true,
	state: {
		commentList: [],
		commentsTotalnum: 0,
	},
	mutations: {
		SET_COMMENT(state, data) {
			state.commentList = state.commentList.concat(data.info)
			state.commentsTotalnum = data.totalnum
		}
	},
	actions: {
		queryComments({ commit }, data) {
			return new Promise((resolve, reject) => {
				request.post("/product/comments", data).then(data => {
					commit('SET_COMMENT', data)
					resolve(data)
				}).catch(error => {
					reject(error)
				})
			})
		}

	}
}