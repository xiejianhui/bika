<template>
	<view>
		<view class="rs_circle flex-box">
			<image src="/static/img/success-tickets.png" mode="widthFix"></image>
		</view>
		<view class="tac tips">
			恭喜您成功注册盖世风商城账号，请关注我们的公众号【盖世风商城】或下载盖世风商城APP进行登录使用
		</view>
		<view class="tac">
			<image src="/static/img/gsfQr.jpg" mode="widthFix" class="xlgQr"></image>
			<view class="">
				长按二维码，关注公众号
			</view>
		</view>
		<a href="http://dl.gaishishop.com/dl-page/index.html">
			<view class="mgt20 flex-box white background-blue pdt20 pdb20 fs30 qs_btn">
				下载盖世风商城
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
