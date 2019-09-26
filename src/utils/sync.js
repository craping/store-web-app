import axios from 'axios'
import store from '@/store';
import request from '@/utils/request'

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
        USER:{
            SAFE(data){
                console.log("SAFE:"+data)
                store.commit("user/SET_SAFE", data);
            }
        }
    }
}

export default Sync