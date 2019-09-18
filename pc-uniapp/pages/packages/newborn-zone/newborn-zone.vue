<template>
	<view class="content ">
		<view class="swiper mg20">
			<swiper :indicator-dots="true" indicator-color="#fcab98" indicator-active-color="white" :autoplay="true" :interval="3000" :duration="1000">
				<swiper-item v-for="(item, index) in swiperList" :key="index">
					<view class="swiper-item"><image :src="item.images" lazy-load="true" mode="widthFix" @tap="goSwiperProduct(item)"></image></view>
				</swiper-item>
			</swiper>
		</view>
		<view class="main ">
			
			<!-- 新人批发区 -->
			<navigator url="/pages/product/product-zone/product-zone?type=7">
				<view class="cdWrap betweenBox background-white mgt20 pd20 gapBorder pdt70" v-if="newcomerWholesales && newcomerWholesales.productList && newcomerWholesales.productList.length">
					<view class="flex">
						<view class="cd-left  ">新人批发</view>
						<view class="flex">
							<view class="cd-middle mgr20">
								<view class="time ">
									<uni-countdown
										class="time"
										font-color="#FFFFFF"
										border-color="white"
										bgr-color="rgba(65,65,65,1)"
										@activeStart="gettingStart"
										@activeOver="wholesalesOver"
										:startTime="newcomerWholesales.proxyStartTime"
										:endTime="newcomerWholesales.proxyEndTime"
										:now="currentTime"
										:hourMin="true"
									></uni-countdown>
								</view>
							</view>
						</view>
					</view>
					<view class="cd-right">
						更多
						<image lazy-load src="/static/img/pubulic_icon_expand@2x.png" mode="widthFix" class="id-ri"></image>
					</view>
				</view>
			</navigator>
			<view class="background-white pdl20 pdr20 pdt20" v-if="newcomerWholesales">
				<view class="spc_item" v-for="(item, index) in newcomerWholesales.productList" :key="index" @tap="goProduct(item)">
					<view class="left relative">
						<image lazy-load :src="item.image" mode="widthFix"></image>
						<view class="sold-out" v-if="(!newcomerWholesales && !item.stock) || (newcomerWholesales && newcomerWholesales.now > newcomerWholesales.proxyStartTime && !item.stock)">
							<view class="out-logo">售罄</view>
						</view>
						<view class="sold-out" v-if="newcomerWholesales && newcomerWholesales.now < newcomerWholesales.proxyStartTime">
							<view class="out-logo unstart white flex-box">
								<view class="fs26">
									下期
									<view class="fs26">爆品</view>
								</view>
							</view>
						</view>
					</view>
					<view class="right colTopBottom">
						<view class="name">{{ item.productname }}</view>
						<view class="">
							<view class=" orange mgb20" v-if="item.productProxyPackageList.length > 1">
								<text>¥</text>
								<text class="price">{{ item.productProxyPackageList[0].wholesalesPrice }}</text>
								<view class="inline">
									<text>~</text>
									<text class="price">{{ item.productProxyPackageList[item.productProxyPackageList.length - 1].wholesalesPrice }}</text>
								</view>
							</view>
							<view class="orange mgb20" v-else>
								<text>¥</text>
								<text class="price">{{ item.price }}</text>
							</view>
							<view class="stock">库存{{ item.stock }}件</view>
						</view>
					</view>
					<view class="btn white flex-box">去抢购</view>
				</view>
			</view>
			<!-- 新人零售区 -->
			<navigator url="/pages/product/product-zone/product-zone?type=6">
				<view class="cdWrap betweenBox background-white pd20 gapBorder pdt70" v-if="newcomerRetails && newcomerRetails.productList && newcomerRetails.productList.length">
					<view class="flex">
						<view class="cd-left mgr20">新人零售</view>
						<view class="">
							<view class="cd-middle ">
								<view class="time">
									<uni-countdown
										class="time"
										font-color="#FFFFFF"
										border-color="white"
										bgr-color="rgba(65,65,65,1)"
										@activeOver="retailsOver"
										:startTime="newcomerRetails.proxyStartTime"
										:endTime="newcomerRetails.saleEndTime"
										:now="currentTime"
										:hourMin="true"
									></uni-countdown>
								</view>
							</view>
						</view>
					</view>
					<view class="cd-right">
						更多
						<image src="/static/img/pubulic_icon_expand@2x.png" mode="widthFix" class="id-ri"></image>
					</view>
				</view>
			</navigator>
			<view class="background-white pdl20 pdr20 pdt20 " v-if="newcomerRetails">
				<view class="spc_item" v-for="(item, index) in newcomerRetails.productList" :key="index" @tap="goProduct(item)">
					<view class="left relative">
						<image lazy-load :src="item.image" mode="widthFix"></image>
						<view class="sold-out" v-if="!item.stock"><view class="out-logo">售罄</view></view>
					</view>
					<view class="right colTopBottom">
						<view class="name">{{ item.productname }}</view>
						<view class="">
							<view class="orange" v-if="item.giveFrozenMoney">
								赠送{{item.giveFrozenMoney}}批发券
							</view>
							<view class=" orange mgb20">
								<text>¥</text>
								<text class="price">{{ item.price }}</text>
							</view>
							
							<view class="stock" v-if="item.type != 0">库存{{ item.stock }}件</view>
							<view class="stock" v-else-if="systemInfo.retailsInventoryHidden == 'false'">库存{{ item.stock }}件</view>
						</view>
					</view>
					<view class="btn white flex-box">去抢购</view>
				</view>
			</view>
			
		</view>
		
		<!-- #ifdef H5 -->
		<a href="http://www.beian.miit.gov.cn" style="text-decoration: none;" v-if="false">
			<view class="fs20 tac background-white pd20 mgt20 title-black">Copyright©版权所有 ICP证：粤ICP备18116847号-2</view>
		</a>
		<!-- #endif -->
	</view>
