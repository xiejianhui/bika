<template>
	<view class="colTopBottom pageBg">
		<view class="" style="padding-top: 138upx;">
			<view class="ps-circle flex-box" v-if="1==1">
				<view class="flex-box">
					<image src="/static/img/moudel/icon-chenggong.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="ps-circle flex-box" v-else>
				<view class="flex-box">
					<image src="/static/img/moudel/icon-shibai.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="tac title-black">
				支付成功
			</view>
		</view>

		<view class="order-box" v-if="order" style="margin-bottom: 80px;">
			<view class="sale-to" @tap="toSale">
				<view class="white-btn mgt40 primary-border" v-if="order.type==1 || order.type==7">
					去自提
				</view>
			</view>
			<view class="sale-to" @tap="toConSignment">
				<view class="blue-btn mgt40 primary-background" v-if="order.type==1 || order.type==7">
					去寄售
				</view>
			</view>
			<view class="white-btn mgt40 primary-border" v-if="1 == 2" @tap="rePayment">
				重新支付
			</view>
			<navigator url="/pages/product/product-category" open-type='switchTab' v-if="order.type!=1 && order.type!=7">
				<view class="white-btn mgt40 primary-border">
					继续购物
				</view>
			</navigator>
			<navigator :url="'/pages/order/order?id='+order.id">
				<view class="blue-btn mgt40 primary-background" v-if="order.type!=1 && order.type!=7">
					查看订单
				</view>
			</navigator>		
		</view>
		<view class="mgt40 mgtbtn" v-if="systemInfo">
			<button class="paybtn white flex-box paybtn1" open-type="launchApp" app-parameter="wechat" binderror="launchAppError">返回APP</button>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				order: null,
				systemInfo:false,
				orderId:'',
			};
		},
		onLoad(e) {
			if(e.form != undefined){
				this.systemInfo = true
			}
			if(e.orderId != undefined){
				this.orderId = e.orderId
			}	
		},
		onShow() {
			uni.getStorage({
				key:'consignment',
				success: (res) => {
				},
				fail: (res) => {
					uni.setStorageSync('paySuccessToHomePage',true)
				}
			})
			this.getProductType();
			// #ifdef APP-PLUS
			switch(uni.getSystemInfoSync().platform){
				case 'ios':
				   console.log('运行iOS上')
				   if(this.order.type == undefined || this.order.type == null || this.order.type == ''){
						this.getOrderDetail(this.orderId)
				   }
				   break;
			}
			// #endif
		},
		methods: {
			rePayment(){
				uni.setStorage({
					key: 'payingObj',
					data: this.order,
					success: () => {
						uni.navigateTo({
							url: '/pages/order/submitOrder/submitOrder',
							animationType: 'pop-in',
							animationDuration: 200
						});
					}
				});
			},
			getProductType() {
				this.order = uni.getStorageSync('payingOrder');
				console.log("this.order",this.order)
				// #ifdef APP-PLUS
				switch(uni.getSystemInfoSync().platform){
					case 'android':
					   console.log('运行Android上')
					   if(this.order.type == undefined || this.order.type == null || this.order.type == ''){
							this.getOrderDetail(this.orderId)
					   }
					   break;
				}
				// #endif
			},
			toApp(){
				uni.navigateBack({
					delta: 1
				})
			}
			,toSale(){
				uni.navigateTo({
					url:'../submit-wholesale/submit-wholesale?orderId=' + this.orderId
				})
			}
			,toConSignment(e){
				uni.navigateTo({
					url:'../submit-consignment/submit-consignment?orderId=' + this.orderId
				})
			},
			getOrderDetail(id){
				this.apiUrl
					.getOrderDetail({
						data: {
							orderId: id
						}
					})
					.then(res => {
						if(res.data.status==1&&res.data.data){
							this.order = res.data.data
						}
					});
			},
		},
	}
</script>

<style lang="less" scoped>
	.sale-to{
		width: 100%;
		height: 100%;
	}
	.order-box{
		margin: 0upx 30upx;
		box-sizing: border-box;
		.mgt40{
			margin-top: 60upx;
		}
		.white-btn{
			width:330upx;
			height:88upx;
			background:rgba(255,255,255,1);
			border:1upx solid rgba(254,106,114,1);
			border-radius:44upx;
			float: left;
			margin-right: 20upx;
			color: #FE6A72;
			font-size: 36upx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.blue-btn{
			width:340upx;
			height:88upx;
			background:rgba(255,255,255,1);
			border:1upx solid rgba(200,200,200,1);
			border-radius:44upx;
			color: #666666;
			float: left;
			box-sizing: border-box;
			font-size: 36upx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
	.pageBg{
		height: auto;
		min-height: auto;
		background: #FFFFFF;
	}
	.ps-circle {
		>view {
			width: 140upx;
			height: 140upx;
			image {
				width: 140upx;
				height: 140upx;
			}
		}
	}
	.tac{
		margin: 30upx 0upx;
		font-size:48upx;
		font-family:PingFangSC-Semibold;
		font-weight:600;
		color:rgba(51,51,51,1);
	}
	.mgtbtn{
		margin: 30upx auto;
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
</style>
