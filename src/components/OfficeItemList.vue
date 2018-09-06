<template>
<div class="sub_side_area subSideArea">
	<h3 class="sside_hd">
            <span class="txt ssideHdTit">{{$getdata[menuItemCrrtMenuIndex].name}}</span> - Items List
        </h3>
	<div class="sub_side subSideScrFun">
		<div class="sside_list sSideList">
			<div class="lst active" style="margin-left: 0;" v-for="(item, index) in $getdata[menuItemCrrtMenuIndex].data">
				<a href="javascript:;" class="item lnbsLink" :data-list-snum="index" @click="menuTwoDepth(index)">
                        <div class="item_bx">
                            <div class="img_area">
                                <i class="dot"></i>
                                <span class="img"> 
                                    <img :src="item.img" alt="">
                                 </span>
                             </div>
                             <dl class="txt_list">
                                 <dt>{{item.tit}}</dt>
                                 <dd>
                                     <span class="txt">
                                         {{item.detailsubj}}
                                     </span>
                                     <div class="s_spec">
                                         <span class="s_label js">{{item.mode}}</span>
                                     </div>
                                 </dd>
                             </dl>
                         </div>
                     </a>
			</div>
		</div>
	</div>
</div>
</template>
<script>
export default {
	props: ['menuItemCrrtMenuIndex'],
	methods: {
		menuTwoDepth(i) {
			this.$emit('click', i);
		}
	}
}
</script>