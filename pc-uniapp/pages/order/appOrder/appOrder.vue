<template>
	<view class="pageBg">
		<view class="navigate">
			<button class="fs22"  open-type="launchApp" app-parameter="wechat" binderror="launchAppError">取消支付</button>
		</view>
		<view class="fs24 tac pd20 background-white sumit-money">付款金额</view>
		<view class="primary-color bigFont tac background-white pdb20"><text class="bigFont-txt">￥</text>{{ order.orderAmount || 0 }}</view>
		<view class="mgt40 mgtbtn" v-if="systemInfo">
			<view class="paybtn white flex-box paybtn1" :class="{ unpay: timeEnd || !allowBalance }" @tap="pay" v-if="showCd">
				<text class="mgr20 ">微信支付</text>

				<order-countdown :timer="order.createDate" :currentTime="systemInfo.now" :orderType="order.type" @activeOver="notAllowPay"></order-countdown>
			</view>
			<view class="tac fs24 primary-color" v-if="order.type == 0 || order.type == 6">请在{{ systemInfo.resaleTimeLimit }}分钟内完成付款，否则订单失效。</view>
			<view class="tac fs24 primary-color" v-if="order.type == 1 || order.type == 7">请在{{ systemInfo.wholesaleTimeLimit }}分钟内完成付款，否则订单失效。</view>
			<view class="tac fs24 primary-color" v-if="order.type == 2">请在{{ systemInfo.generalTimeLimit }}分钟内完成付款，否则订单失效。</view>
		</view>
		<uni-popup :show="showYue" @hide="showYue = !showYue" msg="">
			<view class="pbc-wrap">
				<view class="tac pbc-top pdb20">
					请输入支付密码
					<view class="close flex-box" @tap="showYue = !showYue"><uni-icon class="" type="closeempty" size="30"></uni-icon></view>
				</view>
				<view class="primary-color fs36 tac">￥{{ order.orderAmount || 0 }}</view>
				<view class="input_code bdb betweenBox">
					<input type="text" style="flex: 2;" :focus="showYue" :password="!showPassword" v-model="inputCode" class="last" />
					<view class="appen-solt " @tap="showPassword = !showPassword">
						<text class="password-mode flex">{{ showPassword ? '隐藏' : '显示' }}</text>
					</view>
				</view>
				<view class="paybtn white flex-box paybtn2" :class="{ unpay: inputCode.length < 6 }" @tap="payByYue">支付</view>
			</view>
		</uni-popup>
	</view>
</template>
<script>
import orderCountdown from '@/components/order-countdown.vue';
import uniPopup from '@/components/uni-popup.vue';

import { mapState, mapMutations } from 'vuex';
import md5 from '@/common/md5.js'
export default {
	data() {
		return {
			agree: true,
			items: [
				{
					value: '1',
					name: '支付宝支付'
				},
				{
					value: '2',
					name: '微信支付'
				},
				{
					value: '3',
					name: '余额支付'
				}
			],
			current: '',
			order: {
				orderAmount: 0,
				type: 2
			},
			inputCode: '',
			showYue: false,
			allowBalance: true,
			timeEnd: false,
			showPassword: false,
			showCd: false,
		};
	},
	computed: mapState(['memberInfo', 'systemInfo']),
	destroyed() {
		uni.removeStorageSync('payingObj');
	},
	onShow() {

		// #ifdef MP-WEIXIN
		let payWayWx = [
			{
				value: '2',
				name: '微信支付'
			},
			{
				value: '3',
				name: '余额支付'
			}
		];
		this.items = payWayWx;
		this.current = 2;
		// #endif
	},
	created() {},
	onLoad(e) {
		e.agree ? (this.agree = true) : '';
		// app调取小程序支付获取传参
		if( e.orderAmount != undefined){
			let appInfo = {
				orderAmount: e.orderAmount,
				type: e.type,
				createDate:e.createDate,
				id:e.id,
				memberId:e.memberId,
				memberSecret:e.memberSecret
			}
			//正常提交订单
			uni.setStorage({
				key: 'payingObj',
				data: appInfo,
				success: () => {
				}
			}, rej => {})
			if(e.memberSecret != undefined){
				uni.setStorageSync('memberSecretV2',e.memberSecret)
			}
		}
		setTimeout(() => {
			this.order = uni.getStorageSync('payingObj');
		}, 100);
		// wechat pay
		
		this.$store.dispatch('getSystemInfo');
		setTimeout(() => (this.showCd = true), 600);
		
		//发票
		uni.removeStorage({
			key: 'receiptInfo'
		})
		this.current = 2;
		this.pay()
	},
	watch: {
		current(val, oldVal) {
			console.log(val);
			if (val == 3) {
				if (this.order.orderAmount > this.memberInfo.userMoney) {
					this.allowBalance = false;
				}
			} else {
				this.allowBalance = true;
			}
		}
	},
	methods: {
		notAllowPay() {
			this.timeEnd = true;
			uni.showToast({
				duration: 2000,
				icon: 'none',
				title: '超时未支付，请重新购买'
			});
			setTimeout(() => {
				uni.switchTab({
					url: '/pages/index/index'
				});
			}, 1500);
		},
		savePayingProductType() {
			uni.removeStorageSync('payingOrder');
			uni.setStorageSync('payingOrder', this.order);
		},
		payByYue() {
			if (this.inputCode.length < 6) return;
			if (!this.allowBalance) return;
			uni.showLoading();
			this.allowBalance = false; //防误触
			this.apiUrl
				.payByBalance({
					data: {
						orderId: this.order.id,
						password: md5('TPSHOP' + this.inputCode)
					}
				})
				.then(res => {
					uni.hideLoading();
					this.allowBalance = true;
					if (res.data.status == 1) {
						this.savePayingProductType();
						uni.redirectTo({
							url: '../pay-success/pay-success'
						});
					} else {
						uni.showToast({
							title: res.data.message,
							mask: false,
							icon: 'none',
							duration: 1500
						});
					}
				});
		},
		radioChange: function(evt) {
			for (let i = 0; i < this.items.length; i++) {
				if (this.items[i].value == evt.target.value) {
					this.current = evt.target.value;
					break;
				}
			}
		},
		pay() {
			if (this.timeEnd) {
				uni.showToast({
					duration: 2000,
					icon: 'none',
					title: '超时未支付，请重新购买'
				});
				setTimeout(() => {
					uni.switchTab({
						url: '/pages/index/index'
					});
				}, 2000);
				return;
			}
			//wechatpay
			uni.showLoading({
				title: '正在启动支付',
				mask: true
			});

			uni.login({
				// 小程序 pay
				provider: 'weixin',
				success: res => {
					this.apiUrl
						.getOpenId({
							// get openid
							data: {
								code: res.code,
								memberId:this.order.memberId
							}
						})
						.then(res => {
							if (res.data.status == 1) {
								return this.apiUrl.getWeChatParams({
									// get wechat params
									data: {
										openId: res.data.data.openId,
										orderId: this.order.id,
										trade_type: 'MINIAPP',
										memberId:this.order.memberId
									}
								});
							} else {
								uni.hideLoading();
								uni.showToast({
									icon: 'none',
									title: res.data.message,
									duration: 1500
								});
							}
						})
						.then(res => {
							uni.hideLoading();
							wx.requestPayment({
								//pay for it
								...res.data.data,
								success: res => {
									console.log('success:' + JSON.stringify(res));
									this.savePayingProductType();
									uni.redirectTo({
										url: '../pay-success/pay-success?form=app'
									});
								},
								fail: function(err) {
									console.log('fail:' + JSON.stringify(err));
									uni.showToast({
										icon: 'none',
										title: '支付失败，请稍后重试.',
										duration: 2000
									});
								}
							});
						});
				}
			});
		}
	},
	components: {
		orderCountdown,
		uniPopup
	}
};
</script>

