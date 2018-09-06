<template>
<div class="cont_msg contentScrFun">
	<div class="cont_msg_in">
		<div class="msg_bx self">
			<div class="msg_in msgSelfBox">
				<div class="msg_img">
					<a href="javascript:;" class="img">
						<img src="./../assets/images/common/pic.png" alt="" />
					</a>
					<div class="nm">임희재</div>
				</div>
				<div class="msg_area">
					<pre class="txt">{{paramsData.detailsubj}}</pre>
				</div>
			</div>
			<div class="cmm_preloader cmmChatPreloader">
				<div class="loader"></div>
			</div>
		</div>
		<div class="animateMotion msg_bx selfie info">
			<div class="msg_in self">
				<div class="msg_img">
					<span class="img">
						<img :src="paramsData.img" alt="" />
					</span>
					<div class="nm"></div>
				</div>
				<div class="msg_area">
					<div class="pf_info">
						<div class="pfinfo_in">
							<div class="thumb">
								<span class="img">
									<img :src="paramsData.thumbnail" alt="">
								</span>
							</div>
							<div class="txt_bx">
								<dl class="txt">
									<dt>{{paramsData.tit}}</dt>
									<dd>{{paramsData.subj}}</dd>
								</dl>
								<div class="s_spec"> </div>
								<div class="btn_wrap">
									<a :href="paramsData.href" class="btn blue ico ico_link" target="_blank" title="새창">웹사이트 바로가기</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="msg_bx_imgs">
		</div>
	</div>
</div>
</template>
<script>
export default {
	props: ['menuItemIndex', 'menuItemCrrtMenuIndex'],
	computed:{
		paramsData(){
			return this.$getdata[this.menuItemIndex].data[this.menuItemCrrtMenuIndex];
		}
	}
}
</script>