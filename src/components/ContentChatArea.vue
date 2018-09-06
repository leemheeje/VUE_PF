<template>
<div class="chat_area chatInputFieldArea" style="bottom: -60px;">
	<div class="cha_in">
		<div class="v_ch_input">
			<pre class="inb chatInputField">{{paramsData.detailsubj}}</pre>
		</div>
		<span class="v_ch_btn">...</span>
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