<template>
	<view class="pd-detail ">
		<scroll-view scroll-x class="scroll-wrap flex">
			<view class="scroll-select fs28 fw500 color6" :class="{ active: currentIndex == index }" v-for="(item, index) in bigCateArr" :key="item.createDate" @tap="changeSort(index)">
				{{ item.itemName }}
				<!-- <view class="line"></view> -->
			</view>
		</scroll-view>
		<view v-if="goodsDetail">
			<view class="flex result color6 fs26 background-white">
				<view class="head-box bdr">
					<view class="head">
						<image :src="memberInfo.logo" v-if="memberInfo && memberInfo.logo" mode="widthFix" class="w100"></image>
						<image src="/static/img/logoGsp.png" v-else mode="widthFix" class="w100"></image>
					</view>
					<view v-if="memberInfo && memberInfo.id" class="color6 fs30 flex-box">
						{{ memberInfo.userName||memberInfo.mobilePhone}}
					</view>
				</view>
				<view class="total bdr">
					<view class="flex-box all-acoumt">总共购买</view>
					<view class="orange fs40 flex-box">30</view>
					<view class="flex-box color9 fs24">人次</view>
				</view>
				<view class="total bdr">
					<view class="flex-box all-acoumt">揭晓时间</view>
					<view class="color3 fw500 fs24 flex-box">2019-09-13 01:23:12</view>
				</view>
				<view class="total">
					<view class="flex-box all-acoumt">购买时间</view>
					<view class="color3 fw500 fs24 flex-box">2019-09-13 01:23:12</view>
				</view>
			</view>
			<view class="check-result betweenBox fw500">
				<view class="lucky-number">
					幸运号码: <text class="orange fs34 mgl10">102522</text>
				</view>
				<view class="check-btn flex-box colorw" @tap="toCalculation">
					查看计算结果
				</view>
			</view>
			<view class="swiper relative background-white" v-if="goodsDetail.productImageList.length > 0">
				<swiper class="detail_swiper" :indicator-dots="true" indicator-color="#ad7e6c" indicator-active-color="white" :autoplay="true" :interval="3000" :duration="1000">
					<swiper-item v-for="(item, index) in goodsDetail.productImageList" :key="index">
						<view class="swiper-item"><image :src="item.imageUrl" mode="widthFix" class="w100"></image></view>
						<view class="item-index fs30 absolute flex-box">
							<view>{{index+1}}</view>/<view>{{goodsDetail.productImageList.length}}</view>
						</view>
					</swiper-item>
				</swiper>
				<!-- #ifdef APP-PLUS -->
				<view class="share flex-box"><image src="/static/img/public_icon_share_white@2x.png" mode="widthFix" class="" @tap="sharePage"></image></view>
				<!-- #endif -->
			</view>
			<view class="detail_info">
				<view class="name">{{ goodsDetail.productname }}</view>
				<view class="betweenBox">
					<view class="" v-if="(goodsDetail.type!=1 && goodsDetail.type != 7)">
						<!-- 零售普通价格 -->
						<text class="fs30 orange">¥</text>
						<text class="price orange">{{ goodsDetail.price }}</text>
					</view>
					<view v-else>
						<view class="" v-if="(goodsDetail.type==1 || goodsDetail.type == 7)&&!selectedPifa">
							<!-- 批发价格 -->
							<text class="fs30 orange">¥</text>
							<text class="price orange">{{goodsDetail.productProxyPackageList.length>1? goodsDetail.productProxyPackageList[0].wholesalePrice:goodsDetail.price }}</text>
							<view class="inline" v-if="goodsDetail.productProxyPackageList.length>1">
								<text class="orange">~</text>
								<text class="price orange">{{ goodsDetail.productProxyPackageList[goodsDetail.productProxyPackageList.length-1].wholesalePrice }}</text>
							</view>
						</view>

						<view class="" v-if="(goodsDetail.type==1 || goodsDetail.type == 7)&&selectedPifa">
							<!-- 批发价格 -->
							<text class="fs30 orange">¥</text>
							<text class="price orange">{{ selectedPifa.wholesalePrice }}</text>
						</view>
						<view class="">
							零售价：{{goodsDetail.price}}
						</view>
					</view>
				</view>
			</view>

			<image
				:src="staticImgResource+'common/pic_share_accelerate@2x.png'"
				v-if="goodsDetail.shareAccelerate.basicSwitch == 1"
				style="display: block;width: 692upx;height: 71upx;margin: 0 auto;"
			></image>
				
			<view class="detail-wd fs30 background-white">
				<view class="betweenBox mgb20 boxs-b" @tap="toChart">
					<view class="title-black">
						走势图
					</view>
					<view class="right">
						<image src="/static/img/moudel/details-icon-qianjin.png" class="right-img" mode="scaleToFill"></image>
					</view>
				</view>
				<view class="betweenBox mgb20 boxs-b" @tap="toRecord">
					<view class="title-black">
						所有参与记录
					</view>
					<view class="right">
						<image src="/static/img/moudel/details-icon-qianjin.png" class="right-img" mode="scaleToFill"></image>
					</view>
				</view>
			</view>
			<view class="pd20 background-white pdt20" v-if="goodsDetail.shortDescription">
				<rich-text class="richText" :nodes="goodsDetail.shortDescription"></rich-text>
				<!-- <view class="detail-wrap" v-html="goodsDetail.shortDescription"></view> -->
			</view>
			<view class="buy tac">
				<view class="server pdl20 pdr20 " @tap="service">
					<view class=""><image src="/static/img/public_icon_onchat@2x.png" mode="widthFix" class=""></image></view>
					<view class="fs22 gray">客服</view>
				</view>
				<view class="server pdl20 pdr20 ">
					<navigator url="../cart/cart" open-type="switchTab">
						<view class=""><image src="/static/img/public_icon_shop_car@2x.png" mode="widthFix" class=""></image></view>
						<view class="fs22 gray">购物车</view>
					</navigator>
				</view>
				<view class="" v-if="goodsDetail.type == 2">
					<view class="addToCar fs30" @tap="takeOrder(0)" v-if="goodsDetail.type === 2">
						<!-- <image src="/static/img/car2.png" mode="widthFix"></image> -->
						<view class="flex-box">加入购物车</view>
					</view>
					<view class="buynow fs30 white" @tap="takeOrder(1)" :class="{ forbid: !allowBuy }"><view class="flex-box">{{goodsDetail&&goodsDetail.stock?'立即购买':'售罄'}}</view></view>

				</view>
				<view class="" v-if="goodsDetail.type != 2" >
					<view class="flex-box bigBtn background-blue"  @tap="takeOrder(1)" v-if="(goodsDetail.type==1 || goodsDetail.type==7)&&!activeStart">下期爆款</view>
					<view class="flex-box bigBtn" :class="{ forbid: !allowBuy }" @tap="takeOrder(1)" v-else>立即抢购</view>
				</view>
			</view>
			<!-- 购物车弹窗 -->
			<view class="car-pop" v-if="showPop">
				<view class="content">
					<view class="close-icon"><uni-icons type="closeempty" size="30" @click="showPop = false"></uni-icons></view>
					<view class="top-img ">
						<view class="left"><image :src="attibuteImg || goodsDetail.image" mode="widthFix" class="w100"></image></view>
						<view class="right" v-if="goodsDetail.mulType">
							<view class="red fs36" v-if="selectModel">￥{{ selectModel.price }} 元</view>
							<view class="gray fs24 mgt10" v-if="selectModel && (goodsDetail.type != 0 && goodsDetail.type!=6)">库存 {{ selectModel.stock }} 件</view>
							<view class="gray fs24 mgt10" v-else-if="systemInfo.retailInventoryHidden == 'false'">库存 {{ selectModel.stock }} 件</view>
							<view class="mgt10">请选择规格数量</view>
						</view>
						<view class="right" v-else>
							<view class="red fs36">￥{{ goodsDetail.price }} 元</view>
							<view class="gray fs24 mgt10" v-if="goodsDetail.type != 0 && goodsDetail.type!=6">库存 {{ goodsDetail.stock }} 件</view>
							<view class="gray fs24 mgt10" v-else-if="systemInfo.retailInventoryHidden == 'false'">库存 {{ goodsDetail.stock }} 件</view>
							<view class="mgt10">请选择购买数量</view>
						</view>
					</view>
					<!-- 是否多个型号(普通、零售) -->
					<view class="pdl20 pdr20 ">
						<view class="" v-if="goodsDetail.mulType" v-for="(item, index) in attributeKeyList" :key="index">
							<view class="mgb10">选择{{ item.keyName }}</view>
							<view class="size-choose">
								<view
									class="size-btn"
									v-for="(subitem, subindex) in item.valueList"
									:key="subindex"
									:class="{ 'active-btn': subitem.active }"
									@tap="selectAttr(index, subindex, subitem)"
								>
									{{ subitem.valueName }}
								</view>
							</view>
						</view>
						<view class="buy-num mgb20 pdt20" v-if="goodsDetail.type == 0 || goodsDetail.type == 6 || goodsDetail.type == 2">
							<view class="">
								<text class="fs30">购买数量</text>
								<text class="gray fs24" v-if="goodsDetail.buyLimit">(每人限购{{ goodsDetail.buyLimit }}件)</text>
							</view>
							<view class="">
								<uni-number-box
									:min="1"
									v-if="goodsDetail.buyLimit"
									:max="goodsDetail.buyLimit > goodsDetail.stock ? goodsDetail.stock : goodsDetail.buyLimit"
									:value="chooseNumber"
									@change="chooseGoodsNumber"
								></uni-number-box>
								<uni-number-box
									:min="1"
									v-else
									:max="selectModel ? selectModel.stock : goodsDetail.stock"
									:value="chooseNumber"
									@change="chooseGoodsNumber"
								></uni-number-box>
							</view>
						</view>
						<!-- 批发 -->
						<view class="wholesaleShop" v-if="goodsDetail.type == 1 || goodsDetail.type == 7">
							<view class="pd-package fs30 background-white " v-if="productProxyPackageList && productProxyPackageList.length">
								<view class="bigTitle pd20">选择套餐</view>
								<view class="mgl20 mgr20">
									<view class="package-wrap ">
										<view class="">套餐</view>
										<view class="tac">所需批发劵</view>
										<view class="tac">剩余数量</view>
									</view>
									<view class="package-wrap gray" v-for="(item, index) in productProxyPackageList" :key="index" :class="{ active: item.active }" @tap="choosePackage(index)">
										<view class="">{{ item.packageType }}</view>
										<view class="tac">{{ item.wholesaleCoupon }}张</view>
										<view class="tac">{{ item.stock }}</view>
									</view>
								</view>
								<view class="buy-num mgt20 pd20">
									<view class="">
										<text class="fs30">购买数量</text>
										<text class="gray fs24 mgl20" v-if="selectedPifa">(每人限购 {{ selectedPifa.buyLimit }}件)</text>
									</view>
									<view class="">
										<uni-number-box :min="1" :max="selectedPifa && selectedPifa.buyLimit ? selectedPifa.buyLimit : 10000" :value="pifaNum" @change="changePifaNum"></uni-number-box>
									</view>
								</view>
								<view class=" betweenBox mgl20 mgr20">
									<view class="gray">合计所需批发劵</view>
									<view class="orange fs36 ">{{ totalSelectedPifa }}</view>
								</view>
								<view class=" betweenBox mgt10 mgl20 mgr20" v-if="memberInfo">
									<view class="gray ">剩余批发劵</view>
									<view class=" fs36 ">{{ memberInfo.frozenMoney || 0 }}</view>
								</view>
								<view class=" betweenBox mgt10 mgl20 mgr20" >
									<view class="gray ">需要支付</view>
									<view class=" fs36  red">¥ {{ pifaSelectTotalMoney }}</view>
								</view>
							</view>
						</view>	
						<view class="buy-btn" @tap="buyNow">{{ addToShoppingCar ? '加入购物车' : '立即购买' }}</view>
					</view>
				</view>
			</view>
			<!-- <agree-pop v-if="agreementType" :type="agreementType"></agree-pop> -->
			<!-- 登录选择弹框 -->
			<view class="uni-modal" v-if="showModal">
				<view class="uni-mask"></view>
				<view class="modal-box">
					<view class="uni-modal__bd">亲，需要登录才可以进行商品购买哦~~</view>
					<view class="uni-modal__ft">
						<view class="uni-modal__btn uni-modal__btn_default" @tap="modalCancel">先逛逛</view>
						<view class="uni-modal__btn uni-modal__btn_primary" @tap="modalConfirm">马上登录</view>
					</view>
					</view>
				</view>
			</view>
		</view>
	</view>	
