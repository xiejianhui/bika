<template>
	<view class="pageBg">
		
		<view class="box-contant">
			<view class="fs24 tac pd20 background-white sumit-money">付款金额</view>
			<view class="primary-color bigFont tac background-white pdb20"><text class="bigFont-txt">￥</text>{{ order.orderAmount || 0 }}</view>
			<!-- pay by different types -->
			<view class="background-white mgt40 paymgt">
				<view class="paymgt-box">
					<radio-group @change="radioChange">
						<label class="betweenBox pd20 bdb pdf" v-for="(item, index) in items" :key="index" v-if="item.show == 'true' || item.show == true">
							<view class="flex-box fs32">
								<image v-if="item.value == 1" src="/static/img/alipay.png" mode="widthFix" class="payIcon mgr20"></image>
								<image v-if="item.value == 2" src="/static/img/wechatpay.png" mode="widthFix" class="payIcon mgr20"></image>
								<image v-if="item.value == 3" src="/static/img/balance.png" mode="widthFix" class="payIcon mgr20"></image>
								<image v-if="item.value == 4" src="/static/img/cloud-flash.png" mode="widthFix" class="payIcon mgr20"></image>
								{{ item.name }}
								<text class="gray mgl20" v-if="item.value == 3">(可用余额￥{{ memberInfo.userMoney }})</text>
							</view>
							<view><radio :value="item.value" :checked="item.value == current" /></view>
						</label>
					</radio-group>
				</view>
			</view>
			<!-- <view class="pd20 tac betweenBox">
				<view class="flex-box">
					<view class="def-circle border flex-box mgr20" @tap="agree = !agree"><uni-icon v-if="agree" type="checkbox-filled" color="#FC4E29" size="24"></uni-icon></view>
					<navigator url="../../login/agreements/agreements?type=6"><text class="primary-color fs24 underline">我已阅读并同意《盖世风支付协议》</text></navigator>
				</view>
			</view> -->
			<view class="mgt40 mgtbtn" v-if="systemInfo">
				<view class="paybtn white flex-box paybtn1" :class="{ unpay: timeEnd || !allowBalance }" @tap="pay" v-if="showCd">
					<text class="mgr20 ">去付款</text>

					<order-countdown :timer="order.createDate" :currentTime="systemInfo.now" :orderType="order.type" @activeOver="notAllowPay"></order-countdown>
				</view>
				<view class="tac fs24 primary-color" v-if="order.type == 0 || order.type == 6">请在{{ systemInfo.resaleTimeLimit }}分钟内完成付款，否则订单失效。</view>
				<view class="tac fs24 primary-color" v-if="order.type == 1 || order.type == 7">请在{{ systemInfo.wholesaleTimeLimit }}分钟内完成付款，否则订单失效。</view>
				<view class="tac fs24 primary-color" v-if="order.type == 2">请在{{ systemInfo.generalTimeLimit }}分钟内完成付款，否则订单失效。</view>
			</view>
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
		<!-- #ifdef APP-PLUS -->
		<!-- 弹出选择商品 -->
		<view class="box-contant">
			<view class="uni-modal" v-if="showPop">
				<view class="uni-mask"></view>
				<view class="modal-box">
					<view class="uni-modal__bd">请确认支付结果</view>
					<view class="uni-modal__ft">
						<view class="uni-modal__btn uni-modal__btn_default" @tap="popCancel">未付款</view>
						<view class="uni-modal__btn uni-modal__btn_primary" @tap="popConfirm">已付款</view>
					</view>
					</view>
				</view>
			</view>
				
			<view class="uni-modal" v-if="showModal">
				<view class="uni-mask"></view>
				<view class="modal-box">
					<view class="uni-modal__bd">尚未查询到支付结果,若您已支付,请耐心等待几分钟。</view>
					<view class="uni-modal__ft">
						<view class="uni-modal__btn uni-modal__btn_default" @tap="modalCancel">返回首页</view>
						<view class="uni-modal__btn uni-modal__btn_primary" @tap="modalConfirm">查看订单</view>
					</view>
					</view>
				</view>
			</view>
		</view>
		<!-- #endif -->

	</view>
</template>
<script>
import orderCountdown from '@/components/order-countdown.vue';
import uniPopup from '@/components/uni-popup.vue';

