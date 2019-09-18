<template>
	<view class="colTopBottom pageBg">
		<view class="" style="padding-top: 100px;">
			<view class="ps-circle flex-box">
				<view class="flex-box">
					<image src="../../../static/img/success-ticket.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="tac fs30 mgb20 mgt20 title-black">
				寄售成功
			</view>
		</view>

		<view class="" style="margin-bottom: 80px;">
			<button open-type="share" class="blue-btn mgt40 primary-background"
							:data-id="order.id" :data-image="order.goodsImage"
							:data-assist="order.assistSwitch">
				我要加速
			</button>
			<view class="blue-btn mgt40" style="background: #fff;color: #000" @click="goBack">
				返回
			</view>
			<!--<navigator :url="'../order?id='+order.id">-->
				<!--<view class="blue-btn mgt40 primary-background" v-if="order.type!=1">-->
					<!--查看订单-->
				<!--</view>-->
			<!--</navigator>-->

			<!--<navigator url="/pages/index/index" open-type='switchTab' v-if="order.type!=1">-->
				<!--<view class="white-btn mgt40 primary-border">-->
					<!--去首页-->
				<!--</view>-->
			<!--</navigator>-->
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				order: null
			};
		},
		onLoad(options) {
			this.order = {
				id: options.id,
				goodsImage: options.goodsImage,
				assistSwitch: options.assistSwitch
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
			
			// this.getProductType();
		},
		methods: {
			goBack() {
				uni.navigateBack({delta: 2})
			}
			// getProductType() {
			// 	this.order = uni.getStorageSync('payingOrder');
			// }
		},
		onShareAppMessage(options) {
			const vm = this
			const hasAssist = options.target.dataset.assist == 1;
			const shareId = options.target.dataset.id;
			const goodsImage = options.target.dataset.image;
			vm.apiUrl.orderShare({data: {goodsConsignmentId: shareId}})

			return {
				title: '库存清货首选平台，购物享折扣、寄售获分润、推广赚佣金',
				imageUrl: goodsImage,
				path: hasAssist? '/pages/share/expedite?id=' + shareId : '/pages/index/index',
				// success() {
				// 	vm.apiUrl.orderShare({goodsConsignmentId: shareId})
				// }
			};
		}
	}
</script>

<style lang="less" scoped>
	.ps-circle {
		>view {
			width: 150upx;
			height: 150upx;
			border-radius: 50%;
			border: 8upx solid #388ceb;
			margin-top: 40upx;

			image {
				width: 94upx;
			}
		}
	}
</style>
