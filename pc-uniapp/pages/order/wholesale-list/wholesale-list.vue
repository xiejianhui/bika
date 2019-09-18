<template>
	<view class="pageBg" style="padding-bottom: 80px;">
		<navigator url="../unWholesale/unWholesale">
			<view class="flex-box js-op fs30">
				<text>我要提货</text>
			</view>
		</navigator>

		<view class="flex-box cl-types background-white">
			<view class="" @tap='changeTypes(index)' v-for="(item,index) in typesList" :key='index' :class="{'active':item.active}">
				{{item.name}}
				<view class="line"></view>
			</view>
		</view>
		<no-data v-if="productList&&!productList.length"></no-data>
		<view class="mgt20 background-white mgtBox" v-for="(item,index) in productList" :key='index'>
			<view class="cl-num betweenBox bdb pd20">
				<view class="fs24">
					订单编号：{{item.selfMentionSn}}
				</view>
				<text class="primary-color fs30" v-if="item.status==1">未发货</text>
				<text class="primary-color fs30" v-if="item.status==2">已发货</text>
				<text class="primary-color fs30" v-if="item.status==3">已完成</text>
			</view>
			<view class="goods-list list-inline " @tap="go(item)">
				<view class="list-item ">
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
						<view class="fs28 gray">
							x{{item.num}}
						</view>
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
						name: '未发货',
						active: false
					},
					{
						name: '已发货',
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

			go(product) {
				uni.navigateTo({
					url: '../order?from=tihuo&id=' + product.id
				})
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
			margin: 0 30upx;
			.list-item{
				margin-left: 0;
				font-size:24upx;
				color:rgba(153,153,153,1);
				.list-info{
					width: 420upx;
					height: auto;
				}
				.list-img{
					width: 190upx;
					height: 190upx;
					.w100{
						width: 190upx;
						height: 190upx;
					}
				}
				.title-black{
					width: 420upx;
					height:80upx;
					font-size:28upx;
					font-family:PingFangSC-Regular;
					font-weight:400;
					color:rgba(51,51,51,1);
					line-height:40upx;
					margin-bottom: 30upx;
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
					margin-bottom: 1upx;
				}
			}
		}
	}
	.mgtBox{
		width:690upx;
		height:330upx;
		background:rgba(255,255,255,1);
		box-shadow:0upx 6upx 14upx 0upx rgba(224,224,224,0.5);
		border-radius:10upx;
		margin: 20upx 30upx 10upx 30upx;
	}
	.js-op {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100upx;
		background: #FC4E29;
		color: white;
		z-index: 999;
	}

	.cl-types {
		>view {
			margin: 0 40upx;
			padding: 32upx 0 22upx;
			font-size: 32upx;
			font-weight: 400;
			color: rgba(102, 102, 102, 1);
			border-radius: 10upx;

			.line {
				margin: 14upx auto 0;
				width: 70upx;
				height: 10upx;
				border-radius: 6upx;
			}

			&.active {
				font-size: 40upx;
				font-weight: 500;
				color: rgba(51, 51, 51, 1);

				.line {
					background: #fc4e29;
				}
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
