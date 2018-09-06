<template>
<div class="cont_hd">
	<span class="tit">
    <strong>{{paramsData.tit}}</strong>
    <span class="op_nm"> 방에 입장하셨습니다.</span>
	</span>
	<div class="cont_utl">
		<input type="hidden" name="">
		<a :href="paramsData.href" class="cutl link" title="프로젝트주소새창" target="_blank"></a>
		<a href="#;" class="cutl git"  title="깃헙소스창새창" target="_blank" style="display: none;"></a>
	</div>
</div>
</template>
<script>
export default {
	props: ['menuItemIndex', 'menuItemCrrtMenuIndex'],
	computed: {
		paramsData() {
			return this.$getdata[this.menuItemIndex].data[this.menuItemCrrtMenuIndex];
		}
	}
}
</script>