<template>
	<view>
		<view class="search-box flex-box">
			<view class="box-content flex-align relative">
				<image class="absolute" src="/static/img/index/search-icon-sousuo@2x.png"></image>
				<view class="search">
					<input type="text" v-model="search" @confirm="inputSearch" confirm-type="search" placeholder="请输入搜索产品" value="" />
				</view>
				<text class="fs26 search-input flex-box colorw" @tap="inputSearch">搜索</text>
			</view>
		</view>
		<view class="search-history">

			<view class="betweenBox mgb20" v-if="historySearch.length">
				<text class="title fs26 color9">历史搜索</text>
				<view class="flex-box gray" @tap="clearHistory">
					<uni-icon type="trash" size='24'></uni-icon>
				</view>
			</view>
			<view class="history-box">
				<view class="color3 item-input flex-box mgr20 mgb20" 
					:class="{active:index==isActive}"
					v-for="(item,index) in historySearch" :key='index' >
					<text @tap="goHistoryList(item)">{{item}}</text>
				</view>
			</view>

			<view class="betweenBox mgb20" v-if="hotSearch.length" style="margin-top: 40upx;">
				<text class="title fs26 color9">大家都在搜</text>
			</view>
			<view class="search-btns">
				<view class="color3 item-input flex-box mgr20 mgb20" v-for="(item,index) in hotSearch" :key='item.id' @tap="goList(item)">
					{{item.word}}
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				search: '',
				hotSearch: [],
				historySearch: [],
				isActive:-1,
			};
		},
		onLoad() {
			uni.getStorage({
				key: 'historySearch',
				success: (res) => {
					console.log(res);
					this.historySearch = res.data
				}
			})
			this.getSearchList()
		},
		methods: {
			goBack() {
				uni.navigateBack();
			},
			clearHistory() {
				uni.removeStorage({
					key: 'historySearch',
					success: () => {
						this.historySearch = []
					}
				})
			},
			delHistory(index) {
				let arr = this.historySearch;
				arr.splice(index, 1);
				this.historySearch = arr;
				uni.setStorage({
					key: 'historySearch',
					data: arr
				})
			},
			inputSearch() {
				if (!this.search) return
				let arr = this.historySearch;
				console.log(arr);
				arr.unshift(this.search);
				arr.length >= 10 ? arr.length = 10 : '';
				uni.setStorage({
					key: 'historySearch',
					data: arr,
					success: () => {
						uni.navigateTo({
							url: '../product/product-list?type=2&keywords=' + this.search
						})
					}
				})

			},
			goList(item) {
				console.log(item)
				this.isActive= this.firstIndex(this.hotSearch, item);
				let str;
				item.word ? str = item.word : str = item
				uni.navigateTo({
					url: '../product/product-list?type=2&keywords=' + str
				})
			},
			goHistoryList(item) {	
				console.log("获取某个元素第一次出现在数组的索引", this.firstIndex(this.historySearch, item));
				this.isActive= this.firstIndex(this.historySearch, item);
				let str;
				item.word ? str = item.word : str = item
				uni.navigateTo({
					url: '../product/product-list?type=2&keywords=' + str
				})
			},
			goSearch() {
				uni.navigateTo({
					url: 'search-resoult/search-resoult'
				})
			},
			getSearchList() {
				this.apiUrl.hotSearchList({
					data: {

					}
				}).then(res => {
					if (res.data.status == 1) {
						this.hotSearch = res.data.data
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.search-history {
		padding: 0 38upx 0 35upx;
		height: auto;
		width: 100%;
		box-sizing: border-box;
		.mgb20{
			margin-bottom: 35upx;
		}
		.history-box{
			width: 100%;
			height: auto;
			overflow: hidden;
			.active{
				color: #FE6A72;
			}
		}

		.title {
			height: 26upx;
			line-height: 26upx;
		}
		.item-input{
			width:auto;
			height:54upx;
			background:rgba(246,246,246,1);
			border-radius:5upx;
			white-space: normal;
			float: left;
			padding: 0 20upx;
		}

		.search-btns {
			display: flex;
			flex-wrap: wrap;
			margin-top: 30upx;

			>view {
				height: 40upx;
				font-size: 28upx;
				font-weight: 400;
				color: #333333;
				line-height: 40upx;
				padding: 14upx 30upx;
				background: #F5F5F5;
				margin-right: 20upx;
				margin-bottom: 20upx;
			}
		}
	}

	.search-box {
		line-height: 60upx;
		height: 60upx;
		position: relative;
		background: #fff;
		padding: 10upx 0;
		margin: 0 auto 38upx auto;
		.box-content{
			width:678upx;
			height:64upx;
			background:rgba(255,255,255,1);
			border:1upx solid rgba(211, 211, 211, 1);
			border-radius:5upx;
			image{
				width: 29upx;
				height: 31upx !important;
				margin-left: 16upx;
			}
		}
		.search {
			display: inline-block;
			width: 514upx;
			height: 64upx;
			overflow: hidden;
			margin-left: 40upx;
			padding-left: 15upx;
			input {
				height: 64upx;
				line-height: 64upx;
				font-size: 26upx;
			}
		}
		.search-input{
			width:164upx;
			height:62upx;
			background:rgba(245,92,112,1);
			border-radius:5upx;
		}
	}
</style>
