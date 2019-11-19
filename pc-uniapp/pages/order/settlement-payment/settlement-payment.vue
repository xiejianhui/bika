<template>
	<view class="pageBgW">
		<view class="settle-box">
			<view class="betweenBox bdb">
				<view class="">
					<view class="title-black fs34 color3">
						第2440期  
					</view>
					<view class="gray fs26">jiagn san</view>
				</view>
				<view class="fs40 orange">
					65.00
					<text class="fs28">RM</text>
				</view>
			</view>
			<view class="betweenBox gray">
				<view class="fs24">
					<text class="">福分余额: </text>
					<text class="color6">400</text>
				</view>
				<view class="fs24 flex-align">
					<view class="">BP</view>
					<view class="mgl10">100</view>
					<view class="mg10">=</view>
					<view class="color6 mgr20"> RM1</view>
					<switch @change="switchChange" />
				</view>
			</view>
		</view>
		<view class="bdb20"></view>
		<view class="acoumt">
			<view class="betweenBox color6">
				<view class="fs30">
					商品金额
				</view>
				<view class="fs34 flex-align">
					<view class="gray mgr10 fs34">RM</view>59.00
				</view>
			</view>
			<view class="betweenBox color6">
				<view class="fs30">
					福分抵
				</view>
				<view class="fs34 flex-align">
					<view class="gray mgr10 fs34">RM</view>2.00
				</view>
			</view>
		</view>
		<view class="total orange fs30 tar">
			合计: <text class="fs40">200.0</text>RM
		</view>
		<view class="orange-btn" @tap="pay">立即支付</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			switchChange(e) {
				console.log(e.detail.value)
			},
			pay(){
				console.log('立即支付')
			},
		}
	}
</script>

<style lang="less" scoped>
	.settle-box{
		padding: 0 30upx;
		margin-top: 30upx;
		.title-black{
			height:46upx;
			font-size:34upx;
			font-family:PingFang SC;
			font-weight:500;
			color:rgba(51,51,51,1);
			line-height:46upx;
			margin-bottom: 14upx;
		}
		.betweenBox:nth-child(1){
			padding: 35upx 0;
			.fs40{
				margin-top: 8upx;
			}
		}
		.betweenBox:nth-child(2){
			height: 100upx;
			padding-bottom: 10upx;
			box-sizing: border-box;
		}
		.mg10{
			margin:  0 8upx;
		}
		.mgl10{
			margin-left: 8upx;
		}
		.bdb20{
			border-bottom: 30upx solid #F7F7F7;
		}
	}
	
	.acoumt{
		margin: 34upx 0 62upx;
		padding: 0 30upx;
		.betweenBox{
			height:60upx;
			font-size:30upx;
			font-family:PingFang SC;
			font-weight:500;
			color:rgba(102,102,102,1);
			line-height:60upx;
			.mgr10{
				margin-right: 8upx;
			}
		}
		
	}
	
	.total{
		padding: 0 30upx;
	}
	
	.orange-btn{
		width:678upx;
		height:80upx;
		background:rgba(254,106,114,1);
		border-radius:40upx;
		margin: 98upx auto 40upx;
	}

</style>
