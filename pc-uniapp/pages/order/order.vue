<template>
	<view class="pageBg" v-if="order" style="padding-bottom: 110upx;">
		<view class="background-white">
			<view class="title-status">
				<view class="pay-status" v-if="order.payStatus == 0 && order.orderStatus != 4 && order.orderStatus != 9">待付款</view>
				<view class="pay-normal" v-else>{{ order.orderStatusStr }}</view>
				<order-countdown v-if="order.payStatus == 0 && order.orderStatus != 4 && order.orderStatus != 9"
					:currentTime="systemInfo.now"
					:orderType="order.type"
					:timer="order.createDate"
					:orderText="true"
				></order-countdown>
			</view>
			<!-- express -->
			<!--<navigator :url="'logistics/logistics?id=' + order.id + (fromTihuo ? '&tihuoId=' + orderId : '')" v-if="expressInfo">-->
				<view class="address pd20" @click="toLogistics" v-if="expressInfo">
					<!-- <view class="address-tag background-blue tac white fs20">物流信息</view> -->
					<view class="">
						<view class="locate">
							<image src="/static/img/waitsent.png" mode="widthFix" class="mgr20"></image>
							<view class="primary-color fs24 mgt10" v-if="expressInfo">
								{{ expressInfo.context }}
								<view class="gray fs24 mgt10">{{ expressInfo.time }}</view>
							</view>
							<view class="gray fs24 mgt10" v-else>暂无物流信息</view>
						</view>
						<!-- <uni-icon style="position: absolute;top: 50%;right: 40upx;transform: translateY(-50%);color: #ADADAD;" type="arrowright" size="16"></uni-icon> -->
						<image src="/static/img/pubulic_icon_expand@2x.png" mode="widthFix" class="ra"></image>
					</view>
				</view>
			<!--</navigator>-->

			<!-- //addresss -->
			<view class="address getAddress">
				<view class="address-using">收货地址</view>
				<address-using :address="order"></address-using>
			</view>
			<view class="pd20 pageBd fs30 remarks">
				<view class="remarks-tips">
					<text class="title-black">购买备注: </text>
					<text class="title-black">{{ order.userNote || '无' }}</text>
				</view>
			</view>
			<!-- 商品 -->
			<view class="goods-list list-inline ">
				<view class="list-item bdb" v-for="(item, index) in order.appProductOrderList" :key="item.orderId" @tap="goToProduct(item)">
					<view class="list-img"><image :src="item.imageUrl" mode="widthFix" class="w100"></image></view>
					<view class="list-info">
						<view class="list-name title-black fs28">{{ item.productName }}</view>
						<view class="gray fs24">规格：{{ item.productModelName }}</view>
						<view class="list-price">
							<view class="fs36 primary-color">￥{{ item.price }}</view>
							<view class="gray fs24">x {{ item.amout }}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="order-detail">
				<view class="pd20 bdb betweenBox fs30">
					<text class="title-black ">商品总价</text>
					<text class="title-blacks ">￥{{ order.totalAmount }}</text>
				</view>
				<view class="pd20 bdb betweenBox fs30">
					<text class="title-black ">订单运费</text>
					<text class="title-blacks ">￥{{ order.shippingPrice }}</text>
				</view>
				<view class="pd20 bdb betweenBox fs30" v-if="order.giveFrozenMoney">
					<text class="title-black ">赠送批发券</text>
					<text class="title-blacks ">{{ order.giveFrozenMoney }}</text>
				</view>
				<view class="pd20 bdb betweenBox fs30">
					<text class="title-black ">优惠券抵扣</text>
					<text class="title-blacks ">￥{{ order.integral }}</text>
				</view>
			</view>
			<view class="pd20 pageBd betweenBox fs30 pay-amount">
				<text class="title-black ">总金额</text>
				<text class="title-black primary-color">￥{{ order.orderAmount }}</text>
			</view>
			<!-- <view class="pageBd"></view>
			<view class="pageBd"></view>
			<view class="pageBd"></view> -->
			<!-- 发票 -->
			<view class="pageBd remark-fp betweenBox" v-if="order.appOrderInvoice.invoiceStatus != 0">
				<text class="title-black">发票信息</text>
				<view class="info-right" @click='showBox'>
					<text class="title-blacks">发票信息</text>
					<uni-icon style="position: relative;top: -2upx;" type="arrowright" size="16"></uni-icon>
				</view>
			</view>
			<!-- 发票弹框 -->
			<view v-if='!hideBox' class='box'>
				<view class='box-bg'></view>
				<view class='box-main'>
					<view class="background-white order-fp">
						<view class="order-fpTag fs20">发票信息</view>
						<view class="order-close" @click='showBox'>
							<image class="img-close" src="/static/img/closed.png"></image>
						</view>
						<view class="betweenBox pd20">
							<view class="gray fs30">发票类型</view>
							<view class="rightPart" v-if="order.appOrderInvoice.invoiceStatus == 1">纸质发票</view>
							<view class="rightPart" v-if="order.appOrderInvoice.invoiceStatus == 2">增值税发票</view>
						</view>
						<view class="betweenBox pd20 " v-if="order.appOrderInvoice.unitName">
							<view class="gray fs30">单位名称</view>
							<view class="rightPart">{{ order.appOrderInvoice.unitName }}</view>
						</view>
						<view class="betweenBox pd20 " v-if="order.appOrderInvoice.taxpayerCode">
							<view class="gray fs30">纳税人识别号</view>
							<view class="rightPart">{{ order.appOrderInvoice.taxpayerCode }}</view>
						</view>
						<view class="betweenBox pd20 " v-if="order.appOrderInvoice.bankName">
							<view class="gray fs30">开户银行</view>
							<view class="rightPart">{{ order.appOrderInvoice.bankName }}</view>
						</view>
						<view class="betweenBox pd20" v-if="order.appOrderInvoice.bankAccount">
							<view class="gray fs30">银行账号</view>
							<view class="rightPart">{{ order.appOrderInvoice.bankAccount }}</view>
						</view>
						<view class="betweenBox pd20" v-if="order.appOrderInvoice.invoiceTitle">
							<view class="gray fs30">发票抬头</view>
							<view class="rightPart">{{ order.appOrderInvoice.invoiceTitle }}</view>
						</view>
						<view class="betweenBox pd20" v-if="order.appOrderInvoice.uniformSocialCreditCode">
							<view class="gray fs30">统一社会信用代码</view>
							<view class="rightPart">{{ order.appOrderInvoice.uniformSocialCreditCode }}</view>
						</view>				
						<view class="betweenBox pd20" v-if="order.appOrderInvoice.unitName">
							<view class="gray fs30">单位电话</view>
							<view class="rightPart">{{ order.appOrderInvoice.unitName }}</view>
						</view>
						<view class="betweenBox pd20 " v-if="order.appOrderInvoice.unitAddress">
							<view class="gray fs30">单位地址</view>
							<view class="rightPart">{{ order.appOrderInvoice.unitAddress }}</view>
						</view>
					</view>
				</view>
			</view>
			
			<view class="pd20 bdb betweenBox fs30" v-if="false">
				<text class="title-black ">支付状态</text>
				<view class="primary-color " v-if="order.payStatus == 0">
					待支付
					<order-countdown :timer="order.createDate" :orderType="order.type"></order-countdown>
				</view>
				<view class="primary-color " v-if="order.payStatus == 1">已支付</view>
			</view>
			<view class="pd20 bdb betweenBox fs30" v-if="order.payStatus">
				<text class="title-black ">支付方式</text>
				<text class="title-black ">{{ order.payName }}</text>
			</view>
			<view class="pd20 bdb betweenBox fs30" v-if="order.payTime">
				<text class="title-black ">支付时间</text>
				<text class="title-black ">{{ order.payTime || '无' }}</text>
			</view>
			<view class="pd20 bdb betweenBox fs30">
				<text class="title-black ">订单编号</text>
				<text class="title-black ">{{ order.orderNO }}</text>
			</view>
			<view class="pd20 bdb betweenBox fs30">
				<text class="title-black ">下单时间</text>
				<text class="title-black ">{{ order.addTime }}</text>
			</view>
			<view class="pd20 bdb betweenBox fs30" v-if="order.adminRefundRemrk && order.orderStatus != 7">
				<text class="title-black ">备注</text>
				<text class="primary-color ">{{ order.adminRefundRemrk }}</text>
			</view>
			<view class="pd20 bdb betweenBox fs30" v-if="order.disagreereason">
				<text class="title-black ">申请退款原因</text>
				<text class="primary-color ">{{ order.disagreereason }}</text>
			</view>
			
			<view class="btn_wrap" v-if="!platform">
				<view class="two-btns " v-if="order.type == 1 && order.orderStatus != 4 && order.payStatus == 1 && !fromTihuo">
					<view class="flex-box fs30">我要提货</view>
					<view class="background-blue white flex-box fs30">我要寄售</view>
				</view>
				<view class="two-btns " v-if="order.payStatus == 0 && order.orderStatus != 9 && order.orderStatus != 4">
					<view class="flex-box fs30" @tap="cancelOrder">取消订单</view>
					<view class="background-yellow white flex-box fs30" @tap="payNow">立即付款</view>
				</view>
				<view class="fullReturn" v-if="order.type == 2 && order.payStatus == 1 && order.orderStatus == 1 && order.orderStatus != 5">
					<navigator class="full-btn" :url="'../refund/refund?id=' + order.id">
						<view class="full-btn white fs30 flex-box">
							申请退款
						</view>
					</navigator>
				</view>
				<view class="fullSrue" v-if="order.orderStatus == 2 && order.payStatus == 1">
					<view class="full-btn white fs30 flex-box " @tap="haveGetProduct(order.id)">确认收货</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import orderCountdown from '@/components/order-countdown.vue';
