<template>
	<view class="pc-wrap">
		<view class="pro-type relative">
			<!-- 大类 -->
			<scroll-view id="haha" class="pro-big-type" :style="{ height: windowHeight + 'px' }" scroll-with-animation="true" scroll-y="true" :scroll-into-view="bigCateId">
				<view
					class="pro-type-item relative"
					v-for="(item, index) in bigCateArr"
					:key="item.id"
					:class="showItem == index ? 'active' : ''"
					:data-id="item.id"
					:data-index="index"
					:data-bigcode="item.code"
					@click="bigCateTap"
				>
					<view class="flex-box" :class="showItem == index ? 'orange' : ''">
					{{ item.itemName }}
					<view class="line">
						
					</view>
					</view>
				</view>
			</scroll-view>

			<!-- 大类下的小类 -->
			<scroll-view
				class="smallCate-frame"
				:style="{ height: windowHeight + 'px' }"
				scroll-with-animation="true"
				scroll-y="true"
				:scroll-into-view="bigCateId"
			>	
				<view v-for="(item, index) in bigCateArr" :key="item.id" v-if="false">
					<view class="bigCate-name" :id="'bigcate' + index">
						<image lazy-load :src="item.image"></image>
						<view>{{ item.itemName }}</view>
					</view>
					<view class="pro-sm-type clearfix ">
						<block v-for="(cateItem, cateIndex) in item.children" :key="cateItem.id">
							<view class="pst-item">
								<image lazy-load v-if="cateItem.image != ''" :src="cateItem.image" />
								<image lazy-load v-else src="/static/logo.png" />
								<view class="title">{{ cateItem.itemName }}</view>
							</view>
						</block>
					</view>
				</view>
				<view class="pro-sm-type clearfix " v-if="bigCateArr.length">
					<block v-for="(cateItem, cateIndex) in bigCateArr[subIndex].children" :key="cateItem.id">
						<navigator :url="'product-list?type=2&smallCategory=' + cateItem.code">
							<view class="pst-item">
								<image lazy-load v-if="cateItem.image != ''" :src="cateItem.image" />
								<image lazy-load v-else src="/static/img/logo.png" />
								<view class="title">{{ cateItem.itemName }}</view>
							</view>
						</navigator>
					</block>
				</view>
				<view class="pd20 gray tac fs36" v-if="!(bigCateArr && bigCateArr[subIndex] && bigCateArr[subIndex].children && bigCateArr[subIndex].children.length)">
					暂无产品
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			bigCateArr: [],
			smallCateArr: [],
			showItem: 0,
			categoryCode: '',
			categoryId: 0,
			code: '',
			bigCateId: '',
			windowHeight: '',
			subIndex: 0
		};
	},
	computed: {
		// 多语言
		i18n () {
			return this.$t('index')  
		}  
	},
	onShow() {
		uni.setNavigationBarTitle({
			title:this.$t('tabs.product')
		});
	},
	onPullDownRefresh() {
		this.bigCateArr = [];
		this.smallCateArr = [];
		this.subIndex = 0;
		this.showItem = 0;
		this.categoryId = 0;
		let that = this;
		uni.getSystemInfo({
			success: function(res) {
				console.log(res);
				that.windowHeight = res.windowHeight;
			},
		})
		that.getBigCateGory();
		setTimeout( ()=>{
			 uni.stopPullDownRefresh();
		}, 1000);
	},
	onLoad() {
		let that = this;
		uni.getSystemInfo({
			success: function(res) {
				console.log(res);
				that.windowHeight = res.windowHeight;
			}
		});
		that.getBigCateGory();
	},
	methods: {
		// 获取产品大分类
		getBigCateGory() {
			let that = this;
			this.apiUrl
				.getProductTree({
					data: {
						type: 2
					}
				})
				.then(res => {
					console.log(res);
					if (res.data.status == 1) {
						let mydata = res.data.data;
						console.log(mydata);
						mydata.forEach(item => {
							item.children = this.setImgSize(item.children, '260x260','image');
						});
						that.bigCateArr = mydata;
					}
				});
		},
		bigCateTap(e) {
			let that = this;
			if (e) {
				that.showItem = e.target.dataset.index;
				(that.categoryId = e.target.dataset.id), (that.categoryCode = e.target.dataset.bigcode);
				that.bigCateId = 'bigcate' + e.target.dataset.index;
				this.subIndex = e.target.dataset.index;
			} else {
				that.showItem = 0;
				that.categoryId = that.bigCateArr[0].id;
				that.categoryCode = that.bigCateArr[0].code;
			}
		}
	}
};
</script>
<style lang="less" scoped>
@import url('./product-category.less');
.line{
	position: absolute;
	left: 0;
	top: 50%;
	width:6upx;
	height:47upx;
	background:#FE6A72;
	transform: translateY(-50%);
	display: none;
}
</style>
