<template>
	<view class="pageBg" style="padding-bottom: 80px;">
		<no-data v-if="productList&&!productList.length"></no-data>
		<view class="background-white mgtBox" v-for="(item,index) in productList" :key='index'>
			<view class="goods-list list-inline relative">
				<view class="list-item bdb" @tap="goDetail(item)">
					<view class="list-img flex-align">
						<image :src="item.goodsImage" mode="widthFix" class="w100"></image>
					</view>
					<view class="list-info">
						<view class="oneline title-black fs28">
							{{item.goodsName}}
						</view>
						<view class="gray fs24 packageType">
							商品期数：{{item.packageType}}
						</view>
						<view class="fs24 gray betweenBox">
							<view class="">总需：RM12</view>
							<view class="">本期参与：<text class="orange">{{item.num}}</text>人次</view>
						</view>
						<view class="fs24 gray treasure-number">
							夺宝号码：<text class="orange">2332523</text>
						</view>
						<view class="fs24 gray betweenBox">
							揭晓时间：2019/9/23 13:40:09
						</view>
					</view>
				</view>
				<view class="rightBox fs26 append-box">
					<view class="flex-box append orange" @tap="share(item)">分享</view>
					<view class="flex-box confirm-adress white" @tap="confirmAdress(item)">
						确认收货地址
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import myMixin from '@/common/myMixin.js'
	import noData from '@/components/no-data'

	export default {
		data() {
			return {
				consignType: -1,
				current: 1,
				productList: false,
				allowRequest:true,
				noMoreData:false,
			};
		},
		mixins: [myMixin],
		computed: mapState([
			'memberInfo'
		]),
		onShow() {
			if (!this.memberInfo) uni.redirectTo({url: '/pages/login/login'})
			this.initPageData();
		},
		onPullDownRefresh() {
			this.initPageData();
		    setTimeout( ()=>{
				 uni.stopPullDownRefresh();
		    }, 1000);
		},
		onLoad(e) {

		},
		components: {
			noData
		},
		onReachBottom() {
			if(this.productList.length == 0) return;
			if(this.noMoreData){
				uni.showToast({
					title:'已是最后一页',
					icon:'none',
					duration:1500
				});
				return
			}
			this.getConsignmentList();
		},
		methods: {
			goDetail(item){
				uni.navigateTo({
					url:'/pages/packages/purshase-record/purshase-detail/purshase-detail'
				})
			},
			share(item) {
				
			},
			confirmAdress(item) {
				
			},
			initPageData() {
				this.productList = [];
				this.current = 1;
				setTimeout(()=>this.getConsignmentList(),200);
			},
			getConsignmentList() {
				if(!this.allowRequest) return
				this.allowRequest = false;
				this.apiUrl.getWholesaleList({
					data: {
						memberId: this.memberInfo.id,
						status: this.consignType,
						current: this.current
					}
				}).then(res => {
					this.allowRequest = true;
					if (res.data.status == 1 && res.data.data.pageList && res.data.data.pageList.length) {
						let arr = res.data.data.pageList;
						//列表是否加载完提示
						if(res.data.data.pages==this.current){
							this.noMoreData = true;
						}
						arr = this.setImgSize(arr, '400x400','goodsImage');
						this.productList = (this.productList||[]).concat(res.data.data.pageList)
						this.current += 1;
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.pageBg{
		background:rgba(249,249,249,1);
		.pd20{
			font-size:26upx;
			font-family:PingFangSC-Light;
			font-weight:300;
			color:rgba(101,101,101,1);
			padding: 32upx 30upx;
			border-bottom: none;
		}
		.list-inline{
			margin: 0 auto;
			.list-item{
				margin-left: 0;
				font-size:24upx;
				color:rgba(153,153,153,1);
				padding-bottom: 36upx;
				.list-info{
					width: 426upx;
					height: auto;
				}
				.list-img{
					width: 210upx;
					height: 100%;
					margin-right: 32upx;
					.w100{
						width: 210upx;
						height: 210upx;
					}
				}
				.title-black{
					width: 426upx;
					height:36upx;
					font-size:28upx;
					font-family:PingFangSC-Regular;
					font-weight:400;
					color:rgba(0,0,0,1);
					line-height:40upx;
					margin-bottom: 11upx;
					white-space: normal;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					overflow: hidden;
				}
				.packageType{
					height:33upx;
					font-size:24upx;
					font-family:PingFangSC-Regular;
					font-weight:400;
					color:rgba(153,153,153,1);
					line-height:33upx;
					margin-bottom: 38upx;
				}
				.treasure-number{
					margin: 10upx 0;
				}
			}
			.append-box{	
				width: 100%;
				height: 108upx;
				.append{
					width:135upx;
					height:52upx;
					border:2upx solid rgba(254,106,114,1);
					border-radius:26upx;
				}
				.confirm-adress{
					width:238upx;
					height:52upx;
					background:rgba(254,106,114,1);
					border-radius:26upx;
					margin-left: 26upx;
				}
			}
		}
	}
	
	.mgtBox{
		width:750upx;
		height:auto;
		margin-bottom: 20upx;
		padding: 37upx 43upx 0 37upx;
		box-sizing: border-box;
	}

	.list-name {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 470upx;
	}

	.oneline {
		width: 470upx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.cl-btn {
		width: 170upx;
		height: 60upx;
		border-radius: 30px;
		border: solid 1px #a9a9a9;
		color: #a9a9a9;
	}
</style>
