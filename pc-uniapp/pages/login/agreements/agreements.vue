<template>
	<view class="pageBg">
		<view class="pd20" v-html="agreement">

		</view>
		<view class="flex-box">
			<view class="login-btn" @tap="goBack" v-if="type==1">
				{{i18n.agree_return}}
			</view>
			<view class="login-btn" @tap="goBack" v-if="type==3">
				{{i18n.agree_withdrawal}}
			</view>
			<view class="login-btn" @tap="goBack" v-if="type==6">
				{{i18n.agree_payment}}
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				agreement: null,
				type: 1
			};
		},
		computed : {
			// 多语言
			i18n () {
				return this.$t('login')
			}
		},
		onLoad(e) {
			this.type = e.type;
			if (this.type == 6) {
				uni.setNavigationBarTitle({
					title: this.i18n.payment_agree
				});
			}
			if (this.type == 5) {
				uni.setNavigationBarTitle({
					title: this.i18n.wholesale_agreement
				});
			}
			if (this.type == 4) {
				uni.setNavigationBarTitle({
					title: this.i18n.retail_agreement
				});
			}
			if (this.type == 3) {
				uni.setNavigationBarTitle({
					title: this.i18n.withdrawal_agreement
				});
			}
			if (this.type == 2) {
				uni.setNavigationBarTitle({
					title:  this.i18n.consignment_agree
				});
			}
			this.getAgreement()
		},
		methods: {
			goBack() {
				if (this.type == 1) {
					uni.setStorageSync('agreeRegister',true)
					uni.navigateBack();
				}
				if (this.type == 6) {
					uni.navigateTo({
						url: '../../order/submitOrder/submitOrder?agree=true',
						animationType: 'pop-in',
						animationDuration: 200
					})
				}
				if (this.type == 3) {
					uni.setStorageSync('agreeWidthDraw',true)
					uni.navigateBack();
				}
			},
			getAgreement() {

				this.apiUrl.getRegisterAgreement({
						data: {
							type: this.type
						}
					})
					.then(res => {
						res.data.status == 1 ? this.agreement = res.data.data.content : ''
					})
			}
		},

	}
</script>

<style lang="less">
	.login-btn {
		width: 650upx;
		height: 80upx;
		background-image: linear-gradient(90deg,
			#53b1fa 0%,
			#388ceb 100%);
		border-radius: 40upx;
		color: white;
		line-height: 80upx;
		text-align: center;
		margin-top: 40upx;
		font-size: 36upx;
	}
</style>
