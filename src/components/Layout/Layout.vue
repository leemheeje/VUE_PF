<template>
<div class="wrap" :class="vCssClass">
	<Header></Header>
	<Container></Container>
</div>
</template>
<script>
import Header from './../Header.vue';
import Container from './../Container.vue';
export default {
	props: ['vCssClass'],
	components: {
		Header,
		Container,
	},
}
</script>