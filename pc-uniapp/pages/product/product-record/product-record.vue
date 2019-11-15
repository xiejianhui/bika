<template>
	<view>
		<view class="fans-list">
			<view class="fans-item bdbe" v-for="(item,index) in list" :key='index'>
				<image class="fans-avatar" :src="item.logo" v-if="item.logo"></image>
				<image class="fans-avatar" v-else src="/static/img/logoGsp.png"></image>
				<view class="fans-infos">
					<view class="name">{{item.userName||item.autoId}}</view>
					<view class="betweenBox fs28">
						<view class="time">
							下单了<text class="fs34 orange">{{item.teamFansNumber}}</text>次
						</view>
						<view class="time">{{item.createDate.time}}</view>
					</view>
				</view>
			</view>
		</view>
		<no-data v-if="showOrder"></no-data>
	</view>
	
</template>

<script>
	import noData from '@/components/no-data'
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				current: 1,
				list: [],
				autoId: '',
				count: 1,
				logo: '',
				allowRequest:true,
				noMoreData:false,
				showOrder:true,
			};
		},
		onPullDownRefresh() {
			this.current = 1;
			this.list=[];
			setTimeout( ()=>{
				 this.getList();
			}, 100);
		    setTimeout( ()=>{
				 uni.stopPullDownRefresh();
		    }, 1000);
		},
		onLoad() {
			this.getList();
		},
		components: {
			noData
		},
		onReachBottom() {
			if(this.list.length == 0) return;
			if(this.noMoreData){
				uni.showToast({
					title:'已是最后一页',
					icon:'none',
					duration:1500
				});
				return
			}
			this.getList();
		},
		methods: {
			getList() {
				if(!this.allowRequest) return
				this.allowRequest = false;
				this.apiUrl.getFansList({
					data: {
						current: this.current,
						pageCount: 20
					}
				}).then(res => {
					this.allowRequest = true;
					if (res.data.status == 1) {
						this.autoId = res.data.data.autoId;
						this.count = res.data.data.list.count;
						if (res.data.data.list.pageList.length) {
							//列表是否加载完提示
							if(res.data.data.pages==this.current){
								this.noMoreData = true;
							}
							let arr = res.data.data.list.pageList;
							arr.forEach(item=>{
								item.createDate.time = this.format(item.createDate.time);
							})
							this.list = this.list.concat(arr);
							if(this.list.length > 0){
								this.showOrder = false;
							}
							this.current += 1;
						}
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.fans-list {
		width: 678upx;
		margin: 0 auto;
		padding-bottom: 100upx;
		.fans-item {
			padding: 30upx 0;
			.fans-avatar {
				float: left;
				width:115upx;
				height:115upx;
				border-radius:50%;
			}
			.fans-infos {
				position: relative;
				margin-left: 138upx;
				.name {
					font-size:34upx;
					font-family:PingFangSC-Semibold;
					font-weight:600;
					color:#FE6A72;
					height: 48upx;
					line-height: 48upx;
					margin: 12upx 0 4upx 0;
				}
				.le_d{
					color:rgba(101,101,101,1);
					margin-bottom: 8upx;
				}
				.detail {
					text {
						font-family:PingFangSC-Regular;
						font-weight:400;
						color:rgba(101,101,101,1);
					}
				}
				.time {
					font-size:24upx;
					font-family:PingFangSC-Regular;
					font-weight:400;
					color:#999999;
				}
			}
		}
	}
</style>
