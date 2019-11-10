import { format } from '@/utils/util'
import Big from 'big.js'
import store from '@/store';

const Service = {
	init(userinfo, goods, groupid, callback) {
		// (function (w, d, n, a, j) {
		//     w[n] = w[n] || function () {
		//         (w[n].a = w[n].a || []).push(arguments);
		//     };
		//     j = d.createElement('script');
		//     j.async = true;
		//     j.src = 'https://qiyukf.com/script/c34c10a29524dd342c2702ae9768ceb4.js?hidden=1';
		//     d.body.appendChild(j);
		// })(window, document, 'ysf');


		const { amsAccount, umsMember } = userinfo;
		const sex = ["未知", "先生", "女士"];
		ysf('config', {
			uid: umsMember.id.toString(),
			name: umsMember.nickname,
			mobile: umsMember.phone,
			groupid: groupid, // 客服组ID
			data: JSON.stringify([
				{ "key": "mobile_phone", "hidden": true },
				{ "index": 0, "key": "account", "label": "账号", "value": umsMember.phone },
				{ "index": 1, "key": "sex", "label": "性别", "value": sex[umsMember.gender] },
				{ "index": 5, "key": "reg_date", "label": "注册日期", "value": format(umsMember.createTime, "yyyy-MM-dd") }
			]),
			level: amsAccount.id,
			success: () => {
				console.log("客服系统用户信息配置成功")
				ysf('product', {
					show: 1,
					title: goods.title,
					desc: goods.subTitle,
					picture: goods.pic,
					note: "￥" + new Big(goods.price).toFixed(2),
					url: process.env.VUE_APP_SHARE + goods.id,
					sendByUser: 1,
					success: () => {
						console.log("商品信息设置成功")
						typeof callback === 'function' ? callback() : null
					}
				});
			},
			error: () => {
				console.log("客服系统用户信息配置失败")
			}
		});

		ysf('onunread', (data) => {
			console.log(data);
			store.commit("sys/SET_UNREAD", data.total ? data.total : "");
		});
	},
	// product(goods) {
	// 	ysf('product', {
	// 		show: 1,
	// 		title: goods.title,
	// 		desc: goods.subTitle,
	// 		picture: goods.pic,
	// 		note: "￥" + new Big(goods.price).toFixed(2),
	// 		url: process.env.VUE_APP_SHARE + goods.id,
	// 		sendByUser: 1
	// 	});
	// }
}

export default Service