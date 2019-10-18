import request from '@/utils/request'

export default {
	namespaced: true,
	state: {
		messageList: []
	},
	mutations: {
		SET_MESSAGELIST(state, data) {
			state.messageList = data
		}
	},
	actions: {
		getMessageList({ commit }) {
			return new Promise((resolve, reject) => {
				request.post("/config/getSystemMessages")
				.then(data => {
					const result = data.info || []
					commit('SET_MESSAGELIST', result)
					resolve(data);
				})
				.catch(error => {
					reject(error);
				});
			});
		},
	}
}