</template>
<script>
import uniNumberBox from '@/components/uni-number-box.vue';
import detailCountdown from '@/components/detail-countdown.vue';
import uniCountdown from '@/components/uni-countdown.vue';
import agreePop from '@/components/agreement-pop.vue';
import { mapState, mapMutations } from 'vuex';
import graceRichText from '@/common/richText.js';
import {staticImgResource,H5Domain} from '@/common/req.js'
import math from '@/common/math.js'

export default {
	data() {
		return {
			bigCateArr: null,
			currentIndex: 0,
			
			showPop: false,
			chooseNumber: 1,
			goodsDetail: null,
			addToShoppingCar: false,
			attributeKeyList: null,
			selectModel: null,
			productProxyPackageList: [],
			pifaNum: 1,
			selectedPifa: null,
			expressFee: null,
			agreementType: null,
			allowBuy: true,
			attibuteImg: null,
			currentTime: '',
			productId:null,
			staticImgResource:'',
			activeStart:false,
			agree:true,
			showModal:false,
		};
	},
	computed: {
		...mapState(['memberInfo', 'activeAddress', 'systemInfo']),
		totalSelectedPifa () {
		  return this.selectedPifa ? math.multiply(this.selectedPifa.wholesaleCoupon, this.pifaNum) : 0
		},
		pifaSelectTotalMoney(){
			return this.selectedPifa ? math.multiply(this.selectedPifa.wholesalePrice, this.pifaNum) : 0
		}
	},
	onShow() {},
	onShareAppMessage(res) {
		return {
			title: this.goodsDetail.productname
		};
	},
	onPullDownRefresh(e) {
		this.getGoodsDetai(this.productId);
		this.$store.dispatch('getMemberInfo')
		setTimeout(() => {
			uni.stopPullDownRefresh();
		}, 1000);
	},
	onLoad(e) {
		// 获取期数
		this.getSort();
		
		//实时获取批发券
		if (this.memberInfo) {
			this.$store.dispatch('getMemberInfo')
		}
		this.staticImgResource = staticImgResource;
		e.id?this.productId = e.id:'';
		this.getGoodsDetai(e.id);
		
		this.forwardMiniProgram();
		//发票
		uni.removeStorage({
			key: 'receiptInfo'
		})
	},
	watch: {
		activeAddress: function(val, oldVal) {
			this.getExpress();
		}
	},
	methods: {
		toRecord(){
			uni.navigateTo({
				url:'/pages/product/product-record/product-record'
			})
		},
		toCalculation(){
			uni.navigateTo({
				url:'/pages/packages/calculation-details/calculation-details'
			})
		},
		toChart(){
			uni.navigateTo({
				url:'/pages/packages/trend-chart/trend-chart'
			})
		},
		getSort() {
			this.apiUrl
				.getProductTree({
					data: {
						type: 2
					}
				})
				.then(res => {
					if (res.data.status == 1) {
						let mydata = res.data.data;
						this.bigCateArr = mydata;
						this.getGoodsDetai(this.productId);
					}
				});
		},
		changeSort(index) {
			this.currentIndex = index;
			this.getGoodsDetai(this.productId);
		},
		
		
		
		sharePage() {
			console.log('enter');
			uni.share({
				provider: 'weixin',
				scene: 'WXSceneSession',
				type: 0,
				href: H5Domain,
				title: this.goodsDetail.productname,
				summary: '一起来选购吧',
				imageUrl: this.goodsDetail.image,
				success: function(res) {
					console.log('success:' + JSON.stringify(res));
				},
				fail: function(err) {
					console.log('fail:' + JSON.stringify(err));
				}
			});
		},
		service() {
			uni.showModal({
				title: '提示',
				content: '需要客服，请拨打电话 ' + this.systemInfo.phone,
				success: function(res) {
					if (res.confirm) {
						console.log('用户点击确定');
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		},
		// 过滤复文本特殊符号
		filterSpecialSymbol(str) {
			// str = str.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ');
			str = graceRichText.format(str);
			return str;
		},
		//get express
		getExpress() {
			if (!this.goodsDetail) return;
			this.apiUrl
				.getExpress({
					data: {
						cityId: this.activeAddress.city||'',
						productId: this.goodsDetail.id
					}
				})
				.then(res => {
					if (res.data.status == 1) {
						this.expressFee = res.data.data.fee;
					}
				});
		},
		changePifaNum(e) {
			this.pifaNum = e;
			//批发商品数量限制
			if (this.selectedPifa) {
				e > this.selectedPifa.stock ? (this.pifaNum = this.selectedPifa.stock) : '';
			}
		},
		// 选择套餐
		choosePackage(index) {
			let arr = [...this.productProxyPackageList];
			arr.forEach(item => (item.active = false));
			arr[index].active = true;
			this.selectedPifa = arr[index]; //select package
			this.productProxyPackageList = arr;

			this.pifaNum = 1; //init buy num
		},
		getGoodsDetai(id) {
			uni.showLoading({
				title: '加载中'
			});
			this.apiUrl
				.getGoodsdetail({
					data: {
						id: id
					}
				})
				.then(
					res => {
						uni.hideLoading();
						if (res.data.data) {
							let str = res.data.data.shortDescription;
							res.data.data.shortDescription ? (res.data.data.shortDescription = this.filterSpecialSymbol(str)) : ''; //handle rich text
							this.goodsDetail = res.data.data;
							if (this.goodsDetail.type == 2) {
								if (res.data.data.attributeKeyList) {
									let arr = res.data.data.attributeKeyList;
									//初始化 active model 选择
									arr.forEach(item => {
										item.valueList.forEach(subitem => (subitem.active = false));
									});
									this.attributeKeyList = arr;
								}
								this.goodsDetail.mulType ? '' : (this.selectModel = this.goodsDetail.productModelList[0]);
							}

							//套餐选择
							if (this.goodsDetail.type == 1 || this.goodsDetail.type == 7) {
								let arr2 = res.data.data.productProxyPackageList;
								arr2.forEach(item => (item.active = false));
								this.productProxyPackageList = arr2;
								//默认选择第一个套餐
								arr2[0].active = true;
								this.selectedPifa = arr2[0]; //select package
								this.productProxyPackageList = arr2;

								//批发活动是否开始
								if(res.data.now<res.data.data.productBatch.proxyStartTime){
									this.activeStart = false;
								}else{
									this.activeStart = true;
								}
							}
							if (this.activeAddress) this.getExpress();
							//批发零售活动未开始不许购买
							let now = new Date().getTime();
							if (this.goodsDetail.type == 1 || this.goodsDetail.type == 7) {
								this.agreementType = 5; //批发协议
								this.goodsDetail.productBatch.proxyStartTime - now > 0 ? (this.allowBuy = false) : '';
							}
							if (this.goodsDetail.type == 0 || this.goodsDetail.type == 6) {
								this.agreementType = 4; //零售协议
								this.goodsDetail.productBatch.proxyStartTime - now > 0 ? (this.allowBuy = false) : '';
							}
							//if (!this.goodsDetail.stock) this.allowBuy = false;
							this.currentTime = res.data.now;
						}
					},
					err => {}
				);
		},
		modalConfirm(){
			this.showModal = false;
			setTimeout(() => {
				uni.setStorageSync('pagefromDetail', this.goodsDetail.id);
				uni.navigateTo({
					url: '../login/login'
				});
			}, 1500);
			return;
		},
		modalCancel(){
			this.showModal = false;
		},
		takeOrder(type) {
			if (!this.memberInfo) {
				this.showModal = true;
				return;
			}
			if (!this.allowBuy) {
				uni.showToast({
					title: '该商品还未开始售卖，请留意开售时间',
					duration: 1500,
					icon: 'none'
				});
				return;
			}
			if (!this.goodsDetail.stock) {
				uni.showToast({
					title: '该商品已卖完，请选择其他商品',
					duration: 1500,
					icon: 'none'
				});
				return;
			}

			if(!this.agree){
				uni.showToast({
					title: '购买该商品需要同意购买协议，请勾选',
					duration: 1500,
					icon: 'none'
				});
				return;
			}
			if (this.goodsDetail.type == 0 || this.goodsDetail.type == 6) {
				//普通
				this.showPop = !this.showPop;
			}
			//批发 //零售
			if (this.goodsDetail.type == 1 || this.goodsDetail.type == 2  || this.goodsDetail.type == 7) {
				type ? (this.addToShoppingCar = false) : (this.addToShoppingCar = true);
				this.showPop = true;
			}
		},
		selectAttr(pIndex, sIndex, subitem) {
			let arr = this.attributeKeyList[pIndex];
			arr.valueList.forEach(item => (item.active = false));
			arr.valueList[sIndex].active = true;
			this.attributeKeyList.splice(pIndex, 1, arr);
			//点击 查询 选择规格
			this.initSelectModel();
			//更换不同model图片
			if (subitem.imageUrl) {
				this.attibuteImg = subitem.imageUrl;
			}
		},
		chooseGoodsNumber(e) {
			this.chooseNumber = e;
		},
		changeStatus() {
			this.showPop = !this.showPop;
		},
		// 筛选 用户选择的组合

		initSelectModel() {
			let arr = this.attributeKeyList;
			let idsArr = [];
			arr.forEach(item => {
				item.valueList.forEach(subitem => {
					subitem.active ? idsArr.push(subitem.id) : '';
				});
			});
			let targetGoods = null;

			let pmArr = this.goodsDetail.productModelList;
			for (let i = 0; i < pmArr.length; i++) {
				let bol = true;
				for (let y = 0; y < idsArr.length; y++) {
					if (pmArr[i].valueIds.indexOf(idsArr[y]) == -1) {
						bol = false;
						break;
					}
				}
				if (bol && idsArr.length === arr.length) {
					targetGoods = pmArr[i];
				}
			}
			this.selectModel = targetGoods;
		},
		buyNow() {
			if (this.goodsDetail.type == 0 || this.goodsDetail.type == 6) {
				//零售
				this.goodsDetail.amount = this.chooseNumber;
				uni.setStorage({
					key: 'payingProduct',
					data: this.goodsDetail,
					success: e => {
						uni.navigateTo({
							url: '/pages/order/fillOrder/fillOrder?type=' + this.goodsDetail.type
						});
					}
				});
				return;
			} else if (this.goodsDetail.type == 1 || this.goodsDetail.type == 7) {
				//批发
				let bol = false;
				this.productProxyPackageList.forEach(item => {
					item.active ? (bol = true) : '';
				});
				if (!bol) {
					uni.showToast({
						title: '请选择套餐',
						duration: 1500,
						icon: 'none'
					});
					return;
				}
				//是否足够批发券
				if (this.memberInfo.frozenMoney < math.multiply(this.selectedPifa.wholesaleCoupon,this.pifaNum)) {
					uni.showToast({
						title: '您的批发券不足，不能购买该商品',
						duration: 1500,
						icon: 'none'
					});
					return;
				}
				this.goodsDetail.productProxyPackageList = this.productProxyPackageList;
				this.goodsDetail.amount = this.pifaNum;
				this.goodsDetail.selectModel = this.selectedPifa;
				uni.setStorage({
					key: 'payingProduct',
					data: this.goodsDetail,
					success: e => {
						console.log('navigateTo')
						uni.navigateTo({
							url: '/pages/order/fillOrder/fillOrder?type=' + this.goodsDetail.type
						});
					}
				});
				return;
			} else {
				//普通
				if (this.goodsDetail.mulType) {
					let arr = this.attributeKeyList;
					let num = 0;
					arr.forEach(item => {
						item.valueList.forEach(subitem => {
							subitem.active ? num++ : '';
						});
					});
					if (num < arr.length) {
						uni.showToast({
							icon: 'none',
							duration: 2000,
							title: '请选择型号规格'
						});
						return;
					}
					if (!this.chooseNumber) {
						uni.showToast({
							icon: 'none',
							duration: 2000,
							title: '请选择数量'
						});
						return;
					}
				}
				if (!this.selectModel.stock) {
					uni.showToast({
						icon: 'none',
						duration: 2000,
						title: '所选商品已售完，请选择其他产品'
					});
					return;
				}
				if (this.addToShoppingCar) {
					//添加购物车
					let data = {
						memberId: this.memberInfo.id, //is login?
						amount: this.chooseNumber,
						productId: this.goodsDetail.id
					};
					this.goodsDetail.mulType ? (data.modelId = this.selectModel.id) : (data.modelId = this.goodsDetail.productModelList[0].id);

					this.apiUrl
						.addTocar({
							data
						})
						.then(res => {
							uni.showToast({
								icon: 'none',
								duration: 2000,
								title: '添加成功'
							});
							this.showPop = !this.showPop;
						});
				} else {
					//购买
					if (this.goodsDetail.mulType) {
						this.goodsDetail.selectModel = this.selectModel;
					} else {
						this.goodsDetail.selectModel = this.goodsDetail.productModelList[0];
					}
					this.goodsDetail.amount = this.chooseNumber;
					uni.setStorage({
						key: 'payingProduct',
						data: this.goodsDetail,
						success: e => {
							uni.navigateTo({
								url: '/pages/order/fillOrder/fillOrder?type=' + this.goodsDetail.type
							});
							// uni.navigateTo({
							// 	url: '/pages/order/settlement-payment/settlement-payment?type=' + this.goodsDetail.type
							// });
						}
					});
				}
			}
		}
	},
	components: {
		uniNumberBox,
		uniCountdown,
		agreePop,
		detailCountdown
	}
};
</script>

<style lang="less">
.scroll-wrap {
	white-space: nowrap;
}
.scroll-select {
	margin: 0;
	display: inline-block;
	height: 70upx;
	line-height: 70upx;
	position: relative;
	padding: 0 45upx;
	&.active {
		font-size: 30upx;
		font-weight: bold;
		color: #FE6A72;
		background: #FFFFFF;
		.line {
			display: block;
		}
	}
	.line {
		display: none;
		width: 100%;
		height: 8upx;
		background: rgba(252, 78, 41, 1);
		position: absolute;
		bottom: -4upx;
		left: 50%;
		transform: translateX(-50%);
	}
}

.result{
	height: 238upx;
	.head-box{
		width: 234upx;
		.head{
			width: 127upx;
			height: 127upx;
			border-radius: 50%;
			overflow: hidden;
			margin: 0 auto;
			padding: 31upx 0 12upx 0;
			image{
				width: 100%;
				height: 100%!important;
				border-radius: 50%;
			}
		}
	}
	.total{
		width: 174upx;
		.all-acoumt{
			margin: 50upx 0 30upx 0;
			height: 26upx;
		}
		.orange{
			margin-bottom: 30upx;
			height: 40upx;
		}
		.color3{
			padding-top: 16upx;
			text-align: center;
		}
	}
	
}

.check-result{
	width:750upx;
	height:101upx;
	background:rgba(246,246,246,1);
	font-size: 29upx;
	padding: 0 38upx;
	box-sizing: border-box;
	.check-btn{
		width:283upx;
		height:73upx;
		background:rgba(254,106,114,1);
		border-radius:37upx;
	}
}
	
	
	
.wholesaleShop{
	width: 100%;
	height: auto;
}
/* #ifdef APP-PLUS */
.uni-page-head {
	display: none;
}
.share {
	position: absolute;
	right: 20upx;
	top: 20upx;
	width: 52upx;
	height: 52upx;
	border-radius: 50%;
	background: rgba(0, 0, 0, 0.5);
	image {
		width: 32upx;
		height: auto;
		float: left;
	}
}
/* #endif */

uni-page-head {
	display: none !important;
}
uni-swiper {
	height: 750upx !important;
}
swiper {
	height: 750upx;
}
.item-index{
	bottom: 30upx;
	right: 30upx;
	width:120upx;
	height:50upx;
	line-height: 50upx;
	background:rgba(0,0,0,1);
	opacity:0.3;
	border-radius:25upx;
	color: #FFFFFF;
}
.detail_swiper {
	height: 750upx;
}
.detail-wrap {
	display: flex;
	flex-direction: column;
	word-wrap: break-word;
}

.forbid {
	background: #bfbfbf !important;
}
.richText {
	overflow: hidden;
}
.bigTitle {
	font-size: 36upx;
	font-weight: 500;
	color: rgba(51, 51, 51, 1);
}
.pd-package {
	margin: 0 0 150upx 0;
	background: rgba(255, 255, 255, 1);
	border-radius: 12upx;
	.package-wrap {
		display: flex;
		background: rgba(250, 250, 250, 1);
		border-radius: 10px;
		padding: 20upx 0;
		margin-bottom: 20upx;
		&:first-child {
			background: none;
		}
		> view {
			flex: 2;
			display: flex;
			justify-content: center;
		}
		&.active {
			background: rgba(84, 208, 23, 0.1);
			border-radius: 10upx;
			border: 2upx solid rgba(73, 212, 110, 1);
		}
	}
}

.pd-countdown {
	display: flex;
	justify-content: space-between;
	padding: 10upx 20upx;
	color: white;
	background-image: linear-gradient(90deg, #53b1fa 0%, #388ceb 100%);

	.price {
		display: flex;
		align-items: center;
		font-size: 50upx;
	}

	&.yellow-cd {
		background-image: linear-gradient(90deg, #ffb75a 0%, #e78e00 100%);
	}
}

.buy-num {
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-top: 1px solid #eaeaea;
}
.pd-detail {
	padding-bottom: 100upx;
	overflow: hidden;
	background: #F7F7F7;
}
.buy {
	position: fixed;
	z-index: 10;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 100upx;
	display: flex;
	align-items: center;
	background: white;

	.server {
		width: 100upx;
		text-align: center;
		height: 100%;
		display: block;
		line-height: 0;
		image {
			margin-top: 20upx;
			width: 40upx;
		}
		view {
			line-height: 30upx;
		}
	}
	.bigBtn {
		width: 448upx;
		height: 80upx;
		background: rgba(252, 78, 41, 1);
		border-radius: 40upx;
		color: white;
		font-size: 32upx;
		&.background-blue{
			background: #388ceb;
		}
	}
	.addToCar {
		flex: 2;
		height: 100%;
		> view {
			width: 224upx;
			height: 80upx;
			background: rgba(51, 51, 51, 1);
			border-radius: 50upx 0upx 0upx 50upx;
			color: white;
		}
		image {
			width: 40upx;
			margin-right: 20upx;
		}
	}

	> view {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.buynow {
		flex: 2;
		height: 100%;
		> view {
			width: 224upx;
			height: 80upx;
			background: rgba(252, 78, 41, 1);
			border-radius: 0upx 45upx 45upx 0upx;
			color: white;
		}
	}
}

.detail-wd {
	width: 100%;
	text-align: center;
	position: relative;
	margin-top: 32upx;
	padding: 43upx 36upx 39upx 36upx;
	box-sizing: border-box;
	.betweenBox{
		border:1upx solid rgba(220,220,220,1);
		border-radius:10upx;
		width:677upx;
		height:83upx;
		padding: 0 21upx 0 28upx;
	}
	.right{
		width: 44upx;
		height: 44upx;
		.right-img{
			width: 44upx;
			height: 44upx;
		}
	}
}

.pd-info {
	.price {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.pd-name {
		line-height: 45upx;
	}
}
.pd40 {
	padding: 40upx;
}
.detail_info {
	width: 100%;
	margin: 0 auto;
	background: rgba(255, 255, 255, 1);
	position: relative;
	box-sizing: border-box;
	overflow: hidden;
	padding: 20upx 39upx 47upx 39upx;
	.price {
		font-size: 54upx;
	}
	.name {
		line-height: 45upx;
		letter-spacing: 2upx;
		font-size:36upx;
		font-family:PingFang SC;
		font-weight:500;
		color:rgba(51,51,51,1);
		margin-bottom: 32upx;
	}
	.point {
		margin: 20upx 0;
	}
	.express {
		border-top: 1px dashed #929292;
		padding: 20upx 0 10upx 0;
	}
}

</style>
