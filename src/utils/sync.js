import axios from 'axios'
import store from '@/store';
import request from '@/utils/request'
import router from '@/router'

const Sync = {
    source: null,
    isDisconnect:true,
    connect(){
        this.isDisconnect = false;
        this.sync();
    },
    sync() {
        if(this.isDisconnect)
            return;
        const CancelToken = axios.CancelToken;
        this.source = CancelToken.source();

        request
        .post("api/sync", {}, {
            cancelToken: this.source.token,
            timeout: 35000,
            params: {
                format: "sync"
            }
        })
        .then(events => {
            events.forEach(msg => {
                console.log(msg);
                const data = msg.data;
                try {
                    this.invokes[msg.biz][msg.action](data);
                } catch (e) {
                    console.error(e);
                }
            });
        })
        .catch(err => {
            console.log(err)
        })
        .finally(() => {
            this.sync();
        });
    },
    disconnect(){
        this.isDisconnect = true;
        this.cancel();
    },
    cancel(){
        if(this.source)
            this.source.cancel();
    },
    invokes:{
        SYS:{
            //后台修改配置通知
            CONFIG(data){
                // store.dispatch("sys/getSysConfig").then(data => {
                //     console.log(data.info)
                // });
                store.commit("sys/SET_CONFIG_SINGLE", data);
            }
        },
        USER:{
            UPDATE(){
                store.dispatch("user/getUserInfo").then(data => {
                    console.log(data.info)
                });
            }
        },
        MESSAGE:{
            
        },
        ORDER:{
            PAY(data){
                const msg = '订单['+ data +']已支付';
				// 支付成功跳转
				localStorage.orderActive = 2
                router.push('/order')
            }
        }
    }
}

export default Sync