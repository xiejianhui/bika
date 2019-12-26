<template>
	<view class="content ">
		<view class="relative">
			<view class="w100">
				<image src="/static/img/index/img_home_bg@2x.png"  mode="widthFix" class="w100"></image>
			</view>
			<view class="search-box absolute flex">
				<view class="search" @tap="goSearch">
					<view class="search-icon absolute">
						<image src="/static/img/index/icon_home_search@2x.png"  mode="widthFix" class="w100"></image>
					</view>
					<input type="text" confirm-type="search" :placeholder="i18n.searchEnter" placeholder-style="color: #C8C8C8;"/>
				</view>
				<view class="share-icon" @tap="goShare">
					<image src="/static/img/index/ic_hangqing_fenxiang@2x.png"  mode="widthFix" class="w100"></image>
				</view>
			</view>
			<view class="swiper-box absolute">
				<view class="swiper mg30">
					<swiper :indicator-dots="true" indicator-color="#fcab98" indicator-active-color="white" :autoplay="true" :interval="3000" :duration="1000">
						<swiper-item v-for="(item, index) in swiperList" :key="index">
							<view class="swiper-item"><image :src="item.images" lazy-load="true" mode="widthFix" @tap="goSwiperProduct(item)"></image></view>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>
		
		<!-- 功能 -->
		<view class="main ">
			<!-- 公告 -->
			<view class="background-white notice-box" v-if="noteList.length">
				<view class="w100" @tap="goMessage">
					<Notice :noteList="noteList"></Notice>
				</view>
			</view>
			<view class="zone background-white">
				<view class="item" @tap="goProductList(0)">
					<view class="pic"><image src="/static/img/index/icon_home_czye@2x.png" mode="widthFix"></image></view>
					<view class="name fs24 color3 flex-box">{{i18n.balanceRecharge}}</view>
				</view>
				<view class="item" @tap="goProductList(1)">
					<view class="pic"><image src="/static/img/index/icon_home_sd@2x.png" mode="widthFix"></image></view>
					<view class="name fs24 color3 flex-box">{{i18n.sunOrder}}</view>
				</view>
				<view class="item" @tap="goProductList(2)">
					<view class="pic"><image src="/static/img/index/icon_home_fxzq@2x.png" mode="widthFix"></image></view>
					<view class="name fs24 color3 flex-box">{{i18n.moneyShare}}</view>
				</view>
				<view class="item" @tap="goProductList(3)">
					<view class="pic"><image src="/static/img/index/icon_home_qd@2x.png" mode="widthFix"></image></view>
					<view class="name fs24 color3 flex-box">{{i18n.inSign}}</view>
				</view>
				<view class="item" @tap="goProductList(3)">
					<view class="pic"><image src="/static/img/index/icon_home_xszy@2x.png" mode="widthFix"></image></view>
					<view class="name fs24 color3 flex-box">{{i18n.guide}}</view>
				</view>
			</view>

			<!-- 最新揭晓 -->
			<view class="cdWrap betweenBox background-white bdb" v-if="hotProductList && hotProductList.length" @tap="toUnveiled">
				<view class="flex">
					<view class="cd-left color3 fs30 flex-align">
						<view class="line"></view>{{i18n.announcementLatest}}
					</view>
				</view>
				<view class="cd-right">
					<image lazy-load src="/static/img/index/icon_news_more@2x.png" mode="widthFix" class="id-ri"></image>
				</view>
			</view>
			<scroll-view scroll-x class="scroll-wrap " v-if="hotProductList">
				<view class="recomemnt-item recomentHight" v-for="(item, index) in hotProductList" :key="index" @tap="goProduct(item)">
					<view class="item-info" v-if="false">
						<view class="scroll-title fs26 color3 flex-box">{{ item.productname }}</view>
						<view class="fs28 fw500 flex-box mgt10 mgb20">
							<view class="flex-box orange">
								张靓颖
							</view>
						</view>
					</view>
					<view class="item-info" v-else>
						<view class="scroll-title fs26 color3 flex-box">{{i18n.countdown}}</view>
						<view class="fs28 fw500 flex-box mgt10 mgb20 primary-color">
							<view class="flex-box">
								<uni-countdown
									class="time"
									font-color="#FFFFFF"
									border-color="#FE6A72"
									bgr-color="#FE6A72"
									@activeOver="retailOver"
									:startTime="retail.proxyStartTime"
									:endTime="retail.saleEndTime"
									:now="currentTime"
								></uni-countdown>
							</view>
						</view>
					</view>
					<view class="item-img">
						<image lazy-load :src="item.image" mode="widthFix"></image>
						<view class="sold-out" v-if="!item.stock"><view class="out-logo">{{i18n.sell_out}}</view></view>
					</view>
				</view>
			</scroll-view>
			
			<navigator url="../product/product-zone/product-zone?type=1">
				<view class="cdWrap betweenBox background-white bdb" v-if="sortProductList && sortProductList.length">
					<view class="flex">
						<view class="cd-left color3 fs30 flex-align">
							<view class="line"></view>{{i18n.featuredGoods}}
						</view>
					</view>
					<view class="cd-right">
						<image lazy-load src="/static/img/index/icon_news_more@2x.png" mode="widthFix" class="id-ri"></image>
					</view>
				</view>
			</navigator>
			<view class="pdl30 mgt30">
				<no-data v-if="sortProductList && !sortProductList.length"></no-data>
				<view class="recomemnt-item sort-type" v-for="(item, index) in sortProductList" :key="index">
					<view class="item-img">
						<image lazy-load :src="item.image" mode="widthFix" @tap="goProduct(item)"></image>
					</view>
					<view class="item-info info-coupon">
						<view class="scroll-title fw500 fs30 color3 mgb10">{{ item.productname }}</view>
						<view class="orange fs30 fw400 mgb20">
							<text class="color9 mgr20">{{i18n.value}}</text>
							<text class="">￥{{ item.price }}</text>
						</view>
						<!-- <progress backgroundColor="#D8D8D8" activeColor="##FE6A72" :percent="item.percent" active style='border-radius: 10upx;overflow: hidden;' /> -->
						<progress backgroundColor="#D8D8D8" activeColor="#FE6A72" percent="60" active style='border-radius: 10upx;overflow: hidden;' />
						<view class="betweenBox mgt30">
							<view class="flex-box orange" @tap="goProduct(item)">
								{{i18n.involvedGet}}
							</view>
							<view class="shopping_normal" v-if="true">
								<image lazy-load src="/static/img/index/shopping_normal@2x.png" mode="widthFix"></image>
							</view>
							<view class="shopping_normal" v-else>
								<image lazy-load src="/static/img/index/shopping_press@2x.png" mode="widthFix"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- #ifdef H5 -->
			<a href="http://www.beian.miit.gov.cn" style="text-decoration: none;" v-if="false">
				<view class="fs20 tac background-white pd20 mgt20 title-black">{{i18n.Copyright}}</view>
			</a>
			<!-- #endif -->
		</view>
	</view>
