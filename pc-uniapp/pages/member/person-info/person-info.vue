<template>
	<view class="pageBgW">
		<view class="member-info">
			<view class="betweenBox fs28 background-white bdb imgInFo">
				<view class="w200 title-black">{{i18n.portraitHead}}</view>
				<view class="flex-box">
					<view class="head-circle" @tap="uploadHead">
						<image :src="imgUrl" v-if="imgUrl" mode="widthFix" class="w100"></image>
						<image src="/static/img/logoGsp.png" v-else mode="widthFix" class="w100"></image>
					</view>
					<image src="/static/img/self/pubulic_icon_expand@2x.png" mode="widthFix" class="ps-icon mgl20"></image>
				</view>
			</view>
			<navigator url="../change-nickname/change-nickname">
				<view class="betweenBox fs28 background-white bdb nameInFo">
					<view class="w200 title-black">{{i18n.nickname}}</view>
					<view class="flex-box color9 fs32">
						{{memberInfo.userName}}
						<image src="/static/img/self/pubulic_icon_expand@2x.png" mode="widthFix" class="ps-icon mgl20"></image>
					</view>
				</view>
			</navigator>
			<navigator url="/pages/member/psw-setting/psw-setting">
				<view class="betweenBox fs30 background-white nameInFo">
					<view class="w200 fs30 title-black">{{i18n.passwordChange}}</view>
					<view class="flex-box color9 fs32">
						<image src="/static/img/self/pubulic_icon_expand@2x.png" mode="widthFix" class="ps-icon mgl20"></image>
					</view>
				</view>
			</navigator>
		</view>
		<view class="pdb20"></view>
		<view class="member-info">
			<view class="betweenBox fs28 background-white bdb nameInFo">
				<view class="w200 title-black">{{i18n.historyPurchase}}</view>
				<view class="flex-box color9 fs30">
					{{i18n.visibleAll}}
					<switch class="switch" checked @change="switch1Change" style="transform:scale(0.7)"/>
				</view>
			</view>
			<view class="betweenBox fs28 background-white bdb nameInFo">
				<view class="w200 title-black">{{i18n.goodsGet}}</view>
				<view class="flex-box color9 fs30">
					{{i18n.visibleAll}}
					 <switch class="switch" @change="switch2Change" style="transform:scale(0.7)"/>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import {baseUrl} from '@/common/req.js'

	export default {
		data() {
			return {
				imgUrl:''
			};
		},
		computed: {
			...mapState([
				'memberInfo'
			]),
			i18n () {
				let that = this;
				return that.$t('personInfo')  
			}
		},
		onShow() {
			this.$store.dispatch('getMemberInfo');
		},
		onLoad(){
			this.imgUrl = this.memberInfo.logo
		},
		methods: {
			switch1Change: function (e) {
				console.log('switch1 发生 change 事件，携带值为', e.target.value)
			},
			switch2Change: function (e) {
				console.log('switch2 发生 change 事件，携带值为', e.target.value)
			},
			
			uploadHead() {
				uni.chooseImage({
					success: (chooseImageRes) => {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						uni.uploadFile({
							url: baseUrl+'/upload_uploadAjaxFile.action', //仅为示例，非真实的接口地址
							filePath: tempFilePaths[0],
							name: 'file',
							success: (res) => {
								console.log(this.imgUrl);
								let obj = JSON.parse(res.data)
								if(obj.status==1){
									this.imgUrl = obj.url;
									this.editUserHeadImg()
								}
							}
						});
					}
				});
			},
			editUserHeadImg(){
				this.apiUrl.editMemberInfo({
					data:{
						id:this.memberInfo.id,
						logo:this.imgUrl
					}
				}).then(res=>{
					if(res.data.status ==1){
						uni.showToast({
							title:this.i18n.successfullyAvatar,
							icon:'success',
							duration:2000
						})
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.w200{
		width: auto;
		min-width: 200upx;
	}
	.pageBgW{
		box-sizing: border-box;
		padding: 27upx 0;
	}
	.member-info{
		width: 100%;
		height: 100%;
		padding: 0 36upx;
		box-sizing: border-box;
		background: #FFFFFF;
		.switch{
			margin: 0 -10upx 0 35upx;
		}
	}
	.pdb20{
		background: #F7F7F7;
		border-radius:1px;
		box-sizing: border-box;
		margin-right: 22upx;
	}
	
	
	
	.head-circle {
		width: 80upx;
		height: 80upx;
		border-radius: 50%;
		overflow: hidden;
		image{
			border-radius: 50%;
			width: 80upx;
			height: 80upx!important;
		}
	}

	.ps-icon {
		width: 16upx;
	}
	.title-black{
		height: 40upx;
		line-height: 40upx;
	}
	.imgInFo{
		.mgl20{
			margin-left: 26upx;
			color: #B6B6B6;
		}
	}
	.nameInFo{
		height: 83upx;
		.mgl20{
			margin-left: 26upx;
			color: #ADADAD;
		}
	}

</style>
