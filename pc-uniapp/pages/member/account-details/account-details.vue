<template>
	<view class="pageBgW">
		<view class="account-info betweenBox">
			<view class="fs24">
				邀请好友<text class="fs34 orange">50</text><text class="orange">人</text>
			</view>
			<view class="recharge fs24 colorw background-orange flex-box" @click="toRecharge">
				充值
			</view>
		</view>
		<view class="od-nav  background-white">
			<view class="gray fs28" v-for="(item, index) in navList" :key="index" :class="{ 'primary-color': item.active }" @click="changeList(index)">
				<view class="fw600">{{ item.name }}</view>
				<view class="fs22">总额RM:0</view>
				<!-- <view class="fs22">总额RM:<text>{{tem.total}}</text></view> -->
			</view>
		</view>
		<no-data v-if="showOrder"></no-data>
		<view class="od-list mgt20 background-white">
			<view class="title flex-equal fs28 fw500" v-if="!showOrder">
				<view class="title-item" v-for="(item, index) in titleList" :key="index">
					<view  class="title-item" >{{item.title}}</view>
				</view>
			</view>
			<view class="title-list fs28 fw500" v-for="(item, index) in orderList" :key="index">
				<view class="title-item flex-equal" v-for="(subitem, subindex) in item.appProductOrderList" :key="subindex">
					<view class="title-item">{{subitem.amout}}</view>
					<view class="title-item">{{subitem.amout}}</view>
					<view class="title-item">{{subitem.amout}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import orderCountdown from '@/components/order-countdown.vue';
	import noData from '@/components/no-data';
export default {
	data() {
		return {
			navList: [
				{
					name: '消费明细',
					active: true,
					total:10
				},
				{
					name: '充值明细',
					active: false,
					total:10
				},
				{
					name: '福分明细',
					active: false,
					total:10
				}
			],
			orderType: 0,
			orderList: false,
			current: 1,
			pageCount: 10,
			allowRequest:true,
			noMoreData:false,
			showOrder:true,
			titleList:[{"title":"获取时间"},{"title":"福分"},{"title":"获取渠道"}]
		};
	},
	components: {
		orderCountdown ,
		noData
	},
	onShow() {
		if (!this.memberInfo) uni.redirectTo({url: '/pages/login/login'})
		this.$store.dispatch('getSystemInfo');
	},
	onPullDownRefresh() {
		this.initListDate();
	    setTimeout( ()=>{
			 uni.stopPullDownRefresh();
	    }, 1000);
	},
	onLoad(e) {
		if (!this.memberInfo) uni.redirectTo({url: '/pages/login/login'})
		e.orderType ? (this.orderType = e.orderType) : '';
		this.initNav(this.orderType);
		this.getList();
	},
	computed: mapState(['memberInfo', 'systemInfo']),
	onReachBottom() {
		if(this.noMoreData){
			uni.showToast({
				title:'没有更多数据了',
				icon:'none',
				duration:1500
			});
			return
		}
		this.getList();
	},
	methods: {
		toRecharge(){
			uni.navigateTo({
				url: '/pages/member/recharge-detail/recharge-detail?type=0'
			});
		},
		initNav(index) {
			let arr = this.navList;
			arr.forEach(item => (item.active = false));
			let n = index;
			if (n == 4) {
				arr[n].active = true;
				n = 5;
			} else {
				arr[n].active = true;
			}
			this.orderType = n;
			this.navList = arr;
		},
		initListDate() {
			this.noMoreData = false;
			this.current = 1;
			this.orderList = [];
			// setTimeout(()=>this.getList(),200);
			this.getList()
		},
		getList() {
			let mid = this.memberInfo.id;
			if(!this.allowRequest) return
			this.allowRequest = false;
			uni.showLoading({
				title:'加载中...'
			})
			this.apiUrl
				.getOrderList({
					data: {
						status: this.orderType,
						memberId: mid,
						pageCount: this.pageCount,
						current: this.current
					}
				})
				.then(res => {
					this.allowRequest = true;
					uni.hideLoading();
					if(this.orderList.length > 0){
						this.showOrder = false;
					}else{
						this.showOrder = true;
					}
					if (res.data.status == 1) {
						if(res.data.data.pages==this.current){
							this.noMoreData = true;
						}
						if (res.data.data.pageList.length) {
							let arr = res.data.data.pageList;
							arr.forEach(item => {
								item.appProductOrderList = this.setImgSize(item.appProductOrderList, '200x200');
							});
							this.orderList = (this.orderList||[]).concat(arr);
							if(this.orderList.length > 0){
								this.showOrder = false;
							}
							this.current += 1;
						}
					}
				});
		},
		changeList(index) {
			this.noMoreData = false;
			let arr = this.navList;
			arr.forEach(item => (item.active = false));
			arr[index].active = true;
			this.navList = arr;

			//order type
			let type = index;
			type == 4 ? ++type : '';
			this.orderType = type;
			this.initListDate();
		},
		getOrderDetail(id){
			this.apiUrl
				.getOrderDetail({
					data: {
						orderId: id
					}
				})
				.then(res => {
					console.log(res);
					if (res.data.status == 1) {
						let checkingOrder = res.data.data;
						console.log(checkingOrder);

						if(this.orderList&&this.orderList.length&&checkingOrder){
							let arr = this.orderList;
							for(let i = 0;i<arr.length;i++){
								if(arr[i].id==checkingOrder.id){
									arr[i] = checkingOrder;
									this.orderList.splice(i,1,checkingOrder);
								}
							}
							console.log(arr);
							// this.orderList = arr;
							console.log(this.orderList);
						}
					}
				});
		},
		
	}
};
</script>

<style lang="less">
.pageBgW{
	font-size: 26upx;
	color: #999999;
}
.account-info{
	height: 96upx;
	padding: 0 37upx;
	background:rgba(249,249,249,1);
	.recharge{
		height: 56upx;
		width: 156upx;
		border-radius: 40upx;
	}
}
.od-list{
	.title{
		width:750upx;
		height:85upx;
		line-height: 85upx;
		background:rgba(247,247,247,1);
	}
	.title-list{
		margin: 0 36upx;
		height:76upx;
		line-height: 76upx;
		border-bottom: 1upx solid #E6E6E6;
	}
}
	
	
.goods-list {
	margin: 0 20upx;
	.list-item {
		padding: 20upx 0;
		.list-img {
			height: auto;
		}
	}
}
.op-btns {
	width: 170upx;
	height: 60upx;
	text-align: center;
	line-height: 60upx;
	margin-right: 20upx;
	font-size: 26upx;
	border-radius: 30upx;
	border: 2upx solid #a9a9a9;
}
.od-nav {
	display: flex;
	justify-content: space-around;
	height: 84upx;
	// line-height: 132upx;
	margin: 42upx 0 0upx 0;
	box-sizing: border-box;
	align-items: center;
	.fs22{
		margin-top: 6upx;
	}
	> view {
		height: 100%;
		&.primary-color {
			border-bottom: 4upx solid #FC4E29;
		}
	}
	.gray{
		padding-bottom: 28upx;
		text-align: center;
	}
}
</style>
