<template>
	<view class="bg pageBg">
		<view class="infolist" v-for="(item,index) in messageList" :key='index' @tap="go(item)">
			<view class="infotime">{{item.createDate}}</view>
			<view class="boxContent">
				<view class="infoBox">
					<view class="infoheader betweenBox">
						<view :class="!item.isRead ? 'infotitle isRead' : 'infotitle'"><view class="point" v-if="!item.isRead"></view><text>{{item.title}}</text></view>
					</view>
					<view class="infoContent">{{item.content}}</view>
				</view>
				<view class="infoDetail">
					<image src="/static/img/pubulic_icon_expand@2x.png" class=""></image>
					<text>查看详情</text>
				</view>
			</view>
		</view>
		<no-data v-if="!messageList.length"></no-data>
	</view>
</template>
<script>
	import {mapState,mapMutations} from 'vuex'
	import myMixin from '../../../common/myMixin.js'
	import noData from '@/components/no-data'

export default{
	data(){
		return {
			messageList:[],
			current:1,
			allowRequest:true,
			noMoreData:false,
		}
	},
	mixins:[myMixin],
	onLoad() {
		this.getList()
	},
	computed: mapState([
		'memberInfo'
	]),
	onReachBottom() {
		if(this.messageList.length == 0) return;
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
	onShow(){
		this.current = 1;
		this.messageList = [];
		this.getList();
	},
	components:{
		noData
	},
	methods:{
		go(item){
			uni.navigateTo({
				url:'message?id='+item.id
			})
		},
		getList(){
			if(!this.allowRequest) return
			this.allowRequest = false;
			if(!this.memberInfo) return;
			this.apiUrl.getMessage({data:{
				current:this.current,
				memberId:this.memberInfo.id
			}}).then(res=>{
				this.allowRequest = true;
				if(res.data.status == 1&&res.data.data.pageList.length){
					//列表是否加载完提示
					if(res.data.data.pages==this.current){
						this.noMoreData = true;
					}
					let arr = res.data.data.pageList;
					arr.forEach(item=>item.createDate=this.formatMonth(item.createDate))
					this.messageList = this.messageList.concat(arr)
					this.current++;
				}
			})
		}
	},
}
</script>
<style lang='less' scoped>
	.bg{
		margin:0 auto;
		.infolist{
			box-sizing: border-box;
			height: auto;
			background-color: #ffffff;
			padding: 0upx 30upx;
			display: flex;
			justify-content: space-between;
			flex-direction: column;
			margin-bottom: 20upx;
			margin:0 auto;
			background:rgba(249,249,249,1);
			.boxContent{
				width: 100%;
				height: auto;
				box-shadow:0upx 6upx 14upx 0upx rgba(224,224,224,0.5);
				border-radius:10upx;
				overflow: hidden;
			}
			.infotime{
				margin: 60upx 0 30upx 230upx;
				width:230upx;
				height:50upx;
				line-height: 50upx;
				text-align: center;
				background:rgba(219,219,219,1);
				border-radius:29upx;
				font-size:26upx;
				font-family:PingFangSC-Medium;
				font-weight:500;
				color:rgba(255,255,255,1);
			}
			.infoDetail{
				height:90upx;
				line-height: 90upx;
				font-size:28upx;
				font-family:PingFangSC-Regular;
				font-weight:400;
				color:rgba(51,51,51,1);
				background:#ffffff;
				border-top:1upx solid #E5E5E5;
				image{
					float: right;
					color: #ADADAD;
					line-height: 20upx;
					width: 20upx;
					height: 30upx;
					font-size: 20upx;
					margin: 35upx 30upx 0 20upx;
				}
				text{
					float: right;
				}
			}
			.infoBox{
				width:690upx;
				height:266upx;
				padding: 40upx 30upx;
				box-sizing: border-box;
				background:rgba(255,255,255,1);
				
				border-radius:10upx;
			}
			.infoheader{
				display: flex;
				justify-content: space-between;
				position: relative;
				.isRead{
					padding-left: 20upx;
				}
				.infotitle{
					display: flex;
					flex-direction: row;
					align-items: center;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 1;
					/* -webkit-box-orient: vertical; */
					width:auto;
					height:45upx;
					font-size:32upx;
					font-family:PingFangSC-Medium;
					font-weight:500;
					line-height:45upx;
					margin-bottom:12upx;
					.point{
						position: absolute;
						left:0;
						top: 50%;
						transform: translateY(-50%);
						width: 10upx;
						height: 10upx;
						background-color: #FC4E29;
						border-radius: 50px;
						
					}
					text{
						font-size: 32upx;
						color:rgba(51,51,51,1);
					}
				}
			}
			.infoContent{
				font-size: 25upx;
				color: #8d8d8d;
				overflow: hidden;
				height: 130upx;
				line-height: 43upx;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 3; /*截取第三行*/
			}
		}
	}
</style>