import addressUsing from '@/components/address-using.vue';
import myMixin from '@/common/myMixin.js';
import { mapState, mapMutations } from 'vuex';
export default {
	data() {
		return {
			order: null,
			orderId: null,
			expressInfo: null,
			fromTihuo: false,
			platform: false,
			expressInfoAllData: null,
			hideBox: true,
		};
	},
	mixins: [myMixin],
	onShow() {
		// this.getOrderDetail(this.orderId);
	},
	onUnload() {
		console.log('checking');
		uni.setStorageSync('checkingOrder',this.order);
	},
	onLoad(e) {
		if (e.from) this.fromTihuo = true;
		this.orderId = e.id;
		this.getOrderDetail(e.id);
		// #ifdef H5
		if (e.platform) {
			this.platform = true;
			document.querySelector('uni-page-head').style.display = 'none';
		}
		// #endif
	},
	computed: mapState(['memberInfo', 'systemInfo']),
	methods: {
		// 关闭发票弹框
		showBox() {
			this.hideBox = !this.hideBox;
		},
		haveGetProduct(id) {
			uni.showModal({
				title: '提示',
				content: '确认收货',
				success: (res)=>{
					if (res.confirm) {
						this.apiUrl
							.confirmDelivery({
								data: {
									orderId: id
								}
							})
							.then(res => {
								if (res.data.status == 1) {
									uni.showToast({
										title: '操作成功',
										duration: 1500,
										icon: 'success'
									});
									this.getOrderDetail(id);
								}
							});
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
			//收获

		},
		payNow() {
			uni.setStorage({
				key: 'payingObj',
				data: this.order,
				success: () => {
					uni.navigateTo({
						url: 'submitOrder/submitOrder',
						animationType: 'pop-in',
						animationDuration: 200
					});
				}
			});
		},
		cancelOrder() {
			uni.showModal({
				title: '提示',
				content: '确定要取消订单吗',
				success: res => {
					this.apiUrl
						.cancelOrder({
							data: {
								orderId: this.order.id
							}
						})
						.then(res => {
							if (res.data.status == 1) {
								uni.showToast({
									title: '成功取消订单',
									mask: false,
									icon: 'none',
									duration: 1500
								});
								this.getOrderDetail(this.order.id);
							}
						});
				},
				fail: () => {},
				complete: () => {}
			});
		},
		goToProduct(product) {
			if (!product.enable) {
				uni.showToast({
					title: '商品已下架或不存在',
					mask: false,
					icon: 'none',
					duration: 1500
				});
				return;
			}
			uni.navigateTo({
				url: '../product/product-detail?id=' + product.productId,
				animationType: 'pop-in',
				animationDuration: 200
			});
		},
		getExpress() {
			let data = {};
			this.fromTihuo ? (data.selfMentionOrderId = this.orderId) : ''; //提货物流参数
			data.orderId = this.orderId;
			this.apiUrl
				.getParcelInfo({
					data
				})
				.then(res => {
					console.log(res);
					if (res.data.status == 1 && res.data.data && res.data.data.route.length) {
						this.expressInfo = res.data.data.route[0];
						this.expressInfoAllData = res.data.data
					}
				});
		},
		getOrderDetail(id) {
			if (this.fromTihuo) {
				this.apiUrl
					.order_getSelfMentionOrder({
						data: {
							id: id
						}
					})
					.then(res => {
						if (res.data.status == 1) {
							this.order = res.data.data;
							this.order.addTime = this.format(this.order.addTime);
							this.order.payTime ? (this.order.payTime = this.format(this.order.payTime)) : '';
							this.order.appProductOrderList = this.setImgSize(this.order.appProductOrderList, '200x200');

							if (this.order.shippingStatus == 1) {
								this.getExpress();
							}
						}
					});
			} else {
				this.apiUrl
					.getOrderDetail({
						data: {
							orderId: id
						}
					})
					.then(res => {
						if (res.data.status == 1) {
							this.order = res.data.data;
							this.order.addTime = this.format(this.order.addTime);
							this.order.payTime ? (this.order.payTime = this.format(this.order.payTime)) : '';
							this.order.appProductOrderList = this.setImgSize(this.order.appProductOrderList, '200x200');
							if (this.order.shippingStatus == 1) {
								this.getExpress();
							}
						}
					});
			}
		},
		toLogistics () {
			const vm = this
			uni.setStorageSync(`order_${vm.order.id}`, JSON.stringify({
				order: vm.order,
				expressInfo: vm.expressInfoAllData
			}))
			uni.navigateTo({
				url: 'logistics/logistics?id=' + vm.order.id + (vm.fromTihuo ? '&tihuoId=' + vm.orderId : '')
			})
		}
	},
	components: {
		orderCountdown,
		addressUsing
	}
};
</script>

<style lang="less" scoped>
.pageBg{
	background: #FFFFFF;
	width: 100%;
	overflow:hidden;
	.getAddress{
		padding: 5upx 22upx 0upx 16upx;
	}
	.goods-list.list-inline{
		margin: 40upx 0upx 0upx 30upx;
		padding: 0 30upx 40upx 0;
		border-bottom: 1upx solid #E5E5E5;
		.list-item{
			margin: 0;
			position:relative;
			padding: 0;
			border-bottom:none;
			.list-info{
				display: block;
			}
			.list-name{
				width:378upx;
				height:80upx;
				font-size:28upx;
				font-family:PingFangSC-Regular;
				font-weight:400;
				color:rgba(0,0,0,1);
				line-height:40upx;
				white-space: normal;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
			}
			.gray{
				height:33upx;
				font-size:24upx;
				font-family:PingFangSC-Regular;
				font-weight:400;
				color:rgba(153,153,153,1);
				line-height:33upx;
				margin-top: 10upx;
			}
			.list-img{
				width: 150upx;
				height: 150upx;
				.w100{
					width: 150upx;
					height: 150upx;
				}
			}
			.list-price{
				position: absolute;
				top: 0upx;
				right: 30upx;
				font-family:PingFangSC-Light;
				font-weight:300;
				font-size:28px;
				text-align: right;
				display:block;
				padding:0;
				.fs36{
					color:rgba(0,0,0,1);
					height:40upx;
					font-size:28upx;
					font-family:PingFangSC-Light;
					font-weight:300;
					color:rgba(0,0,0,1);
					line-height:40upx;
				}
				.fs24{
					font-size:28upx;
					font-family:PingFangSC-Regular;
					font-weight:400;
					color:rgba(153,153,153,1);
					margin-top: 1upx;
				}
			}
			
		}
	}
}

.remark-fp{
	height: 120upx;
	line-height: 120upx;
	box-sizing: border-box;
	padding: 0 30upx;
	.info-right{
		height: 120upx;
		line-height: 120upx;
		box-sizing: border-box;
		.title-black{
			margin-right: 20upx;
			height: 120upx;
			line-height: 120upx;
			box-sizing: border-box;
			font-size:30px;
			font-family:PingFangSC-Regular;
			font-weight:400;
			color:rgba(51,51,51,1);
		}
		.title-blacks{
			margin-right: 20upx;
			height: 120upx;
			line-height: 120upx;
			box-sizing: border-box;
			font-size:30upx;
			font-family:PingFangSC-Regular;
			font-weight:400;
			color:rgba(101,101,101,1);
		}
	}
}

.address.pd20{
	padding: 0 40upx 0upx 36upx;
	margin-bottom: 50upx;
}

.address{
	font-size:28upx;
	font-family:PingFangSC-Regular;
	font-weight:400;
	color:rgba(51,51,51,1);
	.address-using{
		height:48upx;
		font-size:34upx;
		font-family:PingFangSC-Semibold;
		font-weight:600;
		color:rgba(51,51,51,1);
		line-height:48upx;
		padding-left: 30upx;
	}
	.mgr20{
		margin-right: 20upx;
	}
	.mgl20{
		margin-left: 20upx;
	}
	.fs24{
		font-size:28upx;
		font-family:PingFangSC-Regular;
		font-weight:400;
		color:rgba(101,101,101,1);
		margin: 0;
	}
}

.remarks{
	padding:0;
	.remarks-tips{
		margin-left: 30upx;
		width: 720upx;
		border-top: 1upx solid #E5E5E5;
		padding: 34upx 30upx 34upx 0;
	}
	.title-black{
		font-size:30upx;
		font-family:PingFangSC-Regular;
		font-weight:400;
		color:rgba(51,51,51,1);
	}
}
.pay-amount{
	padding: 45upx 30upx;
	.title-black{
		font-family:PingFangSC-Semibold;
		font-weight:600;
		font-size:34upx;
		color:rgba(51,51,51,1);
	}
	.primary-color{
		font-family:PingFangSC-Semibold;
		font-weight:600;
		font-size:34upx;
		color:rgba(249,83,26,1);
	}
}
.order-detail{
	width: 720upx;
	height: auto;
	padding: 40upx 30upx 10upx 0upx;
	margin-left: 30upx;
	border-bottom: 1upx solid #E5E5E5;
	box-sizing:border-box;
	.pd20{
		margin: 0 0 30upx 0;
		padding: 0;
		font-size:30upx;
		font-family:PingFangSC-Light;
		font-weight:300;
		color:rgba(51,51,51,1);
		border-bottom: none;
	}
	.title-blacks{
		color:rgba(101,101,101,1);
	}
}
.title-status{
	width:690upx;
	height: 180upx;
	background:linear-gradient(315deg,rgba(255,127,45,1) 0%,rgba(255,80,0,1) 100%);
	border-radius:18upx;
	margin: 12upx 30upx 60upx 30upx;
	padding: 0 50upx;
	box-sizing: border-box;
	color:rgba(255,255,255,1);
	.pay-normal{
		padding-top: 64upx;
		font-size:38upx;
		font-family:PingFangSC-Semibold;
		font-weight:600;
	}
	.pay-status{
		padding: 40upx 0 8upx 0;
		font-size:38upx;
		font-family:PingFangSC-Semibold;
		font-weight:600;
	}
	.pay-systemInfo{
		height:38upx;
		font-size:28upx;
		font-family:PingFangSC-Regular;
		font-weight:400;
		color:rgba(255,255,255,1);
		line-height:40upx;
		opacity: 0.9;
	}
}
.btn_wrap {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	background: white;
}
.order-fp {
	padding: 40upx;
	.order-fpTag {
		width: 100%;
		text-align: center;
		height: 60upx;
		font-size:36upx;
		font-family:PingFangSC-Medium;
		font-weight:500;
		color:rgba(51,51,51,1);
	}
	.order-close{
		position: absolute;
		top: 50upx;
		right: 45upx;
		height: 30upx;
		width: 30upx;
		color:#CECECE;
		.img-close{
			height: 30upx;
			width: 30upx;
			margin: 4upx;
		}
	}
	.rightPart {
		width: 400upx;
	}
	.betweenBox {
		padding: 28upx 10upx;
		border-bottom: 1upx dashed #E6E6E6;
		font-size:32px;
		font-family:PingFangSC-Regular;
		font-weight:400;
		color:rgba(153,153,153,1);
		.rightPart{
			font-weight:400;
			color:rgba(51,51,51,1);
		}
	}
	.betweenBox:last-child{
		border-bottom: none;
		margin-bottom: 20upx;
	}
}

.full-btn {
	height: 100upx;
}
	
.fullReturn{
	display: flex;
	font-size:36px;
	font-family:PingFangSC-Regular;
	font-weight:400;
	padding: 15upx 0 0 460upx;
	height: 111upx;
	border-top:1upx solid #E5E5E5;
	box-sizing:border-box;
	.full-btn {
		width:260upx;
		height:80upx;
		border-radius:40upx;
		border:1upx solid rgba(203,203,203,1);
		color:rgba(101,101,101,1);
		box-sizing:border-box;
	}
}
.fullSrue{
	display: flex;
	font-size:36px;
	font-family:PingFangSC-Regular;
	font-weight:400;
	padding: 15upx 0 0 460upx;
	height: 111upx;
	border-top:1upx solid #E5E5E5;
	box-sizing:border-box;
	.full-btn {
		width:260upx;
		height:80upx;
		background:rgba(249,83,26,1);
		border-radius:40px;
		font-size:36upx;
		font-family:PingFangSC-Regular;
		font-weight:400;
		color:rgba(255,255,255,1);
		box-sizing:border-box;
	}
}

.two-btns {
	display: flex;
	font-size:36px;
	font-family:PingFangSC-Regular;
	font-weight:400;
	padding: 15upx 0 0 170upx;
	height: 111upx;
	border-top:1upx solid #E5E5E5;
	box-sizing:border-box;
	.flex-box{
		width:260upx;
		height:80upx;
		border-radius:40upx;
		border:1upx solid rgba(203,203,203,1);
		color:rgba(101,101,101,1);
		box-sizing:border-box;
	}
	.white{
		width:260upx;
		height:80upx;
		background:rgba(249,83,26,1);
		border-radius:40upx;
		border: none;
		color:rgba(255,255,255,1);
		margin-left: 30upx;
	}
	// > view {
	// 	flex: 1;
	// 	height: 100upx;
	// }
}

.address {
	position: relative;

	.ra {
		position: absolute;
		right: 40upx;
		top: 50%;
		width: 20upx;
		transform: translateY(-50%);
		color: #ADADAD;
	}

	.locate {
		display: flex;
		.primary-color .gray{
			height:40upx;
			font-size:28upx;
			color:rgba(153,153,153,1);
			line-height:40upx;
			margin-top: 7upx;
		}

		image {
			width: 40upx;
			height: 36upx;
			margin-right: 24upx;
		}

		> view {
			width: 580upx;
		}
	}

	.address-tag {
		width: 140upx;
		height: 34upx;
		background: #fc4e29;
		border-radius: 30upx;
		line-height: 34upx;
		margin-bottom: 10upx;
	}
}

// 发票弹框
.box{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
	z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
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
	height: auto;
    z-index: 9;
	border-radius:30upx 30upx 0upx 0upx;
	overflow: hidden;
}
</style>