import { mapState, mapMutations } from 'vuex';
import md5 from '@/common/md5.js';
// 调起app支付
const plugins = require('@/common/plugins.js');
export default {
	data() {
		return {
			agree: true,
			items: [
				{
					value: '1',
					name: '支付宝支付',
					show:true
				},
				{
					value: '2',
					name: '微信支付',
					show:true
				},
				{
					value: '3',
					name: '余额支付',
					show:true
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
			appWechat:false,
			showPop:false,
			showModal:false,
			fromOrder:false,
			payPlugins: plugins,//调起app云闪付支付
			alipayUrl:'',//调起app支付宝支付
			firstWayApp:false, //默认首次进入默认付款方式
			appAlipay:false,
		};
	},
	computed: mapState(['memberInfo', 'systemInfo']),
	destroyed() {
		uni.removeStorageSync('payingObj');
	},
	onShow() {
		this.$store.dispatch('getSystemInfo');
		this.order = uni.getStorageSync('payingObj');
		// wechat pay
		// #ifdef H5
		if (this.getQueryString('code')) {
			this.payByWechat();
		}
		// #endif
		
		uni.setStorageSync('backToHomePage', true);
		this.showCd = true
		//发票
		uni.removeStorage({
			key: 'receiptInfo'
		})
		
		//nav
		uni.getStorage({
			key:'consignment',
			success: (res) => {
			},
			fail: (res) => {
				uni.getStorage({
					key: 'paySuccessToHomePage',
					success: res => {
						uni.removeStorageSync('paySuccessToHomePage');
						uni.switchTab({
							url: '/pages/index/index'
						});
					}
				});
			}
		})
		//pay
		// #ifdef H5
		let payWay = [
			{
				value: '2',
				name: '微信支付',
				show: this.systemInfo.wechatPayShow || true
			},
			{
				value: '3',
				name: '余额支付',
				show:true
			}
		];
		if (this.isWeiXin()) {
			//h5 微信
			this.items = payWay;
			this.current = 2;
		} else {
			//h5 支付宝支付
			this.items = [
				{
					value: '1',
					name: '支付宝支付',
					show:this.systemInfo.alipayShow || true
				},
				{
					value: '3',
					name: '余额支付',
					show:true
				}
			];
			this.current = 1;
		}
		// #endif

		// #ifdef MP-WEIXIN
		let payWayWx = [
			{
				value: '2',
				name: '微信支付',
				show: this.systemInfo.wechatPayShow || true
			},
			{
				value: '3',
				name: '余额支付',
				show:true
			}
		];
		this.items = payWayWx;
		this.current = 2;
		// #endif
		
		// #ifdef APP-PLUS
		let payWayApp = [
			{
				value: '4',
				name: '云闪付支付',
				show:this.systemInfo.unionpayShow || true
			},
			{
				value: '2',
				name: '微信支付',
				show: this.systemInfo.wechatPayShow || true
			},
			{
				value: '1',
				name: '支付宝支付',
				show:this.systemInfo.alipayShow || true
			},
			{
				value: '3',
				name: '余额支付',
				show:true
			}
		];
		if(this.firstWayApp){
			this.current = payWayApp[0].value
			this.firstWayApp = false
		}
		this.items = payWayApp;
		if(this.appWechat){
			this.showPop = true;
			this.appWechat= false;
		}
		if(this.appAlipay){
			this.showPop = true;
			this.appAlipay= false;
		}
		// #endif		
	},
	created() {},
	onLoad(e) {
		e.agree ? (this.agree = true) : '';
		// #ifdef APP-PLUS
		this.firstWayApp = true
		// #endif
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
		// #ifdef APP-PLUS
		openWxMini() {
			const vm = this;
			this.appWechat= true;
			let memberSecret =  uni.getStorageSync('memberSecretV2');
			uni.hideLoading();
			/** 
			 * 参数说明第一个参数明细是如下
			 * id: (String 类型 )微信小程序ID 注意：是微信小程序的原始ID（"g_"开头的字符串）。
			 * path: (String 类型 )微信小程序打开的页面路径
			 * type: (Number 类型 )微信小程序版本类型	
			 * 可取值： 0-正式版； 1-测试版； 2-体验版。 默认值为0。
			 * webUrl: (String 类型 )兼容低版本的网页链接
			 * 			
			 * 第二个参数是openType，打开小程序的类型，默认传weixin				
			 **/
			vm.openWxMiniProgram({
				id: 'gh_268fae9b7b2a',
				path:'/pages/order/appOrder/appOrder?orderAmount=' + vm.order.orderAmount + '&type=' + vm.order.type + '&createDate=' + vm.order.createDate + '&id=' + vm.order.id + '&memberId=' + vm.order.memberId + '&memberSecret='+ memberSecret,
				// type:2,
			}, 'weixin')
		},
		openWxMiniProgram(objData, openType) {
			plus.share.getServices((s) => {
				let shares = {}
				for (let i in s) {
					const t = s[i]
					shares[t.id] = t
				}
				const sWx = shares[openType||'weixin']
				sWx.launchMiniProgram(objData)
			})
		},
		popConfirm(){
			this.showPop = false;
			this.getOrderDetail(this.order.id)
		},
		popCancel(){
			this.showPop = false;
		},
		modalConfirm(){
			this.showModal = false;
			uni.getStorage({
				key: 'pagefromSubmit',
				success: (res) => {
					this.fromOrder = res.data; //page from product-detail
					uni.removeStorageSync('pagefromSubmit');
					uni.redirectTo({
						url:"/pages/order/order-list?orderType=0"
					})
				},fail() {
					uni.navigateBack()
				}
			})
		},
		modalCancel(){
			this.showModal = false;
			uni.switchTab({
				url:"/pages/index/index"
			})
		},
		getOrderDetail(id){
			let payingAlipay = uni.getStorageSync('payingObj');
			this.apiUrl.getOrderDetail({data:{
				orderId:payingAlipay.id
			}}).then(res=>{
				uni.hideToast();
				if(res.data.status==1){
					if(res.data.data.payStatus == 1){
						uni.removeStorageSync('payingOrder');
						uni.setStorageSync('payingOrder', payingAlipay);
						uni.redirectTo({
							url: '/pages/order/pay-success/pay-success?orderId=' + payingAlipay.id
						})
					}else{
						this.showModal = true;
					}
				}else{
					this.showModal = true;
				}
			})
		},
		// 调起app云支付方法
		doNativePay (tn) {
			let payingCloud = uni.getStorageSync('payingObj');
			this.payPlugins.performUnifyPayment(tn, '00',function( result ) {
				if(result[0] == 'cancel'){
					uni.showToast({
						icon: 'none',
						title: '用户取消支付',
						duration: 2000
					});
				}
				else if(result[0] == 'success'){
					// this.savePayingProductType();
					//支付成功后显示订单状态（查看、返回首页等）
					uni.removeStorageSync('payingOrder');   
// 					setTimeout(() => {
// 						uni.setStorageSync('payingOrder', payingCloud);
// 					}, 300);
					uni.setStorageSync('payingOrder', payingCloud);
					uni.redirectTo({
						url: '/pages/order/pay-success/pay-success?orderId=' + payingCloud.id
					})
				}else if(result[0] == 'fail'){
					uni.showToast({
						icon: 'none',
						title: '支付失败，请稍后重试.',
						duration: 2000
					});
				}			
			})
		},
		// 调起支付宝支付
		openAlipay(types) {
			this.appAlipay= true;
			plus.runtime.openURL(types, function(res) {
				uni.showToast({
					title: "请确认已安装支付宝",
					mask: false,
					icon: 'none',
					duration: 1500
				});
			});
		},
		// #endif
		notAllowPay() {
			this.timeEnd = true;
			uni.showToast({
				duration: 2000,
				icon: 'none',
				title: '超时未支付，请重新购买'
			});
			setTimeout(() => {
				uni.switchTab({
					url: '../../index/index'
				});
			}, 1500);
		},
		payByWechat() {
			let code = this.getQueryString('code');
			this.apiUrl
				.getOpenId({
					data: {
						code,
						type: 'webapp'
					}
				})
				.then(res => {
					if (res.data.status == 1) {
						return this.apiUrl.getWeChatParams({
							// get wechat params
							data: {
								openId: res.data.data.openId,
								orderId: this.order.id,
								trade_type: 'JSAPI'
							}
						});
					}
				})
				.then(res => {
					if (res.data.status == 1) {
						this.wechatWebpay(res.data.data);
					}
				});
		},
		wechatWebpay(data) {
			let orderId = this.order.id;
			let self = this;
			let pay = function() {
				WeixinJSBridge.invoke(
					'getBrandWCPayRequest',
					{
						appId: data.appId, //公众号名称，由商户传入
						timeStamp: data.timeStamp, //时间戳，自1970年以来的秒数
						nonceStr: data.nonceStr, //随机串
						package: data.package,
						signType: data.signType, //微信签名方式：
						paySign: data.paySign //微信签名
					},
					function(res) {
						if (res.err_msg == 'get_brand_wcpay_request:ok') {
							// 使用以上方式判断前端返回,微信团队郑重提示：
							//res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
							self.savePayingProductType();
							uni.redirectTo({
								url: '../pay-success/pay-success?orderId=' + this.order.id
							});
						}
						if (res.err_msg == 'get_brand_wcpay_request:cancel' || res.err_msg == 'get_brand_wcpay_request:fail') {
							// 失败
							let url = location.origin + '/#/pages/order/order?id=' + orderId;
							location.href = url;
						}
					}
				);
			};
			if (typeof WeixinJSBridge == 'undefined') {
				if (document.addEventListener) {
					document.addEventListener('WeixinJSBridgeReady', pay, false);
				} else if (document.attachEvent) {
					document.attachEvent('WeixinJSBridgeReady', pay);
					document.attachEvent('onWeixinJSBridgeReady', pay);
				}
			} else {
				pay();
			}
		},
		getQueryString(name) {
			let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
			let r = window.location.search.substr(1).match(reg);
			if (r != null) return unescape(r[2]);
			return null;
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
							url: '../pay-success/pay-success?orderId=' + this.order.id
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
		payByCloud(){
			if (!this.allowBalance) return;
			uni.showLoading({
				title: '去云闪付支付',
				mask: true,
			});
			this.allowBalance = false; //防误触
			this.apiUrl
				.payByCloud({
					data: {
						orderId: this.order.id,
						type: 'ysf_app'
					}
				})
				.then(res => {
					uni.hideLoading();
					this.allowBalance = true;
					if (res.data.status == 1) {
						this.doNativePay(JSON.stringify(res.data.data.appPayRequest))
					} else {
						if (res.data.message != undefined) {
							uni.showToast({
								title: res.data.message,
								mask: false,
								icon: 'none',
								duration: 1500
							});
						}else{
							uni.showToast({
								title: "系统繁忙",
								mask: false,
								icon: 'none',
								duration: 1500
							});
						}
					}
				});
		},
		payByAlipay(){
			if (!this.allowBalance) return;
			uni.showLoading({
				title: '支付宝支付',
				mask: true,
			});
			this.allowBalance = false; //防误触
			this.apiUrl
				.payByCloud({
					data: {
						orderId: this.order.id,
						type: 'ali_app'
					}
				})
				.then(res => {
					uni.hideLoading();
					this.allowBalance = true;
					if (res.data.status == 1) {
						switch(uni.getSystemInfoSync().platform){
							case 'android':
							   this.openAlipay("alipays://platformapi/startapp?saId=10000007&qrcode=" + res.data.data.appPayRequest.qrCode);
							   break;
							case 'ios':
								console.log("运行到ios")
								this.openAlipay("alipay://platformapi/startapp?saId=10000007&qrcode=" + res.data.data.appPayRequest.qrCode);
								break;
						}
					} else {
						if (res.data.message != undefined) {
							uni.showToast({
								title: res.data.message,
								mask: false,
								icon: 'none',
								duration: 1500
							});
						}else{
							uni.showToast({
								title: "系统繁忙",
								mask: false,
								icon: 'none',
								duration: 1500
							});
						}
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
		isWeiXin() {
			//window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
			var ua = window.navigator.userAgent.toLowerCase();
			//通过正则表达式匹配ua中是否含有MicroMessenger字符串
			if (ua.match(/MicroMessenger/i) == 'micromessenger') {
				return true;
			} else {
				return false;
			}
		},
		pay() {
			if (!this.allowBalance) return;
			// if (!this.agree) {
			// 	uni.showToast({
			// 		duration: 2000,
			// 		icon: 'none',
			// 		title: '需要同意支付协议'
			// 	});
			// 	return;
			// }
			if (!this.current) {
				uni.showToast({
					duration: 2000,
					icon: 'none',
					title: '请选择支付方式'
				});
				return;
			}
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

			if (this.current == 1) {
				//alipay
				uni.showLoading({
					title: '...',
					mask: true
				});
				// #ifdef H5
				let url = location.origin + '/#/pages/order/pay-success/pay-success?orderId=' + this.order.id;
				this.apiUrl
					.useAlipay({
						data: {
							orderId: this.order.id,
							type: 'web',
							returnUrl: url
						}
					})
					.then(res => {
						uni.hideLoading();
						if (res.data.status == 1) {
							this.savePayingProductType();
							const div = document.createElement('div');
							div.innerHTML = res.data.data.orderString;
							document.body.appendChild(div);
							this.$nextTick(() => {
								document.forms[0].submit(); //提交form表单
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
				// #endif

				// #ifdef APP-PLUS
				if(this.systemInfo.aliAppPayChannel != undefined && this.systemInfo.aliAppPayChannel == 'yl'){
					// 第三方支付宝支付
					this.payByAlipay();
					return;
				}else{	
					this.apiUrl
						.useAlipay({
							data: {
								orderId: this.order.id,
								type: 'app'
							}
						})
						.then(res => {
							uni.hideLoading();
							console.log('alipay prepay info:' + JSON.stringify(res));
							if (res.data.status == 1) {
								console.log('alipay prepay orderString:' + JSON.stringify(res.data.orderString));
								uni.requestPayment({
									provider: 'alipay',
									orderInfo: res.data.data.orderString,
									success: res => {
										console.log('ali pay success:' + JSON.stringify(res));
										this.savePayingProductType();
										uni.redirectTo({
											url: '../pay-success/pay-success?orderId=' + this.order.id
										});
									},
									fail: function(err) {
										console.log('ali fail:' + JSON.stringify(err));
										uni.showToast({
											icon: 'none',
											title: '支付失败，请稍后重试.',
											duration: 2000
										});
									}
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
				}
				// #endif
			} else if (this.current == 2) {
				//wechatpay
				uni.showLoading({
					title: '...',
					mask: true
				});
				// #ifdef H5
				//公纵号
				let origin = location.origin;
				let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc75e0c815860d199&redirect_uri=${origin}/%23/pages/order/submitOrder/submitOrder&response_type=code&scope=snsapi_base#wechat_redirect`;
				console.log(url);
				location.href = url;
				return;
				// #endif
				// #ifdef MP-WEIXIN
				uni.login({
					// 小程序 pay
					provider: 'weixin',
					success: res => {
						this.apiUrl
							.getOpenId({
								// get openid
								data: {
									code: res.code
								}
							})
							.then(res => {
								if (res.data.status == 1) {
									return this.apiUrl.getWeChatParams({
										// get wechat params
										data: {
											openId: res.data.data.openId,
											orderId: this.order.id,
											trade_type: 'MINIAPP'
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
											url: '../pay-success/pay-success?orderId=' + this.order.id
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
				// #endif
				
				// #ifdef APP-PLUS
				if(this.systemInfo.payChannel != undefined && this.systemInfo.payChannel == 'yl'){
					this.openWxMini();
					return;
				}else{				
					this.apiUrl
						.getWeChatParams({
							data: {
								orderId: this.order.id,
								trade_type: 'APP'
							}
						})
						.then(res => {
							if (res.data.status == 1) {
								let orderInfo = res.data.data;
								console.log('orderInfo:'+JSON.stringify(orderInfo));
								orderInfo.package = 'Sign=WXPay';
								uni.requestPayment({
									provider: 'wxpay',
									orderInfo: JSON.stringify(orderInfo),
									success: res => {
										uni.hideLoading();
										console.log('success:' + JSON.stringify(res));
										this.savePayingProductType();
										uni.redirectTo({
											url: '../pay-success/pay-success?orderId=' + this.order.id
										});
									},
									fail: function(err) {
										console.log('orderInfo:' + JSON.stringify(orderInfo));
										console.log('fail:' + JSON.stringify(err));
										uni.showToast({
											icon: 'none',
											title: '支付失败，请稍后重试.',
											duration: 2000
										});
									}
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
				}
				// #endif
			} else if (this.current == 3) {
				// 余额支付
				this.showYue = !this.showYue;
			}else if (this.current == 4){
				// 云闪付
				this.payByCloud()
			}
		}
	},
	components: {
		orderCountdown,
		uniPopup
	}
};
</script>

<style lang="less" scoped>
// y页面
.box-contant{
	width:100%;
	height: 100%;
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
