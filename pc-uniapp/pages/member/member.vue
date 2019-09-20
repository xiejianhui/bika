<template>
	<view class="member-box">
		<!-- #ifdef APP-PLUS -->
		<view class="my_top relative">
		<!-- #endif -->
		<!-- #ifndef APP-PLUS -->
		<view class="my_top relative" style="height: 280upx">
		<!-- #endif -->
			<view class="info">
				<view class="" style="position: relative">
					<view style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;z-index: 10" v-if="!memberInfo.id" @click="askToLogion"></view>
					<navigator url="person-info/person-info">
						<view class="head">
							<image :src="memberInfo.logo" v-if="memberInfo.logo" mode="widthFix" class="w100"></image>
							<image src="/static/img/logoGsp.png" v-else mode="widthFix" class="w100"></image>
						</view>
					</navigator>
				</view>
				<view class="mid">
					<view class="white" v-if="memberInfo.id">
						<view class="fs34 fw500 flex-align">
							{{ memberInfo.userName||memberInfo.mobilePhone}}
						</view>
						<view class="fs30 flex-align">
							账号：212
						</view>
						<view class="fs30 betweenBox flex-align">
							<view>
								福分：900
							</view>
							<view>
								余额：100
							</view>
						</view>
					</view>
					<navigator url="/pages/login/login" v-else>
						<view class="white">登录/注册</view>
					</navigator>
				</view>
				<view class="code fw500 fs24 flex-box" @tap="showBox">
					切换语言
				</view>
			</view>
			<!-- #ifdef APP-PLUS -->
			<view class="score flex">
				<view class="">
					<view class="">
						个人业绩
					</view>
					<view class="bigTitle">
						{{ memberInfo.monthlyPerformance || 0 }}
					</view>
				</view>
				<view class="">
					<view class="">
						团队业绩
					</view>
					<view class="bigTitle">
						{{ memberInfo.teamPerformance || 0 }}
					</view>
				</view>
			</view>
			<!-- #endif -->

		</view>
		<!-- 我的订单 -->
		<view style="position: relative">
			<view style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;z-index: 10" v-if="!memberInfo.id" @click="askToLogion"></view>
			<navigator url="../order/order-list?orderType=0">
				<view class="my-order background-white mgt20 pd20 ">
					<view class="bigTitle">我的订单</view>
					<view class="gray fs24 flex-box">
						全部订单
						<uni-icon type="arrowright" size="16"></uni-icon>
					</view>
				</view>
			</navigator>
		</view>
		<!-- 订单 -->
		<view class="order-types background-white" style="position: relative">
			<view style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;z-index: 10" v-if="!memberInfo.id" @click="askToLogion"></view>
			<view class="" @tap="navToOrderList(1)">
				<image src="../../static/img/myself_order_icon_payment@2x.png" mode="widthFix" class="w100"></image>
				<view class="title-black">待付款</view>
			</view>
			<view class="" @tap="navToOrderList(2)">
				<image src="../../static/img/myself_order_icon_delivery@2x.png" mode="widthFix" class="w100"></image>
				<view class="title-black">待发货</view>
			</view>
			<view class="" @tap="navToOrderList(3)">
				<image src="../../static/img/myself_order_icon_take_over@2x.png" mode="widthFix" class="w100"></image>
				<view class="title-black">待收货</view>
			</view>
			<view class="" @tap="navToOrderList(4)">
				<image src="../../static/img/myself_order_icon_refund@2x.png" mode="widthFix" class="w100"></image>
				<view class="title-black">退换货</view>
			</view>
		</view>

		<view class="my-order  pd20 mgt20"><view class=" bigTitle">我的收益</view></view>
		<view class="mg20 benifit" style="position: relative">
			<view style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;z-index: 10"  v-if="!memberInfo.id" @click="askToLogion"></view>
			<view class="up bdb">
				<view class="gray">我的余额</view>
				<view class="betweenBox">
					<text class="bigTitle">{{ memberInfo.userMoney || 0 }}</text>
					<navigator url="account/balance"><view class="btn flex-box white">去提现</view></navigator>
				</view>
			</view>
			<view class="down">
				<navigator url="coupons/coupons">
					<view class="">
						<view class="gray mgb20">批发券</view>
						<view class="fs30">{{ memberInfo.frozenMoney || 0 }}</view>
					</view>
				</navigator>
				<view class="">
					<view class="gray mgb20">积分</view>
					<view class="fs30">{{ memberInfo.points || 0 }}</view>
				</view>
				<navigator url="my-score/my-score">
					<view class="">
						<view class="gray mgb20">优惠券</view>
						<view class="fs30">{{ memberInfo.distributMoney || '0' }}</view>
					</view>
				</navigator>
			</view>
		</view>
		<view class="my-order  pd20 "><view class=" bigTitle">更多功能</view></view>
		<view class="order-types" style="position: relative">
			<view style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;z-index: 19"  v-if="!memberInfo.id" @click="askToLogion"></view>
			<view class="" @tap="goConsign(0)">
				<view class="white "><image src="../../static/img/myself_list_icon_con_goods@2x.png" mode="widthFix" class="fens-icon"></image></view>
				<view class="fs26 mgt10">寄售商品</view>
			</view>
			<view class="" @tap="goConsign(1)">
				<view class="white "><image src="../../static/img/myself_list_icon_pick_up@2x.png" mode="widthFix" class="fens-icon"></image></view>
				<view class="fs26 mgt10">提货办理</view>
			</view>
			<view class="">
				<navigator url="shareCode/shareCode">
					<view class="white "><image src="../../static/img/myself_list_icon_share_code@2x.png" mode="widthFix" class="fens-icon"></image></view>
					<view class="fs26 mgt10">我的分享码</view>
				</navigator>
			</view>
			<!-- #ifdef APP-PLUS -->
			<view class="">
				<navigator url="my-fans/my-fans">
					<view class="white "><image src="../../static/img/myself_list_icon_fans@2x.png" mode="widthFix" class="fens-icon2"></image></view>
					<view class="fs26 mgt10">我的粉丝</view>
				</navigator>
			</view>
			<!-- #endif -->

			<view class="">
				<navigator url="./psw-setting/psw-setting">
					<image src="../../static/img/myself_list_icon_password@2x.png" mode="widthFix" class="w100"></image>
					<view class="mgt10">密码设置</view>
				</navigator>
			</view>
			<view class="">
				<navigator url="person-info/person-info">
					<image src="../../static/img/myself_list_icon_info@2x.png" mode="widthFix" class="w100"></image>
					<view class="mgt10">个人信息</view>
				</navigator>
			</view>
			<view class="">
				<navigator url="../addressManage/addressManage">
					<image src="../../static/img/myself_list_icon_address@2x.png" mode="widthFix" class="w100"></image>
					<view class="mgt10">地址管理</view>
				</navigator>
			</view>
			<view class="last-bank">
				<navigator url="bank/bank">
					<image src="../../static/img/myself_list_icon_account@2x.png" mode="widthFix" class="w100"></image>
					<view class="mgt10">银行卡管理</view>
				</navigator>
			</view>
		</view>

		<view class="logout-btn fs30 " @click="logout" v-if="memberInfo.id">退出登录</view>
		<view class="pdb20"></view>
		<view class="pdb20"></view>
		
		<view v-if='!hideBox' class='box'>
			<view class='box-bg'></view>
			<view class='box-main'>
				<view v-for="(item,index) in languages" 
					:key="item.id" 
					class="box-item fs30" 
					:data-idx="index" 
					@click="changeLanuage">
					 {{languages[index]}}
				</view>
			</view>
		</view>

	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
	data() {
		return {
			hideBox:true,
			languages: ['中文', '英文','马来西亚语'],
			member: null
		};
	},
	computed: mapState({
		memberInfo: (state) => state.memberInfo || {},
		// 多语言
		i18n () {
			return this.$t('member')  
		}  
	}),
	onPullDownRefresh() {
		if (this.memberInfo.id) {
			this.$store.dispatch('getMemberInfo')
			setTimeout( ()=>{
				uni.stopPullDownRefresh();
			}, 1000);
		}
	},
	onLoad() {},
	onShow() {
		if (this.memberInfo.id) {
			this.isFromLogin();
		}
	},
	methods: {
		showBox() {
			this.hideBox = !this.hideBox
		},
		// 自定义多语言
		changeLanuage(e) {
			this.hideBox = !this.hideBox
			uni.showToast({
				title: this.$t('member.loading'),
				icon: 'loading',
				duration: 1000
			})
			let index = e.target.dataset.idx;
			if(index == '0') {
				uni.hideToast()
				// 切换语言需要定时器
				setTimeout(() => {  
					this.$i18n.locale = 'zh-CN'  
					// tabbar多语言
					let tabBarLang = [
					    '首页',
					    '分类',
						'购物车',
					    '我的'
					];
					tabBarLang.forEach((element, index) => {
						uni.setTabBarItem({
							'index': index,
							'text': element
						})
					})
					// 导航栏
					uni.setNavigationBarTitle({
						title:this.$t('tabs.my')
					});
				},100)  
			}else if(index == '1'){
				uni.hideToast()
				setTimeout(() => {
					this.$i18n.locale = 'en-US'
					// tabbar多语言
					let tabBarLang = [
					    'Home',
					    'Product',
						'Cart',
					    'My'
					];
					tabBarLang.forEach((element, index) => {
						uni.setTabBarItem({
							'index': index,
							'text': element
						})
					})
					uni.setNavigationBarTitle({
						title:this.$t('tabs.my')
					});
				},100)
			}else{
				uni.hideToast()
				setTimeout(() => {
					this.$i18n.locale = 'en-US'
					// tabbar多语言
					let tabBarLang = [
					    'Home',
					    'Product',
						'Cart',
					    'My'
					];
					tabBarLang.forEach((element, index) => {
						uni.setTabBarItem({
							'index': index,
							'text': element
						})
					})
					uni.setNavigationBarTitle({
						title:this.$t('tabs.my')
					});
				},100)
			}
		},
		
		// goShareCode(){
		// 	uni.navigateTo({
		// 		url:'shareCode/shareCode'
		// 	})
		// },
		isFromLogin() {
			uni.getStorage({
				key: 'pagefrom',
				success: () => {
					uni.removeStorage({
						key: 'pagefrom'
					});
					uni.switchTab({
						url: '/pages/index/index'
					});
				},
				fail: () => {
					this.initMember();
				}
			});
		},
		initMember() {
			uni.getStorage({
				key: 'member',
				success: res => {
					this.member = res.data;
					this.$store.commit('saveMember', res.data);
					setTimeout(() => {
						this.$store.dispatch('getMemberInfo');
					}, 1000);
				},
				fail() {
					uni.navigateTo({
						url: '/pages/login/login'
					});
				}
			});
		},
		goConsign(index) {
			if (index) {
				uni.navigateTo({
					url: '../order/wholesale-list/wholesale-list?notConsignment=0',
					animationType: 'pop-in',
					animationDuration: 200
				});
			} else {
				uni.navigateTo({
					url: '../order/consignment-list/consignment-list?notConsignment=0',
					animationType: 'pop-in',
					animationDuration: 200
				});
			}
		},
		navToOrderList(index) {
			uni.navigateTo({
				url: '../order/order-list?orderType=' + index,
				animationType: 'pop-in',
				animationDuration: 200
			});
		},
		logout() {
			uni.showModal({
				title: '提示',
				content: '您将退出此次登录，是否确定？',
				success:  (res)=>{
					if (res.confirm) {
						this.$store.commit('logOut');
						uni.navigateTo({
							url: '../login/login'
						});
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});

		},
		askToLogion () {
			uni.showModal({
				title: '提示',
				content: '请先登录后再查看',
				success:  (res)=>{
					if (res.confirm) {
						uni.navigateTo({
							url: '../login/login'
						});
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		},
	}
};
</script>

<style lang="less" scoped>
	/* 切换语言弹框 */
	.box{
	    position: fixed;
	    top: 0;
	    left: 0;
	    width: 100%;
	    height: 100%;
	    display: flex;
	    justify-content: center;
	    align-items: center;
		/* #ifdef H5 */
		bottom: var(--window-bottom);
		/* #endif */
	}
	.box-bg{
	    position: absolute;
	    top: 0;
	    left: 0;
	    width: 100%;
	    height: 100%;
	    background-color: rgba(0, 0, 0, .6);
	}
	.box .box-main{
	    position: absolute;
	    bottom: 0;
	    left: 0;
	    display: block;
	    width: 100%;
	    z-index: 9;
		/* #ifdef H5 */
		bottom: var(--window-bottom);
		/* #endif */
	}
	.box-main .box-item{
	    width: 100%;
	    height: 90rpx;
	    font-size: 30rpx;
	    background:rgba(201,57,29,1);
	    display: flex;
	    justify-content: center;
	    align-items: center;
		color: #FFFFFF;
	}
	.box-main .box-item:first-child{
		background:#f37229;
	}
	.box-main .box-item:nth-child(2){
		background:rgba(201,57,29,1);
		// opacity: 0.76;
	}
	.box-main .box-item:last-child{
	    background:#fe6a70;
	}
	.box-main view button{
	    width: 100%;
	    height: 100%;
	    font-size: 28rpx;
	    background-color: transparent;
	    display: flex;
	    justify-content: center;
	    align-items: center;
	}
	.box-main view button::after{
	    border: none;
	}
	
	
	.member-box{
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
	.my_top{
		padding: 30upx;
		height:280upx;
		box-sizing: border-box;
		background:linear-gradient(131deg,rgba(250,148,97,1) 0%,rgba(252,78,41,1) 100%);
		position: relative;
		.score{
			position: absolute;
			bottom: 0;
			left: 30upx;
			width:690upx;
			transform: translateY(50%);
			background: white;
			box-shadow:0px 21px 19px 0px rgba(234,234,234,0.5);
			border-radius:10upx;
			>view{
				flex: 1;
				text-align: center;
				font-size:42upx;
				color:rgba(51,51,51,1);
				line-height:28upx;
				>view{
					padding: 20upx 0;
				}
				:first-child{
					color: #656565;
					font-size: 24upx

				}
			}
		}
		.info{
			display: flex;
			align-items: center;
			position: relative;
			.head{
				width: 140upx;
				height: 140upx;
				border-radius: 50%;
				overflow: hidden;
				margin-right: 33upx;
				image{
					width: 100%;
					height: 100%!important;
					border-radius: 50%;
				}
			}
			.mid{
				padding-top: 3upx;
				.fs34{
					height: 34upx;
					margin-bottom: 32upx;
				}
				.fs30{
					height: 32upx;
					margin-bottom: 18upx;
				}
			}
			.code{
				position: absolute;
				right: 0upx;
				top: 0;
				padding: 0 24upx;
				height:47upx;
				border:2upx solid rgba(255,194,193,1);
				border-radius:24upx;
				color:rgba(255,255,255,1);
			}
		}
	}
.benifit {
	background: rgba(244, 244, 244, 1);
	border-radius: 10upx;
	.up {
		padding: 30upx 40upx;
		.btn {
			width: 160upx;
			height: 60upx;
			background: rgba(252, 78, 41, 1);
			border-radius: 40px;
		}
	}
	.down {
		display: flex;
		justify-content: space-around;
		padding: 30upx 40upx;
	}
}
.bigTitle {
	color: rgba(51, 51, 51, 1);
	font-size: 40upx;
	font-weight: 600;
}
.redPoint {
	position: absolute;
	left: 720upx;
	top: 14upx;
	width: 12upx;
	height: 12upx;
	background: #f62626;
	border-radius: 50%;
}
.logout-btn {
	width: 600upx;
	height: 80upx;
	margin: 60upx auto;
	background: #FC4E29;
	border-radius: 10upx;
	text-align: center;
	line-height: 80upx;
	color: white;
}

.mg-part {
	display: flex;
	justify-content: space-around;
	padding: 30upx 0;

	> view {
		width: 140upx;
		text-align: center;

		.mg-circle {
			width: 100upx;
			height: 100upx;
			display: inline-block;
			background-image: linear-gradient(180deg, #53b1fa 0%, #388ceb 100%);
			font-size: 50upx;
			text-align: center;
			line-height: 100upx;
			border-radius: 50%;
			margin-bottom: 20upx;
		}

		.mg-circle-car {
			background-image: linear-gradient(180deg, #ffb75a 0%, #e78e00 100%);
			display: flex;

			image {
				width: 60upx;
			}
		}

		.fens-icon {
			width: 70upx;
		}

		.fens-icon2 {
			width: 90upx;
			height: auto;
		}
	}
}

.bl-juan {
	display: flex;
	padding: 20upx;

	> view {
		width: 330upx;
		display: flex;
		justify-content: space-between;
		align-items: center;

		image {
			width: 40upx;
			margin-right: 10upx;
		}
	}
}

.my-order {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.order-types {
	display: flex;
	justify-content: flex-start;

	flex-wrap: wrap;
	> view {
		width: 170upx;
		text-align: center;
		margin-left: 12upx;
		margin-block-start: 20upx;
		image {
			width: 90upx;
		}
	}
}

.top {
	background-image: url('~@/static/img/my-bg.png');
	background-size: 100% auto;
	background-repeat: no-repeat;

	.messageIcon {
		width: 40upx;
		margin: 20upx;
	}

	.content {
		width: 650upx;
		background-color: #ffffff;
		border-radius: 15px;
		margin: 60upx auto 20upx auto;
		position: relative;
		padding-bottom: 30upx;

		.head {
			position: absolute;
			left: 50%;
			top: 0;
			transform: translate(-50%, -50%);
			width: 150upx;
			height: 150upx;
			border-radius: 50%;
			overflow: hidden;
		}

		.mb-name {
			padding-top: 90upx;
			display: flex;
			align-items: center;
			justify-content: center;

			.tag {
				padding: 2upx 10upx;
				background-image: linear-gradient(90deg, #53b1fa 0%, #388ceb 100%);
				border-radius: 16px;
				color: white;
				margin-left: 10upx;
			}
		}

		.score {
			display: flex;

			> view {
				flex: 1;
				text-align: center;
				height: 30upx;
				margin-top: 20upx;
				padding: 0 10upx;
				&:nth-child(1) {
					border-right: 1upx solid #53b1fa;
				}

				text {
					&:nth-child(2) {
						// margin-left: 60upx;
					}
				}
			}
		}
	}
}
</style>
