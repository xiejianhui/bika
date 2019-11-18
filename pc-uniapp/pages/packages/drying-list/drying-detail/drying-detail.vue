<template>
	<view class="pageBgW fw500">
		<view class="od-list background-white">
			<view class="item-info">
				<view class="member-info relative flex-align fs28 bdbe">
					<view class="member-img mgr30">
						<image src="/static/img/29.png" mode="widthFix"></image>
					</view>
					<view class="right">
						<view class="name title-black fs30 mgb10">fgsdg sdfgsd</view>
						<view class="gray mgb10">幸运号码：<text class="orange">27272</text></view>
						<view class="gray mgb10">本次享购：<text class="orange">46464</text>人次</view>
						<view class="gray">揭晓时间：<text class="color6">2019-9-9 09:00:00</text></view>
					</view>
					<view class="jf flex-box">
						<image class="right-img" src="/static/img/moudel/jianglifufenx.png" mode="widthFix"></image>
					</view>
					<view class="jf flex-box">
						<view>
							<view class="orange fs24 flex-box">奖励福分</view>
							<view class="orange fs28 flex-box">200</view>
						</view>
					</view>
				</view>
				<view class="comment fs30">
					<view class="title-black fw500 mgb20 fs30">Leacim Dhhupo</view>
					<view class="gray fs24">2018-02-05 19:02</view>
					<view class="comment-txt fw400">很满意哦，送了好多赠品，不错。不知质量如何，用过之后再来评价</view>
					<view class="flex">
						<view class="comment-img">
							<image src="/static/img/logoGsp.png" mode="widthFix"></image>
						</view>
						<view class="comment-img">
							<image src="/static/img/logoGsp.png" mode="widthFix"></image>
						</view>
					</view>
					<view class="fs26 orange flex">
						<view class="thumbs-up flex-box">
							<image src="/static/img/moudel/dianzan-normal.png" mode="widthFix"></image>
							<view class="">(2人羡慕嫉妒)</view>
						</view>
						<view class="thumbs-up flex-box" @tap="showTextarea">
							<image src="/static/img/moudel/pinglun-normal.png" mode="widthFix"></image>
							<view class="">我要评论</view>
						</view>
						<view class="thumbs-up flex-box">
							<image src="/static/img/moudel/fenxiagn-normal.png" mode="widthFix"></image>
							<view class="">分享</view>
						</view>
					</view>
					<view class="" v-if="textarea">
						<textarea class="comment-input" 
						placeholder-style="font-size:24upx;color:rgba(201,201,201,1);" 
						placeholder="填写优质评论，审核通过可获得随机福分"
						v-model="comment_input"></textarea>
						<view class="betweenBox fs26 white">
							<view class="comment-immediately flex-box" @tap="toImmediately">立即评论</view>
							<view class="cancel flex-box orange" @tap="toCancel">取消</view>
						</view>
					</view>
				</view>
				<view class="comment-total bdbe">
					共计<text class="orange">2</text>条评论
				</view>
				<view class="member-info flex-align fs28" v-for="(item, index) in orderList" :key="index" @tap="toDryingDetail(item.id)">
					<view class="member-img mgr30">
						<image src="/static/img/29.png" mode="widthFix"></image>
					</view>
					<view class="right title-item">
						<view class="name title-black fs32 mgb10">{{item.productName}}</view>
						<view class="gray fs28 mgb10">{{item.productName}}</view>
						<view class="gray"><text class="color6 fs26">{{item.createDate}}</text></view>
					</view>
				</view>
				<view class="orange-btn flex-box" @tap="toParticipate">马上参与</view>
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
			orderType: 0,
			orderList: [],
			current: 1,
			pageCount: 10,
			allowRequest:true,
			noMoreData:false,
			showOrder:true,
			showFriends:true,
			friendsList:[{"title":"昵称"},{"title":"参与时间"},{"title":"邀请编码"},{"title":"是否购买"}],
			addflag: false,
			comment_input:'',
			textarea: false,
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
		// e.orderType ? (this.orderType = e.orderType) : '';
		this.getList();
		this.getFriendsList();
	},
	computed: {
		...mapState(['memberInfo', 'systemInfo'])
	},
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
		this.getFriendsList();
	},
	// 分享赚钱
	onShareAppMessage(res) {
		return {
			title: '邀请好友赚钱'
		};
	},
	methods: {
		toParticipate(){
			console.log("toParticipate")
		},
		toDryingDetail(e){
			uni.navigateTo({
				url: '/pages/packages/drying-list/drying-detail/drying-detail?id=' + e
			});
		},
		showTextarea(){
			this.textarea = '';
			this.textarea = !this.textarea;
		},
		toImmediately(){
			
		},
		toCancel(){
			this.textarea = '';
		},
		getFriendsList() {
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
					if(this.friendsList.length > 0){
						this.showFriends = false;
					}else{
						this.showFriends = true;
					}
					if (res.data.status == 1) {
						if(res.data.data.pages==this.current){
							this.noMoreData = true;
						}
						if (res.data.data.pageList.length) {
							let arr = res.data.data.pageList;
							arr.forEach(item => {
								item.appProductOrderList = this.setImgSize(item.appProductOrderList, '200x200');
								item.createDate = this.format(item.createDate);
							});
							this.orderList = (this.orderList||[]).concat(arr);
							if(this.friendsList.length > 0){
								this.showFriends = false;
							}
							this.current += 1;
						}
						console.log("this.orderList",this.orderList)
					}
				});
		},
		
		toName(){
			uni.navigateTo({
				url:'/pages/member/historic-account/historic-account'
			})
		},
		initListDate() {
			this.noMoreData = false;
			this.current = 1;
			this.orderList = [];
			this.friendsList = [];
			this.addflag = false;//切换默认不用防提交
			// setTimeout(()=>this.getList(),200);
			this.getList()
			this.getFriendsList();
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
	.orange-btn{
		width:678upx;
		margin: 68upx auto 66upx;
	}
	.comment-total{
		padding: 47upx 35upx 35upx 23upx;
		border-top: 20upx solid #F5F5F5;
	}
	.comment{
		padding: 60upx 37upx;
		.comment-txt{
			line-height: 40upx;
			color:rgba(51,51,51,1);
			margin: 42upx 0 46upx 0;
		}
		.comment-img{
			width: 320upx;
			height: 320upx;
			image{
				width: 320upx;
				height: 320upx;
			}
		}
		.comment-img:first-child{
			margin-right: 34upx;
		}
		.thumbs-up{
			padding: 17upx 27upx;
			height: 26upx;
			border:2upx solid rgba(254,106,114,1);
			border-radius:30upx;
			image{
				width: 28upx;
				height: 25upx;
				margin-right: 13upx;
			}
		}
		.thumbs-up:nth-child(2){
			margin:  0 20upx 0 24upx;
		}
		.fs26{
			margin: 44upx 0 0upx;
		}
		.comment-input{
			margin-top: 34upx;
			width:677upx;
			min-height:231upx;
			background:rgba(255,255,255,1);
			border:1upx solid rgba(214,214,214,1);
			border-radius:10upx;
			padding: 26upx 21upx;
			box-sizing: border-box;
			color: #333333;
		}
		.comment-immediately{
			width:323upx;
			height:60upx;
			background:rgba(254,106,114,1);
			border-radius:30upx;
		}
		.cancel{
			width:323upx;
			height:60upx;
			border:2upx solid rgba(254,106,114,1);
			border-radius:30upx;
		}
		
	}
	.member-info{
		padding: 37upx 37upx 57upx 41upx;
		.member-img{
			width:138upx;
			height:138upx;
			border-radius:50%;
			image{
				width:138upx;
				height:138upx;
			}
		}
		.jf{
			position: absolute;
			top: 37upx;
			right: 37upx;
			width: 120upx;
			height: 120upx;
			.right-img{
				width: 120upx;
				height: 120upx;
			}
		}
		.mgb10{
			margin-bottom: 10upx;
		}
		.title-item{
			.color6{
				color: #D9D9D9;
			}
		}
	}
.pageBgW{
	font-size: 26upx;
	color: #999999;
}
.account-info{
	height: 114upx;
	background:rgba(249,249,249,1);
	.flex-box{
		height: 24upx;
	}
	.txt{
		height: 28upx;
		margin: 27upx 0 12upx 0;
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
.submit-btn{
	margin-top: 84upx;
	width:678upx;
	height:80upx;
	line-height: 80upx;
	background:rgba(254,106,114,1);
	border-radius:40upx;
	font-size: 32upx;
}
</style>
