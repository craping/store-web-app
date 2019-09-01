<!--
 账单
 -->
<template>
    <div class="bill-page">
        <van-nav-bar class="nav" title="账单" left-arrow @click-left="onClickLeft" fixed/>
        <div class="content">
            <van-sticky :offset-top="46" :z-index="101">
                <div class="top-bar-wrapper">
                    <div id="filter-node" class="top-bar van-hairline--bottom" @click="show = !show">
                        <span :class="{'exp':show}">
                            筛选
                            <van-icon v-show="!show" name="arrow-down" />
                            <van-icon v-show="show" name="arrow-up" />
                        </span>
                    </div>
                    <div>
                        <div class="option-pop" v-show="show">
                            <div class="item">
                                <div class="title">收支类型</div>
                                <div class="option-wrapper">
                                    <div class="option-item" :class="{'active':currentTypeIndex == index}" v-for="(item,index) in typekList" :key="index" @click="selectType(index)">{{item.name}}</div>
                                </div>
                            </div>
                            <div class="item">
                                <div class="title">快捷筛选</div>
                                <div class="option-wrapper">
                                    <div class="option-item" :class="{'active':currentQuickIndex == index}" v-for="(item,index) in quickList" :key="index" @click="selectQuik(index)">{{item.name}}</div>
                                </div>
                            </div>
                            <div class="bottom-btn">
                                <div class="btn reset" @click="reset">重置</div>
                                <div class="btn" @click="show=false">确定</div>
                            </div>
                        </div>
                        <van-overlay
                            :show="show"
                            @click="show = false"
                            z-index="10"
                        />
                    </div>
                </div>
            </van-sticky>
            <div class="month-item" ref="mo1" >
                <van-sticky :offset-top="76" :container="container1">
                    <div class="info-bar">
                        <div class="time" @click="dateSelectshow = true">
                            2019年8月
                            <van-icon name="arrow-down" />
                        </div>
                        <div class="all-money">
                            <div>收入：￥111</div>
                            <div>支出：￥222</div>
                        </div>
                    </div>
                </van-sticky>
                <div class="bill-list" >
                    <div class="bill-item" @click="jumpLink('/billDetail')" v-for="i in 4">
                        <div class="col-1">
                            <van-icon name="cart" size="35" color="#fcc"/>
                        </div>
                        <div class="col-2">
                            <div class="title">购买商品名购买商品名称是多少来得及称是多少来得及</div>
                            <div class="type">订单交易</div>
                            <div class="time">2019-07-23 12:13</div>
                        </div>
                        <div class="col-3">
                            +15.00
                        </div>
                    </div>
                </div>
            </div>
            <div class="month-item" ref="mo2" >
                <van-sticky :offset-top="76" :container="container2">
                    <div class="info-bar">
                        <div class="time" @click="dateSelectshow = true">
                            2019年9月
                            <van-icon name="arrow-down" />
                        </div>
                        <div class="all-money">
                            <div>收入：￥111</div>
                            <div>支出：￥222</div>
                        </div>
                    </div>
                </van-sticky>
                <div class="bill-list" >
                    <div class="bill-item" v-for="i in 10">
                        <div class="col-1">
                            <van-icon name="cart" size="35" color="#fcc"/>
                        </div>
                        <div class="col-2">
                            <div class="title">购买商品名购买商品名称是多少来得及称是多少来得及</div>
                            <div class="type">订单交易</div>
                            <div class="time">2019-07-23 12:13</div>
                        </div>
                        <div class="col-3">
                            +15.00
                        </div>
                    </div>
                </div>
            </div>
            <van-popup
            v-model="dateSelectshow"
            position="bottom"
            :style="{ height: '40%' }">
            <div class="tool-bar">
                <div class="cancel">取消</div>
                <div class="sure">确定</div>
            </div>
            <van-tabs v-model="active" color="#ff4444">
                
                <van-tab title="按月选择">
                    <van-datetime-picker
                    v-model="currentDate"
                    type="year-month"
                    :show-toolbar="false"
                    @confirm="selectDate"
                    @cancel="dateSelectshow=false"
                    /> 
                </van-tab>
                <van-tab title="按日选择">
                    <van-datetime-picker
                    v-model="currentDate"
                    type="date"
                    :show-toolbar="false"
                    @confirm="selectDate"
                    @cancel="dateSelectshow=false"
                    /> 
                </van-tab>
            </van-tabs>
            </van-popup>
        </div>
    </div>
