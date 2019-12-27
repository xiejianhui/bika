<template>
	<view class="colTopBottom">
		<form @submit="submitpassword">
			<view class="box">
				<view class="pd20 flex fs34 background-white bdb">
					<view class="flex-box" style="flex:2;">
						<input type="text" style="flex:2;" v-model="oldPassword" :password="!showPassword" :placeholder="i18n.passwordEnter"  />
						<text class="password-mode" @tap="showPassword=!showPassword">{{showPassword? i18n.hide:i18n.show}}</text>
					</view>
				</view>
				<view class="pd20 flex fs34 background-white bdb">
					<view class="flex-box" style="flex:2;">
						<input type="text" style="flex:2;" :password="!showPassword2" v-model="password" :placeholder="i18n.passwordEnterNew" value="" />
						<text class="password-mode" @tap="showPassword2=!showPassword2">{{showPassword2? i18n.hide:i18n.show}}</text>
					</view>
				</view>
			</view>
			
			<button formType="submit" :class="password && oldPassword ? 'mgb20 orange-btn primary-background': 'mgb20 orange-btn primary-background btnShow'" :disabled="password == '' && oldPassword == ''">{{i18n.complete}}</button>
		</form>
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'
	import md5 from '@/common/md5.js'

	export default {
		data() {
			return {
				mobilePhone:'',
				oldPassword:'',
				password:'',
				showPassword:false,
				showPassword2:false,
				showPassword3:false
			};
		},
		computed: {
			...mapState([
				'memberInfo'
			]),
			i18n () {
				let that = this;
				return that.$t('changePsw')  
			}
		},
		onShow() {
			uni.getStorage({
				key:'changepsw',
				success: (res) => {
					uni.switchTab({
						url: '/pages/index/index'
					});
				},
				fail: (res) => {	
				}
			})
		},
		methods:{
			submitpassword(){
				if(!this.oldPassword||!this.password){
					uni.showToast({
						icon:'none',
						duration:2000,
						title:this.i18n.fullInformation,
					})
				}else if(!this.checkPswString(this.password)){
					uni.showToast({
						icon:'none',
						duration:2000,
						title:this.i18n.numbersLetters,
					})
				}else {
					uni.showLoading({
						title:this.i18n.wait_moment,
						mask:true
					})
					this.apiUrl.resetLoginPsw({
						data:{
							mobilePhone:this.memberInfo.mobilePhone,
							oldPassword:md5('TPSHOP' + this.oldPassword),
							password:md5('TPSHOP' + this.password)	
						}
					}).then(res=>{
						uni.hideLoading();
						if(res.data.status&&res.data.status==1){
							uni.showToast({
								icon:'none',
								duration:2000,
								title:this.i18n.succeededModification,
							})
							setTimeout(()=>{
								// uni.navigateBack()
								this.logout()
							},1500)
						}
					})
				}
			},
			logout() {
				this.$store.commit('logOut');
				uni.setStorage({
					key:"changepsw",
					data:true,
					success: (res) => {
					}
				})
				uni.navigateTo({
					url: '/pages/login/login',
					animationType: 'pop-in',
					animationDuration: 200
				})
				// uni.navigateBack()
			}
		}
	}
</script>

<style lang="less">
.colTopBottom{
	height: 100%;
	background: #FFFFFF;
	.box{
		margin: 41upx 0 60upx 0;
	}
	.btnShow{
		background: #E5E5E5;
		color: #FFFFFF;
		box-shadow: none;
	}
	.btnShow:after{
		border: none;
	}
}
.pd20 {
	margin: 0 60upx;
	padding: 65upx 0 36upx 0;
}
</style>
