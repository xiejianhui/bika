<template>
	<view>
		<view class="rs_circle flex-box">
			<image src="/static/img/success-tickets.png" mode="widthFix"></image>
		</view>
		<view class="tac tips">
			{{i18n.congratulations_successful}}
		</view>
		<view class="tac">
			<image src="/static/img/gsfQr.jpg" mode="widthFix" class="xlgQr"></image>
			<view class="">
				{{i18n.long_Press}}
			</view>
		</view>
		<a href="http://dl.gaishishop.com/dl-page/index.html">
			<view class="mgt20 flex-box white background-blue pdt20 pdb20 fs30 qs_btn">
				{{i18n.download_mall}}
			</view>
		</a>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		computed : {
			// 多语言
			i18n () {
				return this.$t('login')
			}
		},
		onLoad() {
			uni.setStorageSync('fromRegisterUccess','true')
		}
	}
</script>

<style lang="less" scoped>
	.qs_btn{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
	}
	.xlgQr{
		width: 300upx;
	}
	.tips{
		width: 60%;
		margin: 40upx auto;
		font-weight: bold;
	}
.rs_circle{
	width: 200upx;
	height: 200upx;
	border-radius: 50%;
	background: #FC4E29;
	margin: 60upx auto;
	image{
		width: 60%;
	}
}
.background-blue{
	background: #FC4E29;
}
</style>
