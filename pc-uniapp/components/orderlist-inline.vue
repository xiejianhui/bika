<template>
	<view class="goods-list list-inline " >
		<view class="list-box" v-if="showType=='fillorder'">
			<view class="list-item list-itemf bdb pdt20 pdb20" v-for="(item,index) in goodsList" :key='index' >
				<view class="list-img">
					<image :src="item.imageUrl||item.image" mode="widthFix" class="w100"></image>
				</view>
				<view class="list-info" >
					<view class="list-name title-black fs28">
						{{item.productName||item.productname}}
					</view>
					<view class="list-name gray fs24">
						<text class="mgr20 ">规格：{{item.modelName||'无'}}</text>
						<!-- <text class=""></text> -->
					</view>
					<view class="list-price">
						<view class="fs36 primary-color" v-if="item.mulType">￥{{item.selectModel.price}} </view>
						<view class="fs36 primary-color" v-else>￥{{item.type==1?item.selectModel.wholesalePrice:item.price}} </view>
						<view class="gray fs24">x {{item.amount}} </view>
					</view>
				</view>
			</view>
		</view>
		<view class="list-box" v-else>
			<view class="list-item bdb pdt20 pdb20" v-for="(item,index1) in goodsList" :key='index1' >
				<view class="list-img">
					<image :src="item.imageUrl||item.image" mode="widthFix" class="w100"></image>
				</view>
				<view class="list-info">
					<view class="list-name title-black fs28">
						{{item.productName||item.productname}}
					</view>
					<view class="list-name gray fs24">
						<text  class="mgr20 ">规格：{{item.modelName||'无'}}</text>
						<text class="">数量：{{item.amount}}</text>
					</view>
					<view class="list-price">
						<text class="fs36 yellow" v-if="item.mulType">￥{{item.selectModel.price}} </text>
						<text class="fs36 yellow" v-else>￥{{item.type==1?item.selectModel.wholesalePrice:item.price}} </text>
						<text class="gray fs24">库存{{item.stock}}件 </text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		props:{
			goodsList:{
				type:Array,
				default:[]
			},
			showType:{
				type:[String,Number],
				default:''
			}
		},
		methods:{
			go(id){
				uni.navigateTo({
					url:'/pages/product/product-detail?id='+id
				})
			}
		}
	}
</script>

<style lang="less" scoped>
.goods-list.list-inline {
	margin: 0 20upx;
	.list-box{
		width: 100%;
		height: auto;
	}
}
.goods-list.list-inline .list-item .list-img{
	height: auto;
}

.list-itemf{
	margin: 40upx 0upx 0upx 10upx;
	padding: 0 10upx 40upx 0;
	border-bottom: 1upx solid #E5E5E5;
	position:relative;
	border-bottom:none;
	.list-name{
		width:378upx;
		height:80upx !important;
		font-size:28upx;
		font-family:PingFangSC-Regular;
		font-weight:400;
		color:rgba(0,0,0,1);
		line-height:40upx !important;
		white-space: normal;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
	.gray{
		height:33upx !important;
		font-size:24upx;
		font-family:PingFangSC-Regular;
		font-weight:400;
		color:rgba(153,153,153,1);
		line-height:33upx !important;
		margin-top: 10upx;
	}
	.list-img{
		width: 150upx !important;
		height: 150upx;
		margin-right:20upx;
		.w100{
			width: 150upx;
			height: 150upx;
		}
	}
	.list-price{
			position: absolute;
			top: 0upx;
			right: 30upx;
			font-family:PingFangSC-Light;
			font-weight:300;
			font-size:28px;
			text-align: right;
			display:block;
			padding:0;
			.fs36{
				color:rgba(0,0,0,1);
				height:40upx;
				font-size:28upx;
				font-family:PingFangSC-Light;
				font-weight:300;
				color:rgba(0,0,0,1);
				line-height:40upx;
			}
			.fs24{
				font-size:28upx;
				font-family:PingFangSC-Regular;
				font-weight:400;
				color:rgba(153,153,153,1);
				margin-top: 1upx;
			}
		}
		
}
</style>

 