<template>
	<view class="pageBgW">
		<view class="purshase box-b">
			<view class="purshase-item flex relative">
				<view class="purshase-img mgr30">
					<image src="http://gsm-img.vzmapp.cn/upload/goods/2019/10-28/29600161_r400x400p.png" mode="widthFix" class="w100"></image>
				</view>
				<view class="purshase-info">
					安心乐意礼包精美包装中秋送礼必备 送长辈必备
				</view>
				<view class="primary-img absolute">
					<image src="/static/img/moudel/purchase-zhongjiang.png" mode="widthFix" class="w100" v-if="1==1"></image>
					<image src="/static/img/moudel/purchase-weizhongjiang.png" mode="widthFix" class="w100" v-if="1==2"></image>
				</view>
			</view>
			<view class="detail-box fs26">
				<view class="gray bdb flex-align detail">
					商品期数：44454
				</view>
				<view class="gray bdb flex-align detail">
					总需：RM145
				</view>
				<view class="gray bdb flex-align detail">
					本次参与：<text class="orange">124</text>人次
				</view>
				<view class="gray bdb flex-align detail">
					人次订单编号：2036598
				</view>
				<view class="gray bdb flex-align detail">
					下单时间：2019/9/23 13:40:09
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="less" scoped>
	.purshase{
		padding: 43upx 40upx 43upx 37upx;
		.detail-box{
			margin: 36upx 2upx 0 2upx;
			.detail{
				font-size: 26upx;
				padding: 23upx 0;
			}
		}
	}
	.purshase-item{
		width: 100%;
		height: 283upx;
		.purshase-info{
			width:358upx;
			height:112upx;
			font-size:30upx;
			font-family:PingFang SC;
			font-weight:500;
			color:rgba(51,51,51,1);
			line-height:56upx;
			margin-bottom: 24upx;
			white-space: normal;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
		}
		.purshase-img{
			width: 283upx;
			height: 283upx !important;
			image{
				width: 283upx;
				height: 283upx !important;
			}
		}
		.primary-img{
			top: -8upx;
			left: -8upx;
			z-index: 1;
			width: 100upx;
			height: 113upx;
			image{
				width: 100upx;
				height: 113upx;
			}
		}
	}
</style>
