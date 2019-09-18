<template>
	<view class="pageBg" v-if="expressInfo">
		<view class="background-white">
			<view class="goods-list list-inline " >
				<view class="list-item ">
					<view class="list-img relative">
						<image :src="order.appProductOrderList[0].imageUrl" mode="widthFix" class="w100"></image>
						<!-- <view class="showNum">
							共{{totalNum}}件
						</view> -->
					</view>
					<view class="" >
						<!-- <view class="list-name primary-color  fs30">
							<text v-if="expressInfo.state==0">在途中</text>
							<text v-if="expressInfo.state==1">已揽件</text>
							<text v-if="expressInfo.state==2">疑难件</text>
							<text v-if="expressInfo.state==3">已签收</text>
							<text v-if="expressInfo.state==4">已退签</text>
							<text v-if="expressInfo.state==5">正在派件 </text>
							<text v-if="expressInfo.state==6">已退回</text>
						</view> -->
						<view class="list-name title-black fs28">{{order.shippingName||expressInfo.com}}
						</view>
						<view class="list-price mgb20 gray">
							快递单号:  {{expressInfo.nu}}
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="mgt20 background-white">
			<view class="log-item" v-for="(item,index) in expressInfo.route" :key='index'>
				<view :class="index==0 ? 'pda log-pd' : 'log-pd'">
					<!-- <view class="fs30">{{item.time.split(' ')[0]}}</view>
					<view class="gray">{{item.time.split(' ')[1]}}</view> -->
					<view class="fs30">{{item.monDay}}</view>
					<view class="gray">{{item.hoursMin}}</view>
				</view>
				<view class="">
					<view class="gray" :class="{'primary-color':index==0}">
						<view :class="{'top':index==0}" class="lg-circle flex-box">
							<view class="inner">

							</view>
						</view>
					</view>
					<view class="fs24 " :class="{'black-color':index==0,'gray':index!=0}">
						{{item.context}}
					</view>
				</view>
			</view>
			<view class="tac pd20 fs30" v-if="!expressInfo.route || !expressInfo.route.length">
				暂无物流信息
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderId:null,
				order:null,
				expressInfo:null,
				tihuoId:'',
				totalNum:0,
			};
		},
		onLoad(e){
			this.orderId = e.id;
			e.tihuoId?this.tihuoId = e.tihuoId:'';
			const data = uni.getStorageSync(`order_${this.orderId}`) || '{}'
			const jsonData = JSON.parse(data)
			this.order = jsonData.order
			this.order.appProductOrderList.forEach(item=>{
				this.totalNum+=Number(item.amout)
			})
			// 日期截取
			if(jsonData.expressInfo.route.length > 0){
				jsonData.expressInfo.route.forEach(item=>{
					item.time = this.formatMonth(item.time)
					item.monDay = item.time.split(' ')[0]
					item.hoursMin = item.time.split(' ')[1]
				})
			}
			this.expressInfo = jsonData.expressInfo
		},
		onUnload() {
			uni.removeStorage({key: `order_${this.orderId}`});
		},
		methods:{
			getExpress(data){
				this.apiUrl.getParcelInfo({data:{
					orderId:this.orderId,
					selfMentionOrderId:this.tihuoId
				}}).then(res=>{
					console.log(res);
					if(res.data.status==1){
						this.expressInfo = res.data.data
						console.log(this.expressInfo)
					}
				})
			},
			getOrderDetail(id){
				if(this.tihuoId){
					this.apiUrl.order_getSelfMentionOrder({
						data: {
							id: id
						}
					}).then(res => {
						if(res.data.status==1){
							this.order = res.data.data;
							this.order.appProductOrderList=this.setImgSize(this.order.appProductOrderList,'300x300')
							this.order.appProductOrderList.forEach(item=>{
								this.totalNum+=Number(item.amout)
							})
							this.getExpress()
						}
					})
				}else{
					this.apiUrl.getOrderDetail({data:{
						orderId:id
					}}).then(res=>{
						if(res.data.status==1){
							this.order = res.data.data;
							this.order.appProductOrderList=this.setImgSize(this.order.appProductOrderList,'300x300')
							this.order.appProductOrderList.forEach(item=>{
								this.totalNum+=Number(item.amout)
							})
							this.getExpress()
							console.log(this.order)
						}
					})
				}

			}
		}
	}