</template>

<script>
import Notice from '@/components/Notice.vue';
import uniCountdown from '@/components/uni-countdown.vue';
import recommendTitle from '@/components/recommend-title.vue';
import myMixin from '@/common/myMixin.js';
import noData from '@/components/no-data.vue';
import { mapState, mapMutations } from 'vuex';
import {baseUrl} from '@/common/req.js'
// #ifdef H5
const wx = require('weixin-js-sdk');
console.log(wx);
wx.ready(function() {
	wx.updateAppMessageShareData({
		title: '盖世风商城', // 分享标题
		desc: '盖世风商城', // 分享描述
		link: location.origin, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
		imgUrl: '/static/img/logo.png', // 分享图标
		success: function() {
			// 设置成功
			alert(222);
		}
	});
});
// #endif
export default {
	data() {
		return {
			title: 'Hello',
			recommendProduct: null,
			swiperList: null,
			newcomerRetails: null,
			newcomerWholesales: null,
			webUrl: '',
			showWebView: false,
			currentTime: '',
			currentIndex: 0,
			now:'',
			noMoreData:false,
			current:1,
		};
	},
	components: {
		Notice,
		uniCountdown,
		recommendTitle,
		noData
	},
	computed: mapState(['systemInfo']),
	mixins: [myMixin],
	onPullDownRefresh() {
		this.getProduct();
		setTimeout(() => {
			uni.stopPullDownRefresh();
		}, 1000);
	},
	onLoad() {
		this.forwardMiniProgram();
		this.getSwiper();
		this.getProduct();
		this.getNotice();
	},
	onShow() {
		this.getProduct();
		uni.removeStorageSync('backToHomePage'); //order navigator  
		uni.removeStorageSync('paySuccessToHomePage');  
		uni.removeStorageSync('checkingOrder');  
		uni.removeStorageSync('changepsw')
	},
	onShareAppMessage(res) {
		return {
			title: '库存清货首选平台，购物享折扣、寄售获分润、推广赚佣金'
		};
	},
	methods: {
		onReachSortList() {
			this.noMoreData = false;
			this.getSortList();
		},
		retailsOver() {
			this.getProduct();
		},
		wholesalesOver() {
			console.log('over');
			this.getProduct();
		},
		gettingStart() {
			this.getProduct();
		},
		goSwiperProduct(item) {
			if (item.type == 2) {
				uni.navigateTo({
					url: '/pages/product/product-detail?id=' + item.url,
					animationType: 'pop-in',
					animationDuration: 200
				});
			} else if (item.type == 1) {
				uni.navigateTo({
					url: 'webPage/webPage?url=' + item.url
				});
			} else if (item.type == 4) {
				uni.setStorageSync('swiperContent', item.imageText);
				uni.navigateTo({
					url: 'webPage/webPage?richText=true'
				});
			}
		},
		goProduct(item) {
			if(item.type == 1){
				uni.setStorage({
					key:'consignment',
					data:item.id,
					success: (res) => {
						uni.navigateTo({
							url: '/pages/product/product-detail?id=' + item.id,
							animationType: 'pop-in',
							animationDuration: 200
						});
					}
				})
			}else{
				uni.removeStorageSync('consignment'); 
				uni.navigateTo({
					url: '/pages/product/product-detail?id=' + item.id,
					animationType: 'pop-in',
					animationDuration: 200
				});
			}
		},
		getProduct() {
			this.apiUrl
				.getIndexProduct({
					data: {}
				})
				.then(res => {
					if (res.data.status != 1) return;
					if(res.data.now == undefined){
						var nowTime = new Date().getTime();//开始时间
						var diffTime = parseInt(nowTime/1000,10);//得到两个时间差的秒数
						this.now = diffTime;
					}else{
						this.now = res.data.now;
					}
					
					this.currentTime = res.data.now;
					this.recommendProduct = this.setImgSize(res.data.data.recommendProduct, '300x240','remomondImageUrl');
					res.data.data.adList?this.swiperList = res.data.data.adList:'';
					if(res.data.data.newcomerRetails){
						this.newcomerRetails = res.data.data.newcomerRetails[0];
						this.newcomerRetails ? (this.newcomerRetails.productList = this.setImgSize(this.newcomerRetails.productList, '170x170','image')) : '';
					}else{
						this.newcomerRetails = null;
					}
					if (res.data.data.newcomerWholesales) {
						this.newcomerWholesales = null;
						if(res.data.now == undefined){
							var nowTime = new Date().getTime();//开始时间
							var diffTime = parseInt(nowTime/1000,10);//得到两个时间差的秒数
							res.data.data.newcomerWholesales.now = diffTime;
						}else{
							res.data.data.newcomerWholesales.now = res.data.now;
						}
						//批发是否开始
						if(res.data.data.newcomerWholesales.length == 0) return;
						this.newcomerWholesales = res.data.data.newcomerWholesales[0];
						this.newcomerWholesales.productList = this.setImgSize(this.newcomerWholesales.productList, '170x170','image');
					}else{
						this.newcomerWholesales = null;
					}
					
				});
		},
		getSort() {
			this.apiUrl
				.getProductTree({
					data: {
						type: 2
					}
				})
				.then(res => {
					if (res.data.status == 1) {
						let mydata = res.data.data;
						this.bigCateArr = mydata;
						this.current = 1;
						this.noMoreData = false;
						this.getSortList();
					}
				});
		},
		getNotice(data) {
			this.apiUrl
				.getHomeNotice({
					data: {}
				})
				.then(res => {});
		},
		getSwiper() {
			this.apiUrl
				.getSwipe({
					data: {
						locationType: 4
					}
				})
				.then(res => {
					if (res.data.status != 1) return;
				});
		}
	}
};
</script>

