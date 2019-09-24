<template>
	<view class="pageBgW">
		<view class="sign-top relative">
			<view>
				<image src="/static/img/self/sign-banner@2x.png"  mode="widthFix" class="w100"></image>
			</view>
			<view class="absolute colorw w100">
				<view class="fs42 flex-box">
					已签到
				</view>
				<view class="fs30 flex-box">
					福分+20
				</view>
				<view class="recharge-btn flex-box">
					<image src="/static/img/self/sign-btn-chongzhi@2x.png"  mode="widthFix" class="w100" @click="recharge"></image>
				</view>
			</view>
		</view>
		<view class="rule fw500">
			<view class="flex-box relative">
				<view class="absolute flex-box fs40 color3">签到规则</view>
				<view class="line"></view>
			</view>
			<view class="color9 fs30">
				<view class="">
					1、每周要充值过才能签到
				</view>
				<view class="">
					2、每次签到可获得20.0福分
				</view>
				<view class="">
					3、每次签到时间为00:00-23:59
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		methods:{
			recharge(){
				uni.navigateTo({
					url:"/pages/member/recharge/recharge"
				})
			}
		}
	}
</script>

<style lang="scss">
	.sign-top{
		.absolute{
			top: 0;
			left: 0;
			margin: 0 auto;
			height: 330upx;
			padding-top: 70upx;
			color: #FFDEDE;
			.fs42{
				font-size: 60upx;
			}
			.fs30{
				margin: 20upx 0 40upx 0;
			}
		}
		.recharge-btn{
			width: 100%;
			height: 80upx;
			margin: 0 auto;
			.w100{
				width: 280upx;
				height: 80upx;
			}
		}
	}
	
	.rule{
		margin: 0 auto;
		.relative{
			height: 195upx;
			.absolute{
				height: 60upx;
				background: #FFFFFF;
				padding: 0 20upx;
			}
			.line{
				width:676upx;
				height:1upx;
				background:rgba(231,231,231,1);
			}
		}
		.fs30{
			// width: 450upx;
			padding-left: 153upx;
			line-height: 60upx;
			margin: 0 auto;
		}
	}
</style>
