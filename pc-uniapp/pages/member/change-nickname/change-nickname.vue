<template>
	<view class="pageBg">
		<view class="pd20 flex fs30 background-white bdb">
			<input type="text" v-model="newName" :placeholder="i18n.nicknameInput" />
		</view>
		<button class="mgt40 blue-btn primary-background mgb20" :class="newName ? '': 'btnShow'" :disabled="newName == '' ? true : false" @tap='changename'>
			{{i18n.complete}}
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
		computed: {
			...mapState([
				'memberInfo'
			]),
			i18n () {
				let that = this;
				return that.$t('changeNickname')  
			}
		},
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
						title:this.i18n.upNicknames,
						icon:'none',
						duration:1500
					})
					return
				}
				if(!this.newName){
					uni.showToast({
						icon:'none',
						duration:2000,
						title:this.i18n.emptyNickname,
					})
					return
				} 
				uni.showLoading({
					title:this.i18n.wait_moment,
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
							title:this.i18n.successModified,
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
