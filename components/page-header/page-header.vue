<template>
	<view class="page-header">
		<!-- 状态栏 -->
		<status-bar class="status-bar"></status-bar>
		
		<!-- 标题插槽内容 (固定定位) -->
	
		<view class="header-title" :style="{ position: 'fixed', top: statusBarHeight + 'px', left: 0, right: 0, zIndex: 100 }">
			<slot name="title-bar"></slot>
		</view>
		<!-- 页面内容区域 -->
		<view class="header-content" :style="{ paddingTop: statusBarHeight + 54 + 'px' }">	
			<!-- 页面内容  -->
			<slot></slot>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

// 获取状态栏高度
const statusBarHeight = ref(0)

// 计算总padding (状态栏高度 + 固定标题栏高度)
const computedPadding = computed(() => {
  // 假设固定标题栏高度为45px
  return statusBarHeight.value + 45
})

onMounted(() => {
	uni.getSystemInfo({
		success: (res) => {
			statusBarHeight.value = res.statusBarHeight
		}
	})
})
</script>

<style lang="scss">
.page-header {
	position: relative;
	width: 100%;
	z-index: 100;

	.status-bar { 
		background-color: #121212;
	}
	
	.header-content {
		position: relative;
		width: 100%;
	}
}
</style>