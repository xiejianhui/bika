<template>
	<view class="pageBg" style="background: #FFFFFF;">
		<no-data v-if="productList && !productList.length"></no-data>
		<view class="product-list" v-for="(item, index) in productList" :key="item.id">
			<!-- 商品列表 -->
			<view class="sale-list">
				<view class="bdbe8 relative" v-for="(subitem, subindex) in item.productList" :key="subitem.id" @tap="go(subitem)">
					<view class="relative list-item" v-if="1 == 2">
						<view class="list-img flex-align">
							<image :src="subitem.image" mode="widthFix" class="w100"></image>
						</view>
						<view class="list-info">
							<view class="flex-align">
								<view class="info-img relative flex-align">
									<image :src="subitem.image" mode="widthFix" class="w100"></image>
								</view>	
								<view class="orange flex-align uni-ellipsis fs30">{{ subitem.productname }}</view>
							</view>
							<view class="list-frequency gray">
								购买：<text class="orange">{{ subitem.price }}</text>人次
							</view>
							<view class="gray">
								幸运号码：<text class="orange">12231</text>
							</view>
							<view class="gray timer">
								揭晓时间：<text class="color6">2019-09-12</text>
							</view>
						</view>
						<view class="right flex-box">
							<image lazy-load src="/static/img/moudel/details-icon-qianjin.png" mode="widthFix" class="id-ri"></image>
						</view>
					</view>
					<view class="relative list-item" v-else>
						<view class="list-img flex-align">
							<image :src="subitem.image" mode="widthFix" class="w100"></image>
						</view>
						<view class="list-info">
							<view class="flex-align">
								<view class="color3 flex-align uni-ellipsis fs34">{{ subitem.productname }}</view>
							</view>
							<view class="gray value">
								价值：<text class="orange">￥{{subitem.price}}</text>
							</view>
							<view class="white fs26 count-down flex-box" v-if="1==2">
								揭晓倒计时
								<uni-countdown
									v-if="productType == 1 || productType == 7"
									class="time"
									font-color="#fff"
									border-color="#FE6A72"
									bgr-color="#FE6A72"
									@activeStart="gettingStart(item, index)"
									@activeOver="delActive(item, index)"
									:timer="item.proxyEndTime"
									:startTime="item.proxyStartTime"
									:endTime="item.proxyEndTime"
									:now="currentTime"
								></uni-countdown>
							</view>
							<view class="calculated fs26 white flex-box" v-else>正在计算</view>
						</view>
						<view class="right flex-box">
							<image lazy-load src="/static/img/moudel/details-icon-qianjin.png" mode="widthFix" class="id-ri"></image>
						</view>
						<view class="unveiled-out">
							<image src="/static/img/moudel/icon-zhengzaijiexiao.png" mode="widthFix" class="w100"></image>
						</view>
					</view>
				</view>
			</view>
			<drop-more v-if="showDrop"></drop-more>
		</view>
	</view>
</template>

<script>
	import dropMore from '@/components/drop-more';
	import { mapState, mapMutations } from 'vuex';
	import noData from '@/components/no-data';
	import uniCountdown from './uni-countdown.vue';
export default {
	data() {
		return {
			keywords: '',
			productList: false,
			productType: '',
			keyword: '',
			timeout: null,
			currentTime: '',
			showDrop:false,
		};
	},
	components: {
		dropMore,
		noData,
		uniCountdown
	},
	onPullDownRefresh() {
		this.getList();
		setTimeout(() => {
			uni.stopPullDownRefresh();
		}, 1000);
	},
	computed: mapState(['systemInfo']),

	onLoad(e) {
		e.type = 1;
		this.productType = e.type;
		this.getList();
	},
	methods: {
		gettingStart(obj, index) {
			console.log('start');
			this.getList();
		},
		delActive(obj, index) {
			let arr = this.productList;
			arr.splice(index, 1);
			this.productList = arr;
		},
		go(item) {
			uni.navigateTo({
				url: '../product-detail?id=' + item.id,
				animationType: 'pop-in',
				animationDuration: 200
			});
		},
		getList() {
			uni.showLoading({
				title: '加载中'
			});
			let data = {
				keywords: this.keywords,
				//0零售 1批发 2普通
				type: this.productType
			};
			this.apiUrl
				.getSpecialProduct({
					data
				})
				.then(res => {
					uni.hideLoading();
					if (res.data.status == 1) {
						let arr = res.data.data;
						// arr = this.setImgSize(arr,'350x350')
						arr.forEach(item => {
							item.productList = this.setImgSize(item.productList, '350x350');
							if(this.productType==1 || this.productType==7){
								if(res.data.now<item.proxyStartTime){
									item.activeStart = false; //预售未开始
									console.log('unstart');
								}else{
									item.activeStart = true; //预售
									console.log('start');
								}
								console.log(item.activeStart);
							}
							if(item.productList.length < 5){
								this.showDrop = true;
							}
						});
						// this.productList = arr;
						this.productList = arr;
						this.currentTime = res.data.now;
					}
				});
		}
	}
};
</script>

<style lang="less" scoped>
.product-list {
	margin-bottom: 88upx;

	.sale-list {
		.list-item {
			display: flex;
			padding: 52upx 27upx 38upx 27upx;
			height: 345upx;
			.list-img {
				width: 192upx;
				height: 345upx;
				overflow: hidden;
				float: left;
				image {
					display: block;
					width: 192upx;
					height: 192upx;
				}
			}
			.list-info {
				margin-left: 41upx;
				position: relative;
				height: 345upx;
				width: 485upx;
				.info-img{
					width:80upx;
					height:80upx;
					border-radius:50%;
					image{
						width:80upx;
						height:80upx;
						border-radius:50%;
					}
				}
				.uni-ellipsis {
					margin-left: 17upx;
					height: 40upx;
				}
				.list-frequency {
					margin: 49upx 0 25upx 0;
				}
				.timer{
					margin-top: 29upx;
				}
				.value{
					margin:111upx 0 21upx 0 ;
				}
				.count-down{
					width:auto;
					height:66upx;
					padding: 20upx 35upx;
					background:rgba(254,106,114,1);
					border-radius:33upx;
					box-sizing: border-box;
				}
				.calculated{
					width:191upx;
					height:66upx;
					background:rgba(254,106,114,1);
					border-radius:33upx;
				}
			}
			.right{
				display: flex;
				align-items: center;
				width: 44upx;
				height: 345upx;
				image {
					width: 44upx;
					height: 78upx;
				}
			}
			.unveiled-out{
				position: absolute;
				top: 0;
				left: 0;
				width: 93upx;
				height: 112upx;
				image{
					width: 93upx;
					height: 112upx;
				}
			}
		}
	}
}

.drop-more{
	margin: 49upx auto 0upx;
}
</style>
