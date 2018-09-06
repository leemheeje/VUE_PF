<template>
<div class="container">
	<div id="pannel" class="ln_pannl">
		<div class="lnb">
			<div class="lnb_in lnbInList">
				<h2 class="lnb_hd">Portfolio</h2>
				<PortfolioList v-for="(item,index) in $getdata" :menuItemParams="item" :menuItemIndex="index" @click="menuOneDepthClick(index)" />
			</div>
		</div>
		<OfficeItemList :menuItemCrrtMenuIndex="crrtMenuIndex" @click="menuTwoDepthClick"></OfficeItemList>
	</div>
	<div id="contentsArea" class="contents">
		<ContentUtill :menuItemIndex="crrtMenuIndex" :menuItemCrrtMenuIndex="crrtMenuTwoIndex"></ContentUtill>
		<Content :menuItemIndex="crrtMenuIndex" :menuItemCrrtMenuIndex="crrtMenuTwoIndex"></Content>
		<ContentChatArea :menuItemIndex="crrtMenuIndex" :menuItemCrrtMenuIndex="crrtMenuTwoIndex"></ContentChatArea>
	</div>
	<ContentRight :menuItemIndex="crrtMenuIndex" :menuItemCrrtMenuIndex="crrtMenuTwoIndex"></ContentRight>
</div>
</template>
<script>
import PortfolioList from './PortfolioList.vue';
import OfficeItemList from './OfficeItemList.vue';
import ContentUtill from './ContentUtill.vue';
import ContentChatArea from './ContentChatArea.vue';
import ContentRight from './ContentRight.vue';
import Content from './Content.vue';
export default {
	props: ['vCssClass'],
	data(){
		return {
			crrtMenuIndex : 0,
			crrtMenuTwoIndex : 0,
		}
	},
	components: {
		PortfolioList,
		OfficeItemList,
		ContentUtill,
		ContentChatArea,
		ContentRight,
		Content,
	},
	methods: {
		menuOneDepthClick(i) {
			this.crrtMenuIndex = i;
			this.crrtMenuTwoIndex = 0;
		},
		menuTwoDepthClick(i){
			this.crrtMenuTwoIndex = i;
		}
	}
}
</script>