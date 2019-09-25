<template>
	<view class="pageBgW">
		<no-data v-if="!productList.length"></no-data>	
		<view class="mgt20">
			<no-data v-if="productList && !productList.length"></no-data>
			<view class="recomemnt-item sort-type" v-for="(item, index) in productList" :key="index" @tap="goProduct(item)">
				<view class="item-img">
					<image class="item-imageUrl" lazy-load :src="item.appProductOrderList[0].imageUrl" mode="widthFix"></image>
					<view class="sold-out" v-if="!item.stock">
						<image lazy-load src="/static/img/self/collection-yishoucang@2x.png"></image>
					</view>
					<view class="sold-out" v-else>
						<image lazy-load src="/static/img/self/collection-daijiexiao@2x.png"></image>
					</view>
				</view>
				<view class="item-info info-coupon">
					<view class="title-black uni-ellipsis2 fw300">{{ item.appProductOrderList[0].productName }}</view>
					<view class="orange fs25">
						<text class="">￥</text>
						<text class="priceStyle">{{ item.appProductOrderList[0].price }}</text>
					</view>
					<view class="">
						<text class="gray originPrice" v-if="item.appProductOrderList[0].initialPrice">￥{{ item.appProductOrderList[0].initialPrice }}</text>
					</view>
					<view class="flex-equal color6 fs24">
						<view class="fs20">
							<view class="fs24">27527</view><view class="fs20">总需</view>
						</view>
						<view class="fs20">
							<view class="fs24">41242</view><view class="fs20">已参与</view>
						</view>
						<view class="fs20">
							<view class="fs24">1452</view><view class="fs20">剩余</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'
	import noData from '@/components/no-data'
 
	export default {
		data() {
			return {
				productList:[],
				current:1,
				noMoreData:false,
			};
		},
		computed: mapState([
			'memberInfo'
		]),
		onShow() {
			this.initData()
		},
		onPullDownRefresh() {
			this.current = 1;
			this.productList = [];
		   this.getList();
		    setTimeout( ()=>{
				 uni.stopPullDownRefresh();
		    }, 1000);
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
			this.getList()
		},
		components: {
			noData
		},
		methods:{
			initData(){
				this.productList = [];
				this.current = 1;
				this.getList()
			},
			sell(item){
				uni.setStorage({
					key:'jsProduct',
					data:item,
					success: (res) => {
						uni.navigateTo({
							url:'../submit-consignment/submit-consignment'
						})		
					}
				})
				
			},
			getList(type){
				this.apiUrl.getUnConsignment({
					data:{
						memberId:this.memberInfo.id,
						current:this.current
					}
				}).then(res=>{
					if(res.data.status==1&&res.data.data.pageList.length){
						let arr = res.data.data.pageList;
						//列表是否加载完提示
						if(res.data.data.pages==this.current){
							this.noMoreData = true;
						}
						arr.forEach(item=>{
							item.appProductOrderList = this.setImgSize(item.appProductOrderList,'400x400');
						})
						this.productList = this.productList.concat(arr)
						this.current+=1;
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.mgt20{
		margin-top: 42upx;
		padding: 0 44upx 0 44upx;
		.sold-out{
			height: 113upx;
			width: 100upx;
			top: -8upx;
			left: -8upx;
			background: no-repeat;
		}
	}
	
	.recomemnt-item.recomentHight {
		height:auto;
		.orange{
			height: 48upx;
		}
	}
	.recomemnt-item {
		display: inline-block;
		width: 314upx;
		height: 566upx;
		position: relative;
		box-sizing: border-box;
		margin-bottom: 30upx;
		&.sort-type {
			width: 314upx;
			overflow: hidden;
			.item-img {
				width: 314upx;
				height: 322upx;
				image {
					width: 100%;
					border-radius: 0;
				}
				.item-imageUrl{
					width: 100%;
					height: 322upx !important;
					border-radius: 0;
				}
			}
		}
		.item-img {
			width: 100upx;
			image {
				width: 100%;
				height: 113upx;
			}
		}
		.item-info {
			width: 100%;
			// height: 237upx;
			position: absolute;
			top: 322upx;
			.title-black{
				height: 60upx;
				font-size: 23upx;
				margin: 28upx 0 17upx 0;
			}
		}
		.flex-equal{
			margin: 17upx 0 0upx 0;
			padding-top: 24upx;
			border-top: 1upx solid #EBEBEB;
			.fs20{
				text-align: center;
				font-size: 20upx;
			}
			.fs24{
				font-size: 23upx;
			}
		}
	}
	.recomemnt-item:nth-child(2n+1){
		margin-right: 34upx;
	}
	
	.uc-btn{
		width: 170upx;
		height: 60upx;
		background:rgba(249,83,26,1);
		color: #FFFFFF;
		border-radius: 30upx;
	}
	.list-info{
		position: relative;
		.uc-btn{
			position: absolute;
			right: 20upx;
			bottom: 10upx;
		}
	}
	.pdb10{padding-bottom: 10upx;}
</style>
