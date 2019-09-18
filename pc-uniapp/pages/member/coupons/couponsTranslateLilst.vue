<template>
	<view class="pageBg ">
		<view class="background-white bdb list mgt20" v-for="(item,index) in list" :key='item.id'>
			<view class="betweenBox pd20">
				<text class="fs30">{{item.phone}}</text>
				<text class="fs30" :class="{'green':item.operate,'red':!item.operate}">{{item.operate?'+':'-'}}{{item.num}}</text>
			</view>
			<view class="betweenBox pdl20 pdr20 pdb20">
				<text class="fs24 gray">{{item.createDate}}</text>
				<text class="fs26">剩余批发券: {{item.afterNum}}</text>
			</view>
			<view class=" pdl20 pdr20 pdb20">
				<text class="fs24 gray">备注：</text>
				<text class="fs26 gray">{{item.remarks||'无'}}</text>
			</view>
		</view>
		<no-data v-if="!list.length"></no-data>

	</view>
</template>

<script>
	import noData from '@/components/no-data.vue';

	export default {
		data() {
			return {
				current:1,
				list:[],
				allowRequest:true,
				noMoreData:false,
			};
		},
		onLoad() {
			this.getList()
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
			this.getList()
		},
		components:{
			noData
		},
		methods:{
			getList(){
				if(!this.allowRequest) return
				this.allowRequest = false;
				this.apiUrl.member_integralloTransferPagination({data:{
					current:this.current,
				}}).then(res=>{
					this.allowRequest = true;

					if(res.data.status==1&&res.data.data.pageList.length){
						//列表是否加载完提示
						if(res.data.data.pages==this.current){
							this.noMoreData = true;
						}
						let arr = res.data.data.pageList;
						arr.forEach(item=>{
							item.createDate = this.format(item.createDate);
						})
						this.list = this.list.concat(arr);
						this.current+=1;
						if(this.current==2){
							this.getList();
						}
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
.list{
}
</style>