</template>
<script>
import Vue from 'vue';
import { NavBar, Overlay, Sticky, ActionSheet, Popup, DatetimePicker,Icon, Tab, Tabs } from 'vant';
Vue.use(Tab).use(Tabs).use(Overlay).use(Sticky).use(ActionSheet).use(Popup).use(DatetimePicker).use(NavBar).use(Icon);
Vue.use(Sticky);
Vue.use(Overlay);
export default {
    data() {
        return {
            container1: null,
            container2: null,
            show: false,
            dateSelectshow:false,
            typekList:[
                {
                    name: '全部分类',
                    id: -1
                },
                {
                    name:'收入'
                },
                {
                    name:'支出'
                }
            ],
            quickList:[
                {
                    name:'全部分类'
                },
                {
                    name:'订单交易'
                },
                {
                    name:'分销佣金'
                },
                {
                    name:'直推佣金'
                },
                {
                    name:'提现申请'
                }
            ],
            currentTypeIndex : 0,
            currentQuickIndex : 0,
            minVal : '',
            maxVal : '',
            currentDate:new Date()
        }
    },
    mounted() {
         this.container1 = this.$refs.mo1;
         this.container2 = this.$refs.mo2;
    },
    methods:{
        onClickLeft() {
            this.$router.go(-1)
        },   
        jumpLink(path) {
            this.$router.push(path)
        },
        selectType(index) {
            this.currentTypeIndex = index
        },
        selectQuik(index) {
            this.currentQuickIndex = index
        },
        selectDate(date) {
             this.dateSelectshow = false;
        },
        reset() {
            this.currentTypeIndex = 0
            this.currentQuickIndex = 0
        }
    }
}
</script>
<style lang="scss" scoped>
    .bill-page{
        >>>.nav{
            z-index: 1000 !important;
        }
        .content{
            padding-top: 46px;
            .top-bar-wrapper{
                position: relative;
            }
            .top-bar{
                height: 30px;
                background: #FFF;
                line-height: 30px;
                color: #999;
                padding: 0 15px;
                position: relative;
                z-index: 20;
                .exp{
                    color: $red;
                }
            }
            .option-pop{
                height: 300px;
                padding: 0 15px;
                background: #FFF;
                overflow: hidden;
                position: relative;
                z-index: 20;
                .title{
                    font-size: 14px;
                    margin: 20px 0;
                }
                .option-wrapper{
                    display: flex;
                    flex-wrap: wrap;
                }
                .option-item{
                    background: #EEE;
                    border-radius: 2px;
                    font-size: 12px;
                    padding: 8px 0;
                    width: 22%;
                    text-align: center;
                    margin-right: 10px;
                    margin-bottom: 10px;
                    &.active{
                        background: #FFEEEE;
                        color: $red;
                    }
                }
             
                .bottom-btn{
                    position: absolute;
                    width: 100%;
                    height: 40px;
                    bottom: 0;
                    left: 0;
                    display: flex;
                    .btn{
                        width: 50%;
                        line-height: 40px;
                        text-align: center;
                        font-size: 14px;
                        color: #FFF;
                        background: $red;
                        &.reset{
                            color: $red;
                            background: #FFEEEE;
                        }
                    }
                }
            }
        }
        .tool-bar{
            padding: 5px 15px;
            display: flex;
            justify-content: space-between;
            >div{
                font-size: 14px;
            }
            .sure{
                color: $red;
            }
        }
        .month-item{
            .info-bar{
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 15px;
                background: #f2f2f2;
            }
            .all-money{
                color: #999;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                text-align: right;
            }
            .bill-list{
                padding: 0 15px;
                background: #FFF;
                .bill-item{
                    padding: 10px 0;
                    display: flex;
                    align-items: center;
                    .col-1{
                        width: 15%;
                    }
                    .col-2{
                        width: 55%;
                        .title{
                            font-size: 14px;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                        }
                        .type{
                            margin: 6px 0;
                        }
                        .time{
                            font-size: 10px;
                            color: #999;
                        }
                    }
                    .col-3{
                        width: 30%;
                        font-size: 20px;
                        text-align: right;
                    }
                }
            }
        }
    }
</style>