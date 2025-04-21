<template>
	<fui-background-image src="@/src/static/Home2 (1).jpgHome2(1).jpg">  </fui-background-image>
  <AppSwiper/>

  <up-gap height="10"></up-gap>
  <!--  搜索-->
  <Search/>
  <up-gap height="10"></up-gap>
  <AppTags/>

  <AppWaterFall/>
  <div class="bg-blue"></div>

</template>
<script setup lang="ts">
import AppSwiper from "@/components/home/AppSwiper.vue";
import Search from "@/components/home/Search.vue";
import AppTags from "@/components/home/AppTags.vue";
import AppWaterFall from "@/components/home/AppWaterFall.vue";



</script>