<template>
	<view class="pageBg receipt">
		<form @submit="submitReceipt">
			<view class="receipt-box">
				<view class="background-white title-black">选择发票类型</view>
				<view class="background-white">
					<view class="rp-btn gray" :class="{ active: item.active }" v-for="(item, index) in typeList" :key="index" @tap="changeType(index)">{{ item.name }}</view>
				</view>
				<!-- 发票 -->
				<view class="" v-if="types == 1">
					<view class="background-white title-black title-blacks">发票抬头</view>
					<view class="background-white">
						<view class="background-white">
							<view class="rp-btn-fp gray" :class="{ active: item.active }" v-for="(item, index) in items" :key="index" @tap="changeSubject(index)">{{ item.name }}</view>
						</view>
						
						<!-- <radio-group @change="radioChange" class="radio-group">
							<label class="flex-box mgl20" v-for="(item, index) in items" :key="item.value" >
								<view><radio color="#FC4E29" :value="item.value" :checked="index === current" /></view>
								<view class="mgl20 fs30">{{ item.name }}</view>
							</label>
						</radio-group> -->
					</view>
					<view class="" v-if="current==1">
						<view class="background-white fpd rp-list mgt20">
							<view class="left fs30">发票抬头</view>
							<input type="text" class="fs30" placeholder="请输入发票抬头" v-model="invoiceTitle" />
						</view>
						<view class="background-white fpd rp-list">
							<view class="left fs30">统一社会信用编码</view>
							<input type="text" class="fs30" placeholder="请输入统一社会信用编码" v-model="taxpayerCode" />
						</view>
					</view>
					
				</view>
				<!-- 增值税 -->
				<view class="mgt20" v-if="types == 2">
					<view class="background-white title-black title-blacks">发票抬头</view>
					<view class="background-white fpd rp-list " v-for="(item, index) in zzsList" :key="index">
						<view class="left fs30 nameFa">{{ item.name }}</view>
						<input type="text" class="fs30" v-model="item.value" :placeholder="item.placeholder" value="" />
					</view>
				</view>
			</view>
			
			<button formType="submit" v-if="types == 2" :class="btnShow ? 'rp-confirm flex-box white fs30 active': 'rp-confirm flex-box white fs30 btnShow'" :disabled="disabled">确定</button>
			<button formType="submit" v-else-if="types == 1 && current==1" :class="invoiceTitle && taxpayerCode ? 'rp-confirm flex-box white fs30 active': 'rp-confirm flex-box white fs30 btnShow'" :disabled="invoiceTitle == '' && taxpayerCode == ''">确定</button>
			<button formType="submit" v-else class="rp-confirm flex-box white fs30 active">确定</button>
			<!-- button按钮改变隐藏域 -->
			<view style="display:none" >{{ exitsVal }}</view>
		</form>
	</view>
</template>