<style lang="less" scoped>
.navigate{
	width: 200upx;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	background: #FFFFFF;
	border: none;
	.fs22{
		padding: 0upx 0upx 0upx 20upx;
		margin: 0upx;
		border-radius: 0upx;
		color: #656565;
		background: #FFFFFF;
	}
	.fs22::after{
		position: relative;
		border: none;
		padding: 0upx;
		margin: 0upx;
		border-radius: 0upx;
		color: #656565;
		background: #FFFFFF;
	}
}

.pageBg{
	background: #FFFFFF;
}
.sumit-money{
	padding: 60upx 30upx 0upx 30upx;
	color: #656565;
	font-size: 26upx;
}
.paymgt{
	margin-top: 0upx;
	width: 670upx;
	margin: 0 auto;
	box-shadow:0upx 10upx 29upx 0upx rgba(235,235,235,1);
	border-radius:20upx;
	font-family:PingFangSC-Regular;
	font-weight:400;
	font-size: 32upx;
	color:#333333;
	.paymgt-box{
		padding: 8upx 30upx 12upx 30upx;
	}
	.pdf{
		padding: 36upx 0upx;
		border-bottom: none;
	}
	.gray{
		font-family:PingFangSC-Regular;
		font-weight:400;
		font-size: 26upx;
		color:#656565;
	}
}
.mgtbtn{
	margin-top: 60upx;
	.primary-color{
		color: #999999;
		font-size: 26upx;
		margin-top: 10upx;
	}
}
.bigFont {
	font-size: 46upx;
	padding-bottom: 50upx;
	height:66upx;
	line-height:66upx;
	.bigFont-txt{
		font-size: 26upx;
	}
}

.payIcon {
	width: 48upx;
	margin-right: 30upx;
}

.paybtn {
	width: 600upx;
	height: 70upx;
	background: #fc4e29;
	border-radius: 35upx;
	margin: 20upx auto;
}
.paybtn1{
	width: 670upx;
	height: 90upx;
	border-radius: 45upx;
	line-height: 90upx;
	background:rgba(252,78,41,1);
	font-size:36upx;
	font-family:PingFangSC-Regular;
	font-weight:400;
	color:rgba(255,255,255,1);
	margin-top: 0upx;
}

.pbc-top {
	text-align: center;
	position: relative;

	.close {
		position: absolute;
		right: 0;
		top: 0;
		width: 20upx;
	}
}

.input_code {
	flex: 2;
	border-radius: 10upx;
	position: relative;
	overflow: hidden;
	.appen-solt {
		padding: 0 10upx;
	}
	.last {
		border: none;
	}
}

.paybtn2 {
	width: 100%;
	background: #fc4e29;
}

.pbc-wrap {
	display: flex;
	height: 100%;
	flex-direction: column;
	justify-content: space-between;
	width: 100%;
}

.unpay {
	background: rgba(184, 184, 184, 1);
}
</style>
