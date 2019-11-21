<template>
	<view class="pageBgW">
		<view class="purshase-box">
			<view class="purshase box-b fs28 color3 bdbe">
				<view class="purshase-item flex relative bdbe">
					<view class="purshase-img mgr30">
						<image src="http://gsm-img.vzmapp.cn/upload/goods/2019/10-28/29600161_r400x400p.png" mode="widthFix" class="w100"></image>
					</view>
					<view class="purshase-info">
						<view class="title-black">安心乐意礼包精美包装中秋送礼必备 送长辈必备</view>
						<view class="gray fs24">
							总需：<text class="orange">3</text>人次
						</view>
					</view>
				</view>
				
				<view class="but-acoumt flex-align bdbe">
					购买数量：
					<view class="mgl30">11</view>
				</view>
				
				<view class="periods flex-align">
					第300期 
					<view class="mgl30">正在进行第<text class="orange">299</text>期</view>
				</view>
			</view>
		</view>
		<view class="periods-detail">
			<view class="top-title">
				<view class="title-black color3 fs28 fw500 flex-align">
					<view class="title-item flex-box" >期</view>
					<view class="title-item flex-box" >中奖人</view>
					<view class="title-item flex-box" >中奖号码</view>
					<view class="title-item flex-box" >中奖位数</view>
					<view class="title-item flex-box" >买入次</view>
					<view class="title-item flex-box" >区间段</view>
				</view>
			</view>
			<view class="title-list bdbe" v-for="(item, index) in partakeList" :key="index">
				<view class="flex-equal" v-for="(subitem, subindex) in item.partake" :key="subindex">
					<view class="title-item flex-box fs26">{{subitem.stage}}</view>
					<view class="title-item flex-box fs26">{{subitem.winner}}</view>
					<view class="title-item flex-box fs26">{{subitem.winner_number}}</view>
					<view class="title-item flex-box fs26">{{subitem.winning_number}}</view>
					<view class="title-item flex-box fs26">{{subitem.buy_times}}</view>
					<view class="title-item flex-box fs26">{{subitem.interval_section}}</view>
				</view>
			</view>
		</view>
		<view class="purshase-btm fs28 color6">
			<view class="flex-box fs28" @tap="changeTypes(index)" v-for="(item, index) in typesList" :key="index" :class="{ active: item.active }">{{ item.name }}</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				typesList: [{
						name: '首页',
						active: true
					},
					{
						name: '开始监控',
						active: false
					},
					{
						name: '停止监控',
						active: false
					},
					{
						name: '立即参与',
						active: false
					}
				],
				partakeList:[{'partake':[{"stage":"1","winner":"阿水","winner_number":"1025","winning_number":"1025","buy_times":"1","interval_section":"后"}]},
				{'partake':[{"stage":"2","winner":"蒋美美","winner_number":"2000","winning_number":"2000","buy_times":"2","interval_section":"前"}]},
				{'partake':[{"stage":"3","winner":"小美","winner_number":"2500","winning_number":"2500","buy_times":"25","interval_section":"中"}]}],
				
			}
		},
		methods: {
			changeTypes(index) {
				let arr = this.typesList;
				if (arr[index].active == true) return
				arr.forEach(item => (item.active = false));
				arr[index].active = true;
				this.typesListt = arr;
			},
		}
	}
</script>

<style lang="less" scoped>
	.purshase-box{
		padding-bottom: 80upx;
		.purshase{
			padding: 41upx 50upx 0upx 37upx;
		}
		.purshase-item{
			width: 100%;
			height: 190upx;
			padding-bottom: 40upx;
			.purshase-info{
				width:450upx;
				height:176upx;
				.title-black{
					height: 80upx;
					line-height: 40upx;
					font-size:28upx;
					font-family:PingFang SC;
					font-weight:500;
					color:rgba(0,0,0,1);
					margin-bottom: 80upx;
					white-space: normal;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}
			}
			.purshase-img{
				width: 190upx;
				height: 190upx !important;
				margin-right: 24upx;
				image{
					width: 190upx;
					height: 190upx !important;
				}
			}
		}
		
		.but-acoumt{
			height: 120upx;
			.mgl30{
				margin-left: 40upx;
			}
		}
		.periods{
			height: 90upx;
			.mgl30{
				margin-left: 116upx;
			}
		}
	}
	
	.purshase-btm{
		position: fixed;
		z-index: 10;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 80upx;
		display: flex;
		align-items: center;
		justify-content: center;
		background: white;
		box-shadow:0upx -5upx 8upx 0upx rgba(206,206,206,0.34);
		view{
			flex: 1;
			height: 80upx;
			border-right: 1upx solid #CECECE;
		}
		view:last-child{
			border-right: none;
		}
		.active{
			background:rgba(254,106,114,1);
			color:rgba(255,255,255,1);
			border: none;
		}
	}
	
	.periods-detail{
		width: 100%;
		overflow: hidden;
		clear: both;
		.top-title{
			height:48upx;
			background:rgba(254,106,114,1);
			.title-black{
				height:48upx;
				.title-item{
					height: 36upx;
					flex: 1;
					border-right: 1upx solid #E6E6E6;
					font-size: 24upx;
					color: #FFFFFF;
				}
				.title-item:first-child{
					width: 61upx;
					height: 36upx;
				}
				.title-item:last-child{
					border-right: none;
				}
			}
		}
		.title-list{
			height:67upx;
			.flex-equal{
				height: 100%;
			}
			.title-item{
				height: 100%;
				flex: 1;
			}
			.title-item:first-child{
				width: 61upx;
				height: 100%;
			}
		}
		.title-list:nth-child(2n+1){
			background:rgba(248,248,248,1);
		}
	}
</style>