<style lang="less" scoped>
.info-coupon{
	.orange{
		display:flex;
		align-items: flex-end;
	}
	.price-coupon{
		display: inline-block;
		height: 30upx;
		width: 30upx;
		line-height: 30upx;
		border: 1upx solid #FC4E29;
		font-weight: 600;
		text-align: center;
		border-radius: 4upx;
		padding: 1upx;
		margin: 0 0 4upx 20upx;
	}
}

/* #ifdef H5 */
uni-swiper {
	height: 350upx !important;
}
.content {
	padding-bottom: 100upx;
}
/* #endif */
/* #ifdef MP-WEIXIN */
swiper {
	height: 350upx;
}
/* #endif */

.swiper2 {
	height: 440upx !important;
}

.recomemnt-item.recomentHight {
	height:auto;
	.orange{
		height: 48upx;
	}
}
.spc_item {
	display: flex;
	padding: 20upx;
	box-shadow: 0upx 4upx 10upx 0upx rgba(222, 222, 222, 0.5);
	border-radius: 10upx;
	border: 1px solid rgba(239, 239, 239, 1);
	position: relative;
	margin-bottom: 20upx;
	.btn {
		position: absolute;
		right: 20upx;
		bottom: 20upx;
		width: 150upx;
		height: 58upx;
		background: rgba(249, 83, 26, 1);
		border-radius: 30px;
	}
	.left {
		width: 220upx;
		height: 220upx;
		margin-right: 20upx;
		image {
			width: 220upx;
			height: 220upx;
			border-radius: 6upx;
		}
	}
	.right {
		.name {
			font-weight: 400;
			color: rgba(51, 51, 51, 1);
			line-height: 42upx;
			letter-spacing: 1px;
			font-size: 30upx;
		}
		.price {
			font-weight: bold;
			font-size: 34upx;
		}
		.stock {
			color: rgba(153, 153, 153, 1);
			font-size: 22upx;
		}
	}
}

