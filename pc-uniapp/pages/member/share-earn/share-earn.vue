<template>
	<view class="pageBgW fw500">
		<view class="account-info flex-equal">
			<view class="fs24">
				<view class="flex-box txt">
					<text class="fs34 orange">50</text><text class="orange">人</text>
				</view>
				<view class="flex-box">
					{{i18n.friendsInvite}}
				</view>
			</view>
			<view class="fs24">
				<view class="flex-box txt">
					<text class="fs34 orange">50</text><text class="orange">人</text>
				</view>
				<view class="flex-box">
					{{i18n.balanceCommission}}
				</view>
			</view>
		</view>
		<view class="od-nav bdbe background-white">
			<view class="gray fs28" v-for="(item, index) in navList" :key="index" :class="{ 'primary-color': item.active }" @click="changeList(index)">
				<view class="fw600">{{ item.name }}</view>
			</view>
		</view>
		<view class="od-list background-white">
			<view class="item-info" v-if="current_index == 0">
				<view class="commission-status bdb">
					<view class="commission-total color6 fw600 boxs-b bdbe">
						<view class="item flex-align">
							{{i18n.amountTotal}}<text class="fs36 orange">60</text>{{i18n.dollars}}
						</view>
					</view>
					<view class="commission-audit fs26 boxs-b">
						<view class="item betweenBox">
							<view>
								{{i18n.reviewCommission}}<text class="fs36 orange">30</text>{{i18n.dollars}}
							</view>
							<view>
								{{i18n.cashWithdrawn}}<text class="fs36 orange">30</text>{{i18n.dollars}}
							</view>
						</view>
					</view>
				</view>
				<view class="bank color3">
					<view class="fw600 fs40">{{i18n.bankEnter}}</view>
					<form @submit="toWithdraw">
						<view class="section flex-align">
							<view class="section-title">{{i18n.withdrawalApply}}</view>
							<view><input placeholder-style='color:#DADADA' :placeholder="i18n.withdrawalEnter" type="text" v-model="withdrawalAmount" /></view>
						</view>
						<view class="section flex-align">
							<view class="section-title">{{i18n.holderAccount}}</view>
							<view class="relative">
								<input placeholder-style='color:#DADADA' :placeholder="i18n.holderEnter" type="text" v-model="name" />
								<image @click="toName" class="box-item-icon" src="/static/img/self/share-icon-kaihuren@2x.png"></image>
							</view>
						</view>
						<view class="section flex-align">
							<view class="section-title">{{i18n.AccountBank}}</view>
							<view><input placeholder-style='color:#DADADA' :placeholder="i18n.yourEnter" type="text" v-model="accountNumber" /></view>
						</view>
						<view class="section flex-align">
							<view class="section-title">{{i18n.nameBank}}</view>
							<view><input placeholder-style='color:#DADADA' :placeholder="i18n.enterBank" type="text" v-model="bankName" /></view>
						</view>
						<view class="fs24 orange mgt10">
							{{i18n.ensureOrder}}
						</view>
						<button form-type="submit" :class="btnShow ? 'submit-btn btnShow': 'submit-btn'" :disabled="disabled">{{i18n.withdrawalConfirm}}</button>
						<!-- button按钮改变隐藏域 -->
						<view style="display:none" >{{ exitsVal }}</view>
					</form>
				</view>
			</view>
			<view class="item-info" v-if="current_index == 1">
				<form @submit="toRecharge" class="recharge-content">
					<view class="recharge-box bdbe">
						<view class="fs26">
							{{i18n.rechargeCurrent}}<text class="fs34 orange">30</text><text class="orange">{{i18n.dollars}}</text>
						</view>
						<view class="recharge-num betweenBox">
							<view class="flex-box">
								<view class="fs30 color3">{{i18n.amountRecharge}}</view>
								<input type="number" v-model="recharge_amount" :placeholder="i18n.rechargeEnter" placeholder-style='color:#DADADA' />
							</view>
							<view class="orange">{{i18n.integerIn}}</view>
						</view>
					</view>
					<button form-type="submit" :class="btnShow ? 'submit-btn btnShow': 'submit-btn'" :disabled="disabled">{{i18n.rechargeConfirm}}</button>
					<!-- button按钮改变隐藏域 -->
					<view style="display:none" >{{ exitsVal }}</view>
				</form>
			</view>
			<view class="item-info" v-if="current_index == 2">
				<no-data v-if="!showWithdrawals"></no-data>
				<view class="title flex-equal fs28 fw500" v-if="withdrawalsList.length > 0">
					<view class="title-item" v-for="(item, index) in withdrawalsList" :key="index">
						<view class="title-item" >{{item.title}}</view>
					</view>
				</view>
				<view class="title-list fs28 fw500" v-for="(item, index) in orderList" :key="index">
					<view class="title-item flex-equal" v-for="(subitem, subindex) in item.appProductOrderList" :key="subindex">
						<view class="title-item">{{subitem.amout}}</view>
						<view class="title-item">{{subitem.amout}}</view>
						<view class="title-item">{{subitem.amout}}</view>
						<view class="title-item">{{subitem.amout}}</view>
					</view>
				</view>
			</view>
			<view class="item-info" v-if="current_index == 3">
				<no-data v-if="!showFriends"></no-data>
				<view class="title flex-equal fs28 fw500" v-if="friendsList.length > 0">
					<view class="title-item" v-for="(item, index) in friendsList" :key="index">
						<view  class="title-item" >{{item.title}}</view>
					</view>
				</view>
				<view class="title-list fs28 fw500" v-for="(item, index) in orderList" :key="index">
					<view class="title-item flex-equal" v-for="(subitem, subindex) in item.appProductOrderList" :key="subindex">
						<view class="title-item">{{subitem.amout}}</view>
						<view class="title-item">{{subitem.amout}}</view>
						<view class="title-item">{{subitem.amout}}</view>
						<view class="title-item">{{subitem.amout}}</view>
					</view>
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
					name: this.$t('shareEarn').applicationWithdrawal,
					active: true,
				},
				{
					name: this.$t('shareEarn').topAccount,
					active: false,
				},
				{
					name: this.$t('shareEarn').recordWithdrawals,
					active: false,
				},
				{
					name: this.$t('shareEarn').friendsList,
					active: false,
				}
			],
			orderType: 0,
			orderList: false,
			current: 1,
			pageCount: 10,
			allowRequest:true,
			noMoreData:false,
			showOrder:true,
			showWithdrawals:true,
			showFriends:true,
			withdrawalsList:[{"title":this.$t('shareEarn').applicationTime},{"title":this.$t('shareEarn').methodWithdrawal},{"title":this.$t('shareEarn').amountWithdrawal},{"title":this.$t('shareEarn').statusSemak}],
			friendsList:[{"title":this.$t('shareEarn').nickname},{"title":this.$t('shareEarn').timeParticipation},{"title":this.$t('shareEarn').codeInvitation},{"title":this.$t('shareEarn').buyWhether}],
			current_index:0,
			disabled:true,
			btnShow:false,
			ifExist:0,
			recharge_amount:'',
			addflag: false,
			withdrawalAmount:'',
			accountNumber:'',
			name:'',
			bankName:'',
		};
	},
	components: {
		orderCountdown ,
		noData
	},
	watch:{
		// 监听data中 ifExist的值
		ifExist(newVal,oldVal){
			if(this.current_index == 0){
				if(Number(newVal) === 4){
					this.disabled = false;
					this.btnShow = true;
				 // 4个input框内都有值时需要做的操作
				}else{
					this.disabled = true;
					this.btnShow = false;
				}
			}else{
				if(Number(newVal) === 1){
					this.disabled = false;
					this.btnShow = true;
				 // 1个input框内都有值时需要做的操作
				}else{
					this.disabled = true;
					this.btnShow = false;
				}
			}
		}
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
		
		this.initNav(this.orderType);
		this.getList();
		this.getFriendsList();
		this.getWithdrawalsList();
	},
	computed: {
		...mapState(['memberInfo', 'systemInfo']),
		exitsVal:function(){
			if(this.current_index == 0){
				this.ifExist=Number(Boolean(this.accountNumber))+Number(Boolean(this.withdrawalAmount))+Number(Boolean(this.bankName))+Number(Boolean(this.name))
			}else{
				this.ifExist=Number(Boolean(this.recharge_amount))
			}
		},
		i18n () {
			return this.$t('shareEarn')
		}
	},
	onReachBottom() {
		if(this.noMoreData){
			uni.showToast({
				title:this.i18n.dataNo,
				icon:'none',
				duration:1500
			});
			return
		}
		this.getList();
		this.getFriendsList();
		this.getWithdrawalsList();
	},
	// 分享赚钱
	onShareAppMessage(res) {
		return {
			title: this.i18n.friendsInvite
		};
	},
	methods: {
		getFriendsList() {
			let mid = this.memberInfo.id;
			if(!this.allowRequest) return
			this.allowRequest = false;
			uni.showLoading({
				title:this.$t('tips').loading
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
							});
							this.orderList = (this.orderList||[]).concat(arr);
							if(this.friendsList.length > 0){
								this.showFriends = false;
							}
							this.current += 1;
						}
					}
				});
		},
		getWithdrawalsList() {
			let mid = this.memberInfo.id;
			if(!this.allowRequest) return
			this.allowRequest = false;
			uni.showLoading({
				title:this.$t('tips').loading
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
						this.showWithdrawals = false;
					}else{
						this.showWithdrawals = true;
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
							if(this.friendsList.length > 0){
								this.showWithdrawals = false;
							}
							this.current += 1;
						}
					}
				});
		},
		
		toRecharge(){
			if (this.addflag) return;
			this.addflag = true;
			let oldRecharge_amount = this.recharge_amount;
			uni.showLoading({
				title:this.$t('tips').waitPlease,
				mask:true
			})
			uni.navigateTo({
				url:'/pages/member/recharge-detail/recharge-detail'
			})
			this.apiUrl
				.submitRegister({
					data: this.recharge_amount
				})
				.then(
					res => {
						uni.hideLoading();
						this.addflag = false;
						if (res.data.status == 1) {
							uni.showToast({
								duration: 1500,
								icon: 'none',
								title: this.i18n.successfulRecharge
							});
							uni.navigateTo({
								url:'/pages/member/recharge-detail/recharge-detail'
							})
							return
						} else {
							this.recharge_amount = oldRecharge_amount;
							uni.showToast({
								duration: 1500,
								icon: 'none',
								title: res.data.message
							});
						}
					},
					err => {}
				);
		},
		toWithdraw(){
			if (this.addflag) return;
				this.addflag = true;
				let oldRecharge_amount = this.recharge_amount;
				uni.showLoading({
					title:this.$t('tips').waitPlease,
					mask:true
				})
				let parm = {
					accountNumber:this.accountNumber,
					withdrawalAmount:this.withdrawalAmount,
					bankName:this.bankName,
					name:this.name
				};
				this.apiUrl
					.submitRegister({
						data: parm
					})
					.then(
						res => {
							uni.hideLoading();
							this.addflag = false;
							if (res.data.status == 1) {
								uni.showToast({
									duration: 1500,
									icon: 'none',
									title: this.i18n.successWithdrawal
								});
								// uni.navigateTo({
								// 	url:'/pages/member/recharge-detail/recharge-detail'
								// })
								return
							} else {
								this.accountNumber = parm.accountNumber;
								this.withdrawalAmount = parm.withdrawalAmount;
								this.bankName = parm.bankName;
								this.name = parm.name;
								uni.showToast({
									duration: 1500,
									icon: 'none',
									title: res.data.message
								});
							}
						},
						err => {}
					);
		},
		
		toName(){
			uni.navigateTo({
				url:'/pages/member/historic-account/historic-account'
			})
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
			this.friendsList = [];
			this.withdrawalsList = [];
			this.addflag = false;//切换默认不用防提交
			// setTimeout(()=>this.getList(),200);
			this.getList()
			this.getFriendsList();
			this.getWithdrawalsList();
		},
		getList() {
			let mid = this.memberInfo.id;
			if(!this.allowRequest) return
			this.allowRequest = false;
			uni.showLoading({
				title:this.$t('tips').loading
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
			this.current_index = index; 

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

.commission-status{
	padding: 0 37upx 0 35upx;
	.fs36{
		margin: 0 6upx ;
	}
	.commission-total{
		.item{
			height: 36upx;
			padding: 42upx 0 21upx 0;
		}
		
	}
	.commission-audit{
		.item{
			height: 36upx;
			padding: 39upx 0 53upx 0;
		}
	}
}	

.bank{
	padding: 42upx 38upx 42upx 39upx;
	.fw600{
		margin-bottom: 47upx;
	}
	.section{
		margin-bottom: 36upx;
		.relative{
			image{
				position: absolute;
				top: 3upx;
				right: 9upx;
				height: 45upx;
				width: 45upx;
			}
		}
		.section-title{
			width: 175upx;
			height: 40upx;
			margin-right: 27upx;
			text-align: right;
		}
		input{
			width:471upx;
			height:51upx;
			background:rgba(255,255,255,1);
			border:1upx solid rgba(207,207,207,1);
			border-radius:10upx;
			font-size: 24upx;
			padding: 0 20upx;
			box-sizing: border-box;
		}
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
	height: 110upx;
	line-height: 110upx;
	box-sizing: border-box;
	align-items: center;
	> view {
		height: 100%;
		&.primary-color {
			border-bottom: 4upx solid #FC4E29;
		}
	}
}
.recharge-box{
	box-sizing: border-box;
	padding: 72upx 36upx 25upx 40upx;
	.recharge-num{
		margin-top: 55upx;
		.color3{
			margin-right: 28upx;
		}
	}
	.fs34{
		margin-left: 11upx;
	}
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
.recharge-content{
	.submit-btn{
		margin-top: 105upx;
	}
}
</style>
