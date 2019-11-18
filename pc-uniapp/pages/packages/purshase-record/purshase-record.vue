<template>
	<view class="pageBg" style="padding-bottom: 80px;">
		<view class="flex-box cl-types background-white bdbe">
			<view class="" @tap='changeTypes(index)' v-for="(item,index) in typesList" :key='index' :class="{'active':item.active}">
				{{item.name}}
			</view>
		</view>
		<no-data v-if="productList&&!productList.length"></no-data>
		<view class="mgt20 background-white mgtBox" v-for="(item,index) in productList" :key='index'>
			<view class="goods-list list-inline relative" @tap="goDetail(item)">
				<view class="primary-img absolute">
					<image src="/static/img/moudel/purchase-zhongjiang.png" mode="widthFix" class="w100" v-if="item.status==1"></image>
					<image src="/static/img/moudel/purchase-weizhongjiang.png" mode="widthFix" class="w100" v-if="item.status==2"></image>
				</view>
				<view class="list-item bdb">
					<view class="list-img">
						<image :src="item.goodsImage" mode="widthFix" class="w100"></image>
					</view>
					<view class="list-info">
						<view class="oneline title-black fs28">
							{{item.goodsName}}
						</view>
						<view class="gray fs24 packageType">
							{{item.packageType}}
						</view>
						<view class="fs24 gray">
							本次参与<text class="orange">{{item.num}}</text>人次
						</view>
					</view>
				</view>
				<view class="betweenBox fs24 append-box">
					<view class="gray flex-align fs24">
						<progress backgroundColor="#F5BBBE" activeColor="#FE6A72" percent="60" active style='border-radius: 10upx;overflow: hidden;' />
						<text class="mgl20">共需200人</text>
					</view>
					<view class="flex-box append orange" @tap="goProduct(item)">追加</view>
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
	import myMixin from '../../../common/myMixin.js'
	import noData from '@/components/no-data'

	export default {
		data() {
			return {
				typesList: [{
						name: '全部订单',
						active: true
					},
					{
						name: '进行中',
						active: false
					},
					{
						name: '已揭晓',
						active: false
					}
				],
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
			goProduct(item) {
				uni.navigateTo({
					url: '/pages/product/product-detail?id=' + item.id,
					animationType: 'pop-in',
					animationDuration: 200
				});
			},
			changeTypes(index) {
				let arr = this.typesList;
				arr.forEach(item => item.active = false)
				arr[index].active = true;
				this.typesListt = arr;
				//get list
				let n = index;
				n == 0 ? n = -1 : '';
				this.consignType = n;
				console.log(n)

				this.initPageData();
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
			.primary-img{
				top: -8upx;
				left: -8upx;
				z-index: 1;
				width: 100upx;
				height: 113upx;
				image{
					width: 100upx;
					height: 113upx;
				}
			}
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
					height: 210upx;
					margin-right: 32upx;
					.w100{
						width: 210upx;
						height: 210upx;
					}
				}
				.title-black{
					width: 426upx;
					height:80upx;
					font-size:28upx;
					font-family:PingFangSC-Regular;
					font-weight:400;
					color:rgba(0,0,0,1);
					line-height:40upx;
					margin-bottom: 24upx;
					white-space: normal;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}
				.packageType{
					height:33upx;
					font-size:24upx;
					font-family:PingFangSC-Regular;
					font-weight:400;
					color:rgba(153,153,153,1);
					line-height:33upx;
					margin-bottom: 50upx;
				}
			}
			.append-box{	
				width: 100%;
				height: 96upx;
				.flex-align{
					width: 530upx;
				}
				.append{
					width:117upx;
					height:45upx;
					border:2upx solid rgba(254,106,114,1);
					border-radius:23upx;
				}
				progress{
					height: 10upx;
					width: 191upx;
					progress-inner-bar{
						border-top-right-radius: 5upx !important;
						border-bottom-right-radius: 5upx !important;
						overflow: hidden !important;
					}
				}
			}
		}
	}
	
	.mgtBox{
		width:750upx;
		height:371upx;
		margin-bottom: 20upx;
		padding: 30upx 43upx 0 37upx;
		box-sizing: border-box;
	}

	.cl-types {
		>view {
			margin: 0 58upx;
			padding: 30upx 0 29upx;
			font-size: 27upx;
			font-weight: 400;
			color: #999999;
			&.active {
				font-size: 27upx;
				font-weight: 600;
				color: #FE6A72;
				border-bottom: 2upx solid #F55C70;
			}
		}
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
