<template>
	<view class="pageBg">
		<navigator url="../change-psw/change-psw">
			<view class="background-white betweenBox bdb mgt10 fs32">
				修改登录密码
				<image src="/static/img/pubulic_icon_expand@2x.png" class="ps-icon" mode="widthFix"></image>
			</view>
		</navigator>
		<navigator url="../change-safepsw/change-safepsw">
			<view class="background-white betweenBox bdb fs32">
				修改支付密码
				<image src="/static/img/pubulic_icon_expand@2x.png" class="ps-icon" mode="widthFix"></image>
			</view>
		</navigator>
		<!-- #ifdef APP-PLUS -->
		<view class="clientversion">
			<view class="gray pdb20">
				<view class="pdb20 flex-box fs22">
					当前版本号: <text class="mgl10">{{version}}</text>
				</view>
				<view class="pdb20 flex-box fs22">
					Copyright@2019  广东盖世风互联网科技有限公司  版权所有
				</view>
			</view>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	export default {
		data() {
			return {
				version:201909091900,
			};
		},
		computed: mapState(['memberInfo']),
		onLoad() {
			this.version = this.formatMin(new Date().getTime());
		},
		onShow () {
			uni.getStorage({
				key:'changepsw',
				success: (res) => {
				},
				fail: (res) => {
					if (!this.memberInfo) uni.redirectTo({url: '/pages/login/login'})
				}
			})	
		}
	}
</script>

<style lang="less">
.pageBg{
	background:rgba(255,255,255,1);
	.fs32{
		margin-left: 30upx;
		padding: 37upx 30upx 37upx 0;
	}
}
.ps-icon{
	width: 16upx;
}
.clientversion{
	box-sizing: border-box;
	position: absolute;
	bottom: 0;
	left: 0;
	width:100%;
	display: flex;
	align-items: flex-end;
	height: 100%;
	.gray{
		width: 100%;
	}
	.pdb20{
		width: 100%;
	}
	.mgl10{
		margin-left: 10upx;
	}
}
.flex-box{
	align-items: flex-end;
}
</style>
