<template>
	<view class="pageBg">
		<view class="pd20 flex fs30 background-white bdb">
			<input type="text" v-model="newName" placeholder="请输入昵称" />
		</view>
		<button class="mgt40 blue-btn primary-background mgb20" :class="newName ? '': 'btnShow'" :disabled="newName == '' ? true : false" @tap='changename'>
			完成
		</button>
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'

	export default {
		data() {
			return {
				newName:'',
			};
		},
		onLoad() {
			this.newName = this.memberInfo.userName
		},
		computed: mapState([
			'memberInfo'
		]),
		methods:{
			strlen(str){
				var len = 0;  
				for (var i=0; i<str.length; i++) {   
				 var c = str.charCodeAt(i);   
				//单字节加1   
				 if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {   
				   len++;   
				 }   
				 else {   
				  len+=2;   
				 }   
				}   
				return len;  
			},
			changename(){
				console.log(this.newName.length);
				let len = this.strlen(this.newName);
				if(len>16){
					uni.showToast({
						title:'昵称最多为8个中文字符或者16个英文字符',
						icon:'none',
						duration:1500
					})
					return
				}
				if(!this.newName){
					uni.showToast({
						icon:'none',
						duration:2000,
						title:'昵称不能为空'
					})
					return
				} 
				uni.showLoading({
					title:'请稍候',
					mask:true
				})
				this.apiUrl.editMemberInfo({data:{
					userName:this.newName,
					id:this.memberInfo.id
				}}).then(res=>{
					uni.hideLoading();
					if(res.data.status==1){
						uni.showToast({
							icon:'none',
							duration:2000,
							title:'修改成功'
						})
						setTimeout(()=>{
							uni.navigateBack()
						},1500)
					}
				})
			}
		}
	}
</script>

<style lang="less">
.pageBg{
	width: 100%;
	height: auto;
	background: #ffffff;
	margin:auto;
	.pd20{
		padding: 106upx 60upx 36upx 60upx;
		border-bottom: 1upx solid #E5E5E5;
	}
}

.btnShow{
	background: #E5E5E5;
	color: #FFFFFF;
}
.mgt40{
	width:630upx;
	height:90upx;
	line-height: 90upx;
	border-radius:50upx;
	font-size: 36upx;
	margin-top: 60upx;
	button:after{
		content: none;
	}
}
button:after{
	content: none;
}
</style>
