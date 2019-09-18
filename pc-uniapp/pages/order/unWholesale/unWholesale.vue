<template>
	<view class="pageBg">
		<view class="tac fs36 gray pd20 mgt20" v-if="!productList.length">
			暂无订单
		</view>
		<view class="mgt20 background-white pdb10 mgtBox" v-for="(item,index) in productList" :key='index'>
			<view class="cl-num betweenBox bdb pd20">
				<view class="fs24">
					订单编号：{{item.orderNO}}
				</view>
			</view>
			<view class="goods-list list-inline " >
				<view class="list-item " >
					<view class="list-img">
						<image :src="item.appProductOrderList[0].imageUrl" mode="widthFix" class="w100"></image>
					</view>
					<view class="list-info">
						<view class="list-name title-black fs28">
							{{item.appProductOrderList[0].productName}}
						</view>
						<view class="fs28 gray packageType">
							{{item.appProductOrderList[0].productModelName}}
						</view>
						<view class="fs28 gray betweenBox">
							x{{item.appProductOrderList[0].mayAmout}}
							<view class="uc-btn flex-box white" @tap='sell(item)'>
								我要提货
							</view>	
							
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'

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
			this.getList()
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
		methods:{
			sell(item){
				uni.setStorage({
					key:'jsProduct',
					data:item,
					success: (res) => {
						uni.navigateTo({
							url:'../submit-wholesale/submit-wholesale'
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
	    .pageBg{
	        background:rgba(249,249,249,1);
	        .bdb{
	            font-size:26upx;
	            font-family:PingFangSC-Light;
	            font-weight:300;
	            color:rgba(101,101,101,1);
	            padding: 32upx 30upx;
	            border-bottom: none;
	        }
	        .pdb10{
	            margin: 0 30upx;
				width:690upx;
				height:330upx;
				background:rgba(255,255,255,1);
				box-shadow:0upx 6upx 14upx 0upx rgba(224,224,224,0.5);
				border-radius:10upx;
				margin: 30upx 30upx 0upx 30upx;
	            .list-item{
	                margin-left: 0;
	                font-size:24upx;
	                color:rgba(153,153,153,1);
	                .list-info{
	                    width: 420upx;
	                    height: auto;
						.gray{
							width: 250upx;
							display: -webkit-box;
							-webkit-line-clamp: 1;
							overflow: hidden;
						}
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
						padding: 0;
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
	
	.uc-btn{
		width: 170upx;
		height: 60upx;
		background-color: #FC4E29;
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
</style>
