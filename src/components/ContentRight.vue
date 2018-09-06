<template>
<div class="as_pannl asPannlInclude">
	<!-- INCLUDE_PATH : /include/asPannlInclude.html -->
	<div class="asp_hd">
		<a href="javascript:;" title="패널" class="pannel_btn" style="visibility: hidden;"></a>
	</div>
	<div class="asp_cont_area">
		<div class="asp_cont">
			<span class="img">
				<img src="//leemheeje.github.io/PUB_DATA/images/thumbnail/pp_ybm.jpg" data-params-project-thumbnail="true" alt="">
			</span>
			<div class="txts">
				<div class="tit" data-params-project-tit="true">{{paramsData.tit}}</div>
				<span class="stit" data-params-project-stit="true">{{paramsData.subj}}</span>
			</div>
		</div>
		<div class="asp_listbx">
			<dl class="asp_list clearfix">
				<dt>프로젝트명:</dt>
				<dd class="" data-params-project-tit="true">{{paramsData.tit}}</dd>
			</dl>
			<dl class="asp_list clearfix">
				<dt>설명:</dt>
				<dd data-params-project-stit="true">{{paramsData.subj}}</dd>
			</dl>
			<dl class="asp_list clearfix">
				<dt>작업기여도:</dt>
				<dd>
					<div class="pt_perc">
						<div class="dots" data-params-project-chatdot="true">
							<div class="val_nu_area">
								<span class="valNu" style="width: 100%;"></span>
							</div>
						</div>
						<span class="num" data-params-project-chat="true">100</span>
					</div>
				</dd>
			</dl>
		</div>
		<div class="cmm_preloader cmmAsPannlPreloader" style="display: none;">
			<div class="loader"></div>
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