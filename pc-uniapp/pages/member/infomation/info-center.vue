<template>
	<view class="bg pageBg">
		<view class="infolist" v-for="(item,index) in messageList" :key='index' @tap="go(item)">
			<view class="boxContent flex">
				<view class="infoheader mar20">
					<view class="infotitle"></view>
				</view>
				<view class="infoBox fs28">
					<view class="infoContent color3 fw400">{{item.content}}</view>
					<view class="infotime color9">{{item.createDate}}</view>
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
					arr.forEach(item=>item.createDate=this.formatYear(item.createDate))
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
		margin:0 35upx 30upx 35upx;
		background: #FFFFFF;
		width:680upx;
		.infolist{
			height: auto;
			background-color: #ffffff;
			display: flex;
			justify-content: space-between;
			flex-direction: column;
			padding: 30upx 0;
			box-sizing: border-box;
			border-bottom: 1upx solid rgba(230,230,230,1);
			.boxContent{
				width: 100%;
				height: auto;
				overflow: hidden;
			}
			.infotime{
				width:230upx;
				height:26upx;
				line-height: 26upx;
				font-family:PingFangSC-Medium;
				margin-top: 23upx;
			}
			.infoBox{
				width:642upx;
				height:100%;
				box-sizing: border-box;
			}
			.infoheader{
				display: flex;
				position: relative;
				margin:13upx 18rpx 0 0;
				display:block;
				.infotitle{
					width: 0;
					height: 0;
					border: 7upx solid;
					border-color: white white white #F55C70;
					text{
						font-size: 32upx;
						color:rgba(51,51,51,1);
					}
				}
			}
			.infoContent{
				overflow: hidden;
				height: 68upx;
				line-height: 34upx;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2; /*截取第三行*/
			}
		}
	}
</style>