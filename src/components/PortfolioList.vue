<template>
<ul class="lnb_list">
	<li class="lst" :class="'lst' + menuItemIndex">
		<a href="javascript:;" class="mn lnbLink" @click="menuOneDepth">
			<span class="txt">{{menuItemParams.name}}</span>
			<i class="num">{{menuItemParams.data.length}}</i>
		</a>
	</li>
</ul>
</template>
<script>
export default {
	props: ['menuItemParams', 'menuItemIndex'],
	methods: {
		menuOneDepth() {
			this.$emit('click');
		}
	}
}
</script>