</script>

<style lang="less" scoped>
	.pageBg{
		background: #FFFFFF;
		.black-color{
			font-size:30upx;
			font-family:PingFangSC-Regular;
			font-weight:400;
			color:rgba(51,51,51,1);
		}
		.list-inline{
			width:690upx;
			height:210upx;
			background:linear-gradient(315deg,rgba(0,205,255,1) 0%,rgba(0,129,254,1) 100%);
			border-radius:18upx;
			margin: 12upx 30upx 50upx 30upx;
			box-sizing: border-box;
			padding: 40upx;
			.list-item{
				width:690upx;
				height:210upx;
			}
			.list-img{
				width: 130upx;
				height: 130upx;
				margin-right:30upx;
				.w100{
					width: 130upx;
					height: 130upx;
					overflow: hidden;
					border-radius:8upx;
					border:3upx solid rgba(245,245,245,1);
				}
			}
			.list-name{
				width:443upx;
				height:42upx;
				font-size:30upx;
				font-family:PingFangSC-Regular;
				font-weight:400;
				color:rgba(255,255,255,1);
				line-height:42upx;
				margin: 16upx 0 12upx 0;
				overflow: hidden;
				-o-text-overflow: ellipsis;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 1;
			}
			.list-price{
				width:443upx;
				height:37upx;
				font-size:26upx;
				font-family:PingFangSC-Regular;
				font-weight:400;
				color:rgba(255,255,255,1);
				line-height:37upx;
				opacity: 0.7;
				overflow: hidden;
				-o-text-overflow: ellipsis;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 1;
			}
		}
	}
	.showNum{
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 40upx;
		line-height: 40upx;
		color: white;
		background: rgba(0, 0, 0, .5);
		text-align: center;
	}
.log-item{
	display: flex;
	.log-pd .gray{
		font-size:24upx;
		color:rgba(153,153,153,1);
		height:33upx;
		line-height: 33upx;
		font-family:PingFangSC-Regular;
	}
	.log-pd .fs30{
		height:42upx;
		line-height:42upx;
		margin-bottom: 1upx;
		font-size:26upx;
		font-family:PingFangSC-Medium;
		font-weight:500;
		color:rgba(153,153,153,1);
	}
	.pda{
		.gray{
			font-size:24upx;
			font-family:PingFangSC-Regular;
			font-weight:400;
			color:rgba(51,51,51,1);
			height:33upx;
			line-height: 33upx;
		}
		.fs30{
			height:42upx;
			line-height:42upx;
			margin-bottom: 1upx;
			font-size:30upx;
			font-family:PingFangSC-Medium;
			font-weight:500;
			color:rgba(51,51,51,1);
		}
	}
	>view{
		&:first-child{
			width: 200upx;
			text-align: center;

		}
		&:nth-child(2){
			flex: 2;
			padding: 0upx 30upx 65upx 45upx;
			border-left: 1upx solid #BFBFBF;
			position: relative;
			box-sizing: border-box;
			.lg-circle{
				position: absolute;
				top: 0upx;
				left: 0;
				width: 44upx;
				height: 44upx;
				transform: translateX(-50%);
				.inner{
					width: 20upx;
					height: 20upx;
					border-radius: 50%;
					background: #CECECE;
				}
			}
			.top{
				border-radius: 50%;
				background-color: #00B52D7D;
				.inner{
					background: #00B52D;
				}
			}
		}
	}
}
</style>