</template>

<script>
import Notice from '@/components/Notice.vue';
import uniCountdown from '@/components/uni-countdown.vue';
import recommendTitle from '@/components/recommend-title.vue';
import myMixin from '../../common/myMixin.js';
import noData from '@/components/no-data.vue';
import { mapState, mapMutations } from 'vuex';
import {baseUrl} from '@/common/req.js'
// #ifdef H5
const wx = require('weixin-js-sdk');
console.log(wx);
let that = this;
wx.ready(function() {
	wx.updateAppMessageShareData({
		title: that.i18n.geshifeng_mall, // 分享标题
		desc: that.i18n.geshifeng_mall, // 分享描述
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
			newProductList: null,
			recommendProduct: null,
			hotProductList: null,
			swiperList: null,
			noteList: [],
			middelAdList: null,
			webUrl: '',
			showWebView: false,
			currentTime: '',
			bigCateArr: null,
			currentIndex: 0,
			sortProductList: [],
			hideLogo:true,
			now:'',
			noMoreData:false,
			current:1,
			
			retail: null,
		};
	},
	components: {
		Notice,
		uniCountdown,
		recommendTitle,
		noData
	},
	computed: {
		...mapState(['systemInfo']),
		// 多语言
		i18n () {
			return this.$t('index')  
		}  
	},
	mixins: [myMixin],
	onPullDownRefresh() {
		this.getProduct();
		this.checkNewMessage();
		setTimeout(() => {
			uni.stopPullDownRefresh();
		}, 1000);
	},
	onLoad() {
		this.forwardMiniProgram();
		this.getSwiper();
		this.getProduct();
		this.getNotice();
		this.checkNewMessage();
		this.getSort();
		
		if (baseUrl.indexOf('mg.gaishishop')!=-1) {
			// TODO
			this.hideLogo = false;
		}	
	},
	onShow() {
		uni.setNavigationBarTitle({
			title:this.$t('tabs.home')
		});
		this.getProduct();
		this.checkNewMessage();
		uni.removeStorageSync('backToHomePage'); //order navigator  
		uni.removeStorageSync('paySuccessToHomePage');  
		uni.removeStorageSync('checkingOrder');  
		uni.removeStorageSync('changepsw')	
	},
	onShareAppMessage(res) {
		return {
			title: this.i18n.shopping_discount,
		};
	},
	onReachBottom() {
		if(this.sortProductList.length == 0) return;
		if(this.noMoreData){
			uni.showToast({
				title:this.$t('tips').tips,
				icon:'none',
				duration:1500
			});
			return
		}
		this.onReachSortList()
	},
	methods: {
		toUnveiled(){
			uni.switchTab({
				url:'/pages/packages/unveiled/unveiled?type=1'
			})
		},
		onReachSortList() {
			this.noMoreData = false;
			this.getSortList();
		},
		changeSort(index) {
			this.currentIndex = index;
			this.sortProductList = [];
			this.current = 1;
			this.noMoreData = false;
			this.getSortList();
		},
		getSortList() {
			let data = {
				type: 2,
				current: this.current,
				bigCategory: this.bigCateArr[this.currentIndex].code
			};
			this.apiUrl
				.getNormalProduct({
					data
				})
				.then(res => {
					if (res.data.status == 1) {
						if (res.data.data.pageList.length) {
							//列表是否加载完提示
							if(res.data.data.pages==this.current){
								this.noMoreData = true;
							}
							let arr = res.data.data.pageList;
							arr = this.setImgSize(arr, '350x350','image');
							this.sortProductList = (this.sortProductList || []).concat(arr);
						}
						this.current+=1;
					}
				});
		},
		gettingStart() {
			// setTimeout(() => {
			// 	this.getProduct();
			// }, 1000);
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
		goShare(options){
			const vm = this
			// const goodsImage = options.target.dataset.image;
			// const shareId = options.target.dataset.id;
			// vm.apiUrl.orderShare({data: {goodsConsignmentId: shareId}})
			
			return {
				title: this.i18n.shareIt,
				// imageUrl: goodsImage,
				path: '/pages/index/index',
				// success() {
				// 	vm.apiUrl.orderShare({goodsConsignmentId: shareId})
				// }
			};
		},
		goSearch() {
			uni.navigateTo({
				url: '../search/search'
			});
		},
		goProductList(type) {
			if(type == 0){
				uni.navigateTo({
					url: '/pages/member/recharge-detail/recharge-detail?type=' + type
				});
			}else if(type == 1){
				uni.navigateTo({
					url: '/pages/packages/drying-list/drying-list?type=' + type
				});
			}else if(type == 2){
				uni.navigateTo({
					url: '/pages/member/share-earn/share-earn?type=' + type
				});
				
			}else if(type == 3){
				uni.navigateTo({
					url: '/pages/member/sign-in/sign-in?type=' + type
				});
				
			}else if(type == 4){
				uni.navigateTo({
					url: '/pages/member/sign-in/sign-in?type=' + type
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
		goMessage() {
			uni.navigateTo({
				url: '../member/infomation/info-center'
			});
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
					let newProductListArr = res.data.data.newProductList;
					newProductListArr.forEach(item => {
						item.remomondImageUrl ? delete item.remomondImageUrl : '';
					});
					this.newProductList = this.setImgSize(newProductListArr, '550x400');
					res.data.data.hotProductList&&res.data.data.hotProductList.length?this.hotProductList = this.setImgSize(res.data.data.hotProductList, '500x500','image'):'';
					res.data.data.noticeList?this.noteList = res.data.data.noticeList:'';
					
					//寄售
					if(res.data.data.retail){
						this.retail = res.data.data.retail;
						this.retail ? (this.retail.productList = this.setImgSize(this.retail.productList, '170x170','image')) : '';
					}else{
						this.retail = null;
					}
					
					this.middelAdList = res.data.data.middelAdList;
					this.middelAdList = this.setImgSize(this.middelAdList, '750x200','images');
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
						locationType: 1
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
.search-box {
	top: 0;
	left: 0;
	height: 64upx;
	margin: 28upx 0 31upx 0;
	padding: 0 30upx;
	.search {
		display: inline-block;
		width: 620upx;
		height: 64upx;
		border-radius: 32upx;
		overflow: hidden;
		background: #FFFFFF;
		.search-icon{
			top: 10upx;
			left: 49upx;
			height: 44upx;
			width: 44upx;
			image{
				height: 44upx;
				width: 44upx;
			}
		}
		input {
			margin-left: 63upx;
			padding-left: 15upx;
			background: #FFFFFF;
			height: 64upx;
			line-height: 64upx;
			border-radius: 32upx;
			font-size: 28upx;
		}
	}
	.share-icon{
		width: 48upx;
		height: 48upx;
		margin : 6upx 0 0 22upx;
		image{
			width: 48upx;
			height: 48upx;
		}
	}
	
}
.swiper-box{
	top: 93upx;
	left: 0;
	width: 100%;
	height: auto;
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

.main{
	margin-top: 61upx;
}
.notice-box{
	margin: 0upx 30upx 31upx 30upx;
}

.zone {
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 20upx auto 0 auto;
	border-bottom: 10upx solid #F6F6F6;
	padding-bottom: 50upx;
	.item {
		flex: 1;
		justify-content: center;
		align-items: center;
		text-align: center;
		.name {
			height: 33upx;
			margin-top: 20upx;
		}
		image {
			width: 96upx;
			height: 96upx !important;
			height: auto;
		}
	}
}

.box-contant{
	width: 100%;
	height: auto;
	padding: 0 30upx 0 30upx;
	box-sizing: border-box;
}

.info-coupon{
	.orange{
		display:flex;
		// align-items: flex-end;
		height: 45upx;
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
	width: 260upx;
	height:auto;
	margin: 0 20upx 0 0;
	.item-info{
		margin: 0;
		padding: 0;
		.scroll-title{
			height: 36upx;
		}
		.orange{
			width:150upx;
			height:56upx;
			border-radius:28upx;
			border:1upx solid rgba(254,106,114,1);
		}
	}
	.item-img {
		width: 260upx;
		height: auto;
		border:1upx solid rgba(235,235,235,1);
		box-sizing: border-box;
		image {
			width: 256upx;
			height: 260upx !important;
			border-radius: 0;
		}
	}
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
	margin: 20upx 0upx 30upx 30upx;
}
.scroll-title {
	width: 100%;
	white-space: normal;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 1;
	overflow: hidden;
	height: 42upx;
	line-height: 42upx;
	margin-bottom: 8upx;
}
.recomemnt-item {
	margin: 20upx;
	display: inline-block;
	width: 335upx;
	height: 584upx;
	position: relative;
	&.sort-type {
		width: 335upx;
		// overflow: hidden;
		margin: 0upx 0 40upx 0;
		&:nth-child(2n) {
			margin-left: 15upx;
		}
		.item-img {
			width: 335upx;
			height: auto;
			border:1upx solid rgba(235,235,235,1);
			box-sizing: border-box;
			image {
				width: 330upx;
				height: 335upx !important;
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
		padding: 35upx 00upx 0upx 0upx;
		progress{
			height: 10upx;
			progress-inner-bar{
				border-top-right-radius: 5upx !important;
				border-bottom-right-radius: 5upx !important;
				overflow: hidden !important;
			}
		}
		.betweenBox{
			align-items: center;
			height: 60upx;
			.flex-box{
				width:177upx;
				height:60upx;
				border-radius:30upx;
				border:2upx solid rgba(254,106,114,1);
			}
			.shopping_normal{
				height: 48upx;
				width: 54upx;
				image{
					height: 48upx !important;
					width: 54upx;
				}
			}
		}
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
	height: 44upx;
	padding: 30upx 30upx 23upx 30upx;
	.cd-left {
		height: 42upx;
		font-weight: bold;
		font-family:PingFangSC;
		.line{
			box-sizing: border-box;
			height: 29upx;
			border-left: 4upx solid #FE6A72;
			padding-right: 20upx;
		}
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
		width: 44upx;
		height: 44upx;
		image {
			width: 44upx;
			height: 44upx;
		}
	}
}

// .swiper {
// 	border-radius: 20upx;
// 	overflow: hidden;
// 	.swiper-item{
// 		border-radius: 20upx;
// 		overflow: hidden;
// 	}
// 	swiper-item{
// 		border-radius: 20upx;
// 		overflow: hidden;
// 	}
// 	image {
// 		width: 100%;
// 		height: auto;
// 	}
// }

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
