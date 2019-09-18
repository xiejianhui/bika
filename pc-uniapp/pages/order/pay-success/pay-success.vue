<template>
	<view class="colTopBottom pageBg">
		<view class="" style="padding-top: 30upx;">
			<view class="ps-circle flex-box">
				<view class="flex-box">
					<image src="../../../static/img/success-tickets.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="tac fs30 mgb20 mgt20 title-black">
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
			<navigator url="/pages/index/index" open-type='switchTab' v-if="order.type!=1 && order.type!=7">
				<view class="white-btn mgt40 primary-border">
					返回首页
				</view>
			</navigator>
			<navigator :url="'/pages/order/order?id='+order.id">
				<view class="blue-btn mgt40 primary-background" v-if="order.type!=1 && order.type!=7">
					查看订单
				</view>
			</navigator>		
		</view>
		<view class="mgt40 mgtbtn" v-if="systemInfo">
			<!-- <view class="paybtn white flex-box paybtn1" @tap="toApp">
				<text class="mgr20 ">返回app</text>
			</view> -->
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
		margin: 0upx 90upx;
		box-sizing: border-box;
		.mgt40{
			margin-top: 70upx;
		}
		.white-btn{
			width:260upx;
			height:80upx;
			line-height: 80upx;
			border-radius:40upx;
			border:1upx solid rgba(203,203,203,1);
			float: left;
			margin-right: 40upx;
			color: #656565;
			font-size: 36upx;
			box-sizing: border-box;
		}
		.blue-btn{
			width:260upx;
			height:80upx;
			line-height: 80upx;
			background:rgba(249,83,26,1);
			border-radius:40upx;
			float: left;
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
			border-radius: 50%;
			border: 8upx solid #49D46E;
			margin-top: 0upx;
			background:#49D46E;

			image {
				width: 94upx;
			}
		}
	}
	.tac{
		margin: 30upx 0upx;
		font-size:38upx;
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