<script>
export default {
	data() {
		return {
			current: 0,
			types: 0,
			invoiceTitle: '',
			taxpayerCode: '',
			zzsList: [
				{
					name: '单位名称',
					placeholder: '请输入单位名称',
					value: ''
				},
				{
					name: '纳税人识别号',
					placeholder: '请输入纳税人识别号',
					value: ''
				},
				{
					name: '单位地址',
					placeholder: '请输入单位地址',
					value: ''
				},
				{
					name: '单位电话',
					placeholder: '请输入单位电话',
					value: ''
				},
				{
					name: '开户银行',
					placeholder: '请输入开户银行',
					value: ''
				},
				{
					name: '银行账户',
					placeholder: '请输入银行账户',
					value: ''
				}
			],
			items: [
				{
					value: 'USA',
					name: '个人',
					active: 'true'
				},
				{
					value: 'CHN',
					name: '公司',
				}
			],
			typeList: [
				{
					active: true,
					name: '不开发票'
				}
			],
			disabled:true,
			btnShow:false,
			ifExist:0
		};
	},
	onShow() {
		this.typeList = [
			{
				active: true,
				name: '不开发票'
			}
		];
		uni.getStorage({
			key: 'recieptType',
			success: res => {
				res.data.forEach(item => {
					item == 2
						? this.typeList.push({
								active: false,
								name: '纸质发票'
						  })
						: '';
					item == 3
						? this.typeList.push({
								active: false,
								name: '增值税发票'
						  })
						: '';
				});
			}
		});

	},
	onLoad() {
		this.initValue();
	},
	computed:{
		exitsVal:function(){
			this.ifExist=Number(Boolean(this.zzsList[0].value))+Number(Boolean(this.zzsList[1].value))+Number(Boolean(this.zzsList[2].value))+Number(Boolean(this.zzsList[3].value))+Number(Boolean(this.zzsList[4].value))+Number(Boolean(this.zzsList[5].value))
		}	
	},
	watch:{
		// 监听data中 ifExist的值
		ifExist(newVal,oldVal){
			if(Number(newVal) === 6){
				this.disabled = false;
				this.btnShow = true;
			 // 四个input框内都有值时需要做的操作
			}else{
				this.disabled = true;
				this.btnShow = false;
			 // 至少一个没有值
			}
		}
	},
	methods: {
		initValue(){
			let receiptObj = uni.getStorageSync('receiptInfo')
			receiptObj.invoiceTitle?this.invoiceTitle = receiptObj.invoiceTitle:'';
			receiptObj.uniformSocialCreditCode?this.taxpayerCode = receiptObj.uniformSocialCreditCode:'';
			receiptObj.unitName?this.zzsList[0].value = receiptObj.unitName:'';
			receiptObj.taxpayerCode?this.zzsList[1].value = receiptObj.taxpayerCode:'';
			receiptObj.unitAddress?this.zzsList[2].value = receiptObj.unitAddress:'';
			receiptObj.unitPhone?this.zzsList[3].value = receiptObj.unitPhone:'';
			receiptObj.bankName?this.zzsList[4].value = receiptObj.bankName:'';
			receiptObj.bankAccount?this.zzsList[5].value = receiptObj.bankAccount:'';
			console.log(receiptObj);
		},
		// radioChange: function(evt) {
		// 	for (let i = 0; i < this.items.length; i++) {
		// 		if (this.items[i].value === evt.target.value) {
		// 			this.current = i;
		// 			console.log(this.current);
		// 			break;
		// 		}
		// 	}
		// },
		changeSubject(index) {
			let arr = this.items;
			arr.forEach(item => (item.active = false));
			arr[index].active = true;
			this.items = arr;
			this.current = index;
		},
		changeType(index) {
			let arr = this.typeList;
			arr.forEach(item => (item.active = false));
			arr[index].active = true;
			this.typeList = arr;
			this.types = index;
		},
		submitReceipt() {
			let data = null;
			if (this.types === 0) {
				//不开发票
				uni.navigateBack();
				return;
			} else if (this.types === 1) {
				// 个人发票
				if(this.current == 0){
					//不开发票
					uni.navigateBack();
					return;
				}
				//page 发票
				data = {
					invoiceStatus: 1,
					invoiceType: this.current==1?2:1,
					invoiceTitle: this.invoiceTitle,
					uniformSocialCreditCode: this.taxpayerCode
				};
				if(!this.invoiceTitle){
					uni.showToast({
						title:'请输入发票抬头',
						icon:'none',
						duration:1500
					})
					return
				}
				if(!this.taxpayerCode){
					uni.showToast({
						title:'请输入信用编码',
						icon:'none',
						duration:1500
					})
					return
				}
			} else {
				data = {
					invoiceStatus: 2,
					unitName: this.zzsList[0].value,
					taxpayerCode: this.zzsList[1].value,
					unitAddress: this.zzsList[2].value,
					unitPhone: this.zzsList[3].value,
					bankName: this.zzsList[4].value,
					bankAccount: this.zzsList[5].value
				};
			}
			// save receipt infomation in storage
			uni.setStorage({
				key: 'receiptInfo',
				data,
				success: res => {
					uni.navigateBack();
				}
			});
		}
	}
};
</script>

<style lang="less">
.pageBg{
	background: #FFFFFF;
	.btnShow{
		background: #E5E5E5;
		color: #FFFFFF;
	}
	.btnShow:after{
		border: none;
	}
}
.receipt-box{
	padding: 50upx 40upx;
	.title-black{
		font-size:36upx;
		font-family:PingFangSC-Medium;
		font-weight:500;
		color:rgba(51,51,51,1);
		padding: 0upx 0upx 30upx 0upx;
	}
	.title-blacks{
		padding: 60upx 0upx 30upx 0upx;
	}
}
.rp-list {
	display: flex;

	.left {
		width: 300upx;
	}
}

.radio-group {
	display: flex;
}

.rp-confirm {
	width:670upx;
	height:90upx;
	background:rgba(229,229,229,1);
	border-radius:50upx;
	margin: 40upx auto;

	&.active {
		background: #FC4E29;
		color: white;
	}
}

.rp-btn {
	width:203upx;
	height:100upx;
	line-height: 100upx;
	text-align: center;
	margin-right: 32upx;
	background:rgba(245,245,245,1);
	border-radius:4px;
	display: inline-block;
	&.active {
		color: #FC4E29;
		background:rgba(252,78,41,0.08);
		border-radius:4px;
		border:1upx solid rgba(252,78,41,1);
		box-sizing: border-box;
	}
}
.rp-btn:nth-child(n+3){
	margin: 0;
}
.rp-btn-fp{
	width:320upx;
	height:100upx;
	line-height: 100upx;
	text-align: center;
	margin-right: 30upx;
	background:rgba(245,245,245,1);
	border-radius:4px;
	display: inline-block;
	&.active {
		color: #FC4E29;
		background:rgba(252,78,41,0.08);
		border-radius:4px;
		border:1upx solid rgba(252,78,41,1);
		box-sizing: border-box;
	}
}
.rp-btn-fp:nth-child(2n){
	margin: 0;
}
.fpd:first-child{
	margin-top: 30upx;
}
.fpd{
	padding: 37upx 0;
	border-bottom: 1upx solid #E5E5E5;
	.nameFa{
		font-size:32upx;
		font-family:PingFangSC-Regular;
		font-weight:400;
		color:rgba(51,51,51,1);
	}
}

</style>