uni-image {
	height: auto;
}
.pdt70 {
	padding-top: 70upx;
}
.mgt70 {
	margin-top: 70upx;
}
.priceStyle {
	font-size: 34upx;
	font-weight: bold;
	color: #fc4e29;
}
.scroll-select {
	font-size: 32upx;
	font-weight: 400;
	color: rgba(101, 101, 101, 1);
	margin: 0 20upx;
	display: inline-block;
	height: 60upx;
	line-height: 50upx;
	position: relative;
	&.active {
		font-size: 42upx;
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
		.line {
			display: block;
		}
	}
	.line {
		display: none;
		width: 70upx;
		height: 8upx;
		background: rgba(252, 78, 41, 1);
		border-radius: 5upx;
		position: absolute;
		bottom: -4upx;
		left: 50%;
		transform: translateX(-50%);
	}
}
.id-ri {
	width: 36upx;
}
.scroll-wrap {
	white-space: nowrap;
}
.scroll-title {
	width: 100%;
	white-space: normal;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
	height: 74upx;
	line-height: 37upx;
	margin-bottom: 12upx;
}
.recomemnt-item {
	margin: 20upx;
	display: inline-block;
	width: 300upx;
	height: 560upx;
	position: relative;
	box-shadow: 0px 8upx 24upx 0px rgba(210, 210, 210, 0.5);
	border-radius: 10upx;
	&.sort-type {
		width: 340upx;
		border-radius: 10upx;
		overflow: hidden;
		margin: 0upx 0 10upx 0;
		&:nth-child(2n) {
			margin-left: 10upx;
		}
		.item-img {
			width: 340upx;
			image {
				width: 100%;
				height: 340upx !important;
				border-radius: 0;
			}
		}
	}
	.item-img {
		width: 300upx;
		image {
			width: 100%;
			height: 240upx;
			border-radius: 10upx;
		}
	}
	.item-info {
		padding: 30upx 20upx 12upx 20upx;
	}
}
.scroll-item {
	margin: 20upx;
	display: inline-block;
	width: 550upx;
	position: relative;
	.item-img {
		width: 550upx;
		image {
			width: 100%;
			border-radius: 10upx;
		}
	}
	.item-info {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
	}
}
.cdWrap {
	display: flex;
	margin-top: 50upx;
	.cd-left {
		font-size: 40upx;
		width: 180upx;
		font-size: 42upx;
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
	}
	.cd-middle {
		flex: 2;
		display: flex;
		align-items: center;

		.time {
		}
	}

	.cd-right {
		display: flex;
		align-items: center;
		color: rgba(153, 153, 153, 1);
		font-size: 26upx;

		image {
			width: 12upx;
			margin-left: 10upx;
		}
	}
}

.swiper {
	border-radius: 20upx;
	overflow: hidden;
	.swiper-item{
		border-radius: 20upx;
		overflow: hidden;
	}
	swiper-item{
		border-radius: 20upx;
		overflow: hidden;
	}
	image {
		width: 100%;
		height: auto;
	}
}
.redPoint {
	position: absolute;
	left: 145upx;
	top: -2upx;
	width: 12upx;
	height: 12upx;
	background: #f62626;
	border-radius: 50%;
	z-index: 10;
}

.index_top {
	margin-bottom: 30upx;
	image {
		width: 60upx;
	}
	.logo {
		width: 276upx;
	}
	.wd_border {
		border: 2upx dashed rgba(51, 51, 51, 1);
	}
}

.new_online {
	height: 440upx;
	display: flex;
	justify-content: space-between;
	margin: 20upx;
	.left {
		width: 460upx;
		height: 440upx;
		margin-right: 20upx;
		border-radius: 10upx;
		overflow: hidden;
		position: relative;
		image {
			width: 100%;
			height: 440upx !important;
		}
		.name {
			position: absolute;
			bottom: 0;
			width: 100%;
			padding: 20upx 0;
			background: rgba(0, 0, 0, 0.3);
		}
	}
	.right {
		width: 210upx;
		image {
			height: 210upx !important;
		}
	}
}
</style>
