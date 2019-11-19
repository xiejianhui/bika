<template>
	<view class="pageBgW">
		<view class="color6 boxs-b lucky-box">
			<view class="lucky-number color6 flex-align">
				<view class="title white f30">
					<view class="">幸运</view>
					号码
				</view>
				<view class="color6">=</view>
				<view class="formula">
					<view class="molecule tac fs24">数值 <text class="orange">A</text></view>
					<view class="denominator tac fs24">商品总需人数</view>
				</view>
				<view class="mgl20">+1000001</view>
			</view>
			<view class="a-box fs28 boxs-b flex">
				<view class="orange">A</view> 
				<view>
					<text class=""><text class="equal">=</text>截止该商品满份时整站最后100条参与时间之和</text>
					<view class="mgt30">
						<text class="equal">=</text><text class="orange">5380737985</text>
					</view>
				</view>
			</view>
			<view class="user mgt40">
				<view class="title-black color3 fs28 fw500 flex-align">
					<view class="title-item flex-box" >参与时间</view>
					<view class="title-item flex-box" >用户</view>
				</view>
				<view class="title-list bdbe" v-for="(item, index) in partakeList" :key="index">
					<view class="flex-equal" v-for="(subitem, subindex) in item.partake" :key="subindex">
						<view class="title-item flex-box fs26">{{subitem.time}}</view>
						<view class="title-item flex-box fs26">{{subitem.user}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="bdb2f8"></view>
		<view class="color6 boxs-b lucky-box">
			<view class="b-box fs28 boxs-b flex">
				<view class="orange">码</view> 
				<view>
					<view class="">
						<text class="equal">=</text>
						<text class="orange">5380737983 </text> 
						<text class="equal">除以购买份数</text>  
						<text class="orange">2654 </text> 
						<text class="equal">取余数</text>  
						<text class="orange">1258 </text>
					</view>
					<view class="mgt30">
						<text class="equal">=</text>
						<text class="orange">2654</text>
						<text class="equal">+</text>
						<text class="orange">1000001</text> 
						<text class="equal">获得</text> 
						<text class="orange">1001259</text>
					</view>
				</view>
			</view>
		</view>
		<view class="result flex-box">
			计算结果：<text class="orange">1001259</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				partakeList:[{'partake':[{"time":"2019/09/2 12:09:13.123","user":"哈哈"}]},{'partake':[{"time":"2019/09/2 12:09:13.123","user":"哈哈"}]}],
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="less" scoped>
	.pageBgW{
		.lucky-box{
			padding: 0 32upx 0upx;
		}	
		.lucky-number{
			margin: 49upx 0;
			.title{
				width:137upx;
				height:142upx;
				padding: 32upx 38upx;
				background:rgba(254,106,114,1);
				box-sizing: border-box;
			}
			.color6{
				margin: 0 18upx;
			}
			.formula{
				width:320upx;
				height:142upx;
				border:1upx dashed rgba(179,179,179,1);
				.molecule{
					margin: 0 20upx;
					border-bottom: 1upx solid #C2C2C2;
					height: 71upx;
					box-sizing: border-box;
					padding-top: 30upx;
				}
				.denominator{
					height: 71upx;
					box-sizing: border-box;
					padding-top: 20upx;
				}
				.orange{
					margin-left: 8upx;
				}
			}
		}
		.a-box,.b-box{
			width:686upx;
			height:179upx;
			background:rgba(248,248,248,1);
			padding: 42upx 21upx 45upx;
			.equal{
				margin: 0 7upx;
			}
		}
		.b-box{
			margin: 50upx 0;
		}
		
		.mgt40{
			margin: 40upx 0 50upx;
		}
		.user{
			width: 100%;
			overflow: hidden;
			clear: both;
			.title-black{
				width:684upx;
				height:67upx;
				background:rgba(248,248,248,1);
				.title-item{
					height: 100%;
					width: 246upx;
				}
				.title-item:first-child{
					width: 437upx;
					height: 100%;
					border-right: 1upx solid #E6E6E6;
				}
			}
			.title-list{
				height:67upx;
				.flex-equal{
					height: 100%;
				}
				.title-item{
					height: 100%;
					width: 246upx;
				}
				.title-item:first-child{
					width: 437upx;
					height: 100%;
					border-right: 1upx solid #E6E6E6;
				}
			}
		}
		
		.result{
			width:100%;
			height:36upx;
			font-size:38upx;
			font-family:PingFang SC;
			font-weight:500;
			color:rgba(102,102,102,1);
			margin: 20upx 0;
		}
	}
</style>
