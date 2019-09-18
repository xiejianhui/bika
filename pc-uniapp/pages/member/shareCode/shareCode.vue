<template>
	<view class="pageBg relative sc_wrap">
		<view class="wrap_w" style="z-index: 199;background-color: #f5f5f5;" @tap="previewImage">
			<view class="warp">
				<view>
					<image class="bg" v-if="staticImgResource" :src="staticImgResource+'common/picshare1.png'" ></image>
				</view>
				<view class="info">
					<image class="sc_logo" mode="widthFix"  src="/static/img/WechatIMG103.png" ></image>
					<text>{{'ID:' + shareData.autoId}}</text>
					<view class="code">
						<view class="line">

						</view>
						<image class="" :src="shareData.qrCode"></image>
						<view class="gray tac">

						</view>
					</view>

				</view>

			</view>
		</view>
		<view class="wrap_w" style="top: -2000px;">
			<canvas  canvas-id="shareImg" :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }" ></canvas>
		</view>

	</view>
</template>

<script>
import { baseUrl,staticImgResource } from '@/common/req.js';
import {mapState,mapMutations} from 'vuex'
export default {
	data() {
		return {
			shareData: {},
			canvasWidth: '300',
			canvasHeight: '400',
			preImage: null,
			staticImgResource:staticImgResource
		};
	},
	computed: mapState([
		'memberInfo'
	]),
	onPullDownRefresh() {
		this.getCode();
		setTimeout(() => {
			uni.stopPullDownRefresh();
		}, 1000);
	},
	onLoad() {
		if (!this.memberInfo) uni.redirectTo({url: '/pages/login/login'})
		// this.bg = baseUrl + 'common/background.png';
		this.getCode();
		// this.forwardMiniProgram();
	},
	// onShareAppMessage(res) {
	// 	return {
	// 		title: this.shareData.userName + '的分享码',
	// 		imageUrl: this.shareData.qrCode
	// 	};
	// },
	methods: {
		previewImage() {
			// #ifdef MP-WEIXIN || APP-PLUS
			uni.previewImage({
				current: [this.preImage], // 当前显示图片的http链接
				urls: [this.preImage] // 需要预览的图片http链接列表
			});
			// #endif
		},
		shareCartImg() {
			let that = this;
			wx.getSystemInfo({
				success: function(res) {
					that.canvasWidth = res.windowWidth*2;
					that.canvasHeight = res.windowHeight*2;
				}
			});
			let imageUrl = this.staticImgResource+'common/picshare1.png';
			console.log(imageUrl);
			uni.getImageInfo({
				src: imageUrl, //服务器返回的图片地址
				success: function(res) {
					//res.path是网络图片的本地地址
					let proImagePath = res.path;
					// 画布
					const ctx = uni.createCanvasContext('shareImg');
					ctx.setFillStyle('white');
					ctx.fillRect(0, 0, that.canvasWidth, that.canvasHeight);
					ctx.drawImage(proImagePath, (that.canvasWidth - 600) / 2, 30, 600, 780);
					ctx.drawImage('/static/img/WechatIMG103.png', 80, 900, 240, 54);

					ctx.setFillStyle('black');
					ctx.setFontSize(30);
					ctx.fillText('ID:' + that.shareData.autoId, 84, 1000);
					// ctx.fillText('用户扫描右侧二维码注册', 84, 1000);
					// ctx.drawImage(that.shareData.qrCode, (that.canvasWidth - 100) / 2, 460, 90, 90)
					uni.getImageInfo({
						src: that.shareData.qrCode,
						success: function(data) {
							ctx.setFillStyle('white');
							ctx.drawImage(data.path, that.canvasWidth-100-160, 840, 180, 180);
							ctx.moveTo(that.canvasWidth-100-200, 840)
							ctx.lineTo(that.canvasWidth-100-200, 1020)
							ctx.stroke()
							ctx.draw(true);
							setTimeout(function() {
								uni.canvasToTempFilePath({
									x: 0,
									y: 0,
									width: that.canvasWidth,
									height: that.canvasHeight,
									destWidth: that.canvasWidth,
									destHeight: that.canvasHeight,
									canvasId: 'shareImg',
									success: function(res) {
										console.log(res);
										that.preImage = res.tempFilePath;
									},
									fail: function(res) {
										console.log(res);
									}
								});
							}, 200);
						}
					});
				},
				fail: function(res) {
					//失败回调
				}
			});
		},
		getCode() {
			uni.showLoading({
				title:'生成中，请稍后'
			})
			this.apiUrl.getShareCode({ data: {} }).then(res => {
				uni.hideLoading();
				if (res.data.status == 1) {
					this.shareData = res.data.data;
					// #ifdef MP-WEIXIN
					this.shareCartImg();
					// #endif
					// 获取分享图
					// #ifdef APP-PLUS
					this.getGraph();
					// #endif
				}
			});
		},
		drawImg() {},
		getGraph() {
			let data = {
				memberId:this.memberInfo.id,
			};
			this.apiUrl
				.getShareGraph({
					data
				})
				.then(res => {
					uni.hideLoading();
					if (res.data.status == 1) {
						this.preImage = res.data.data.sharePic;
					}
				});
		},
	}
};
</script>

<style lang="less" scoped>
.sc_wrap{
	overflow: hidden;
	height: 100vh;
}
.notice{
	position: absolute;
	bottom: 10%;
	left: 50%;
	transform: translateX(-50%);
}
.wrap_w{
	// position: absolute;
	left: 0;
	top: 0px;
	padding-top: 40upx;
	width: 100%;
	min-height: 100vh;
}
.warp {
	width: 600upx;
	background: rgba(255, 255, 255, 1);
	border-radius: 30upx;
	overflow: hidden;
	margin: 0 auto 0;
	padding-bottom: 40upx;
}
.bg {
	width: 600upx;
	height: 780upx;
	display: block;
}
.info {
	padding: 45upx 10upx;
	height: 100upx;
	position: relative;
	.line{
		position: absolute;
		top: 20upx;
		right: 240upx;
		height: 180upx;
		border-left: 1px solid #ccc;
	}
	.code {
		position: absolute;
		top: 0;
		right: 10upx;
		padding: 20upx;
		border-radius: 20upx;
		background: white;
		image{
			width: 180upx;
			height: 180upx;
		}
	}
	text {
		position: relative;
		top: 10upx;
		display: block;
		// margin-left: 30upx;
		color: #656565;
		font-size: 28upx;
		line-height: 40upx;
		width: 340rpx;
		text-align: center;
	}
}
.sc_logo{
	width: 240upx;
	height: auto;
	margin-left: 40upx;
	margin-top: 30upx;
}
</style>
