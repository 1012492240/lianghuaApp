<template>
	<view class="container">
		<page-header>
			<view class="header-section">
				<view class="title-wrapper">
					<text class="title">筛选词管理</text>
					<text class="title-en">FILTER WORDS</text>
					<view class="title-decoration">
						<view class="line"></view>
						<view class="dot"></view>
					</view>
				</view>
			</view>

			<view class="content-section">
				<!-- 添加筛选词 -->
				<view class="add-section">
					<view class="input-wrapper">
						<u-icon name="plus" size="40rpx" color="#6C7A8F"></u-icon>
						<input 
							type="text"
							v-model="newWord"
							placeholder="请输入筛选词"
							placeholder-class="placeholder"
						/>
					</view>
					<view class="add-btn" @tap="handleAdd">
						<text>添加</text>
					</view>
				</view>

				<!-- 筛选词列表 -->
				<view class="words-list">
					<view 
						class="word-item" 
						v-for="(word, index) in filterWords" 
						:key="index"
						:class="{ active: selectedWords.includes(word) }"
						@tap="toggleSelect(word)"
					>
						<text class="word-text">{{ word }}</text>
						<view class="delete-btn" @tap.stop="handleDelete(index)">
							<u-icon name="close" size="32rpx" color="#999"></u-icon>
						</view>
					</view>
				</view>
			</view>

			<!-- 底部确认按钮 -->
			<view class="footer">
				<view class="confirm-btn" @tap="handleConfirm">
					<text>确认选择</text>
				</view>
			</view>
		</page-header>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/page-header/page-header.vue'

const newWord = ref('')
const filterWords = ref([])
const selectedWords = ref([])

// 从本地存储加载筛选词
onMounted(() => {
	const stored = uni.getStorageSync('filterWords')
  
	if (stored) {
		filterWords.value = JSON.parse(stored)
	}
	
	// 获取页面传递的已选择词
	const pages = getCurrentPages()

	const currentPage = pages[pages.length - 1]
    console.log(currentPage.options.selected,'currentPage')
	if (currentPage && currentPage.options && currentPage.options.selected) {
		selectedWords.value = currentPage.options.selected.split(',').filter(Boolean)
      
	}
})

// 添加新筛选词
const handleAdd = () => {
	if (!newWord.value.trim()) {
		uni.showToast({
			title: '请输入筛选词',
			icon: 'none'
		})
		return
	}
	
	if (filterWords.value.includes(newWord.value.trim())) {
		uni.showToast({
			title: '该筛选词已存在',
			icon: 'none'
		})
		return
	}
	
	filterWords.value.push(newWord.value.trim())
	uni.setStorageSync('filterWords', JSON.stringify(filterWords.value))
	newWord.value = ''
}

// 删除筛选词
const handleDelete = (index) => {
	filterWords.value.splice(index, 1)
	uni.setStorageSync('filterWords', JSON.stringify(filterWords.value))
	// 如果删除的词在已选中列表中，也要移除
	selectedWords.value = selectedWords.value.filter(word => filterWords.value.includes(word))
}

// 切换选择状态
const toggleSelect = (word) => {
	const index = selectedWords.value.indexOf(word)
	if (index > -1) {
		selectedWords.value.splice(index, 1)
	} else {
		selectedWords.value.push(word)
	}
}

// 确认选择
const handleConfirm = () => {
	// 使用 uni.$emit 发送事件
	uni.$emit('updateFilterWords', selectedWords.value)
	
	// 返回上一页
	uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.container {
	min-height: 100vh;
	background: linear-gradient(180deg, #f8faff 0%, #e3f2fd 100%);
}

.header-section {
	padding: 60rpx 40rpx;
	
	.title-wrapper {
		text-align: center;
		// 保持与其他页面相同的标题样式...
	}
}

.content-section {
	padding: 0 40rpx;
	
	.add-section {
		display: flex;
		gap: 20rpx;
		margin-bottom: 40rpx;
		
		.input-wrapper {
			flex: 1;
			display: flex;
			align-items: center;
			gap: 20rpx;
			background: #ffffff;
			height: 88rpx;
			border-radius: 16rpx;
			padding: 0 30rpx;
			box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
			
			input {
				flex: 1;
				height: 100%;
				font-size: 28rpx;
				color: #37474f;
			}
		}
		
		.add-btn {
			width: 160rpx;
			background: #1976d2;
			border-radius: 16rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			
			text {
				color: #ffffff;
				font-size: 28rpx;
			}
		}
	}
	
	.words-list {
		display: flex;
		flex-wrap: wrap;
		gap: 20rpx;
		
		.word-item {
			background: #ffffff;
			border-radius: 12rpx;
			padding: 16rpx 24rpx;
			display: flex;
			align-items: center;
			gap: 16rpx;
			box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
			transition: all 0.3s ease;
			
			&.active {
				background: #1976d2;
				.word-text {
					color: #ffffff;
				}
			}
			
			.word-text {
				font-size: 28rpx;
				color: #37474f;
			}
			
			.delete-btn {
				padding: 8rpx;
			}
		}
	}
}

.footer {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	padding: 40rpx;
	background: #ffffff;
	box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
	
	.confirm-btn {
		height: 88rpx;
		background: #1976d2;
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		
		text {
			color: #ffffff;
			font-size: 32rpx;
			font-weight: 500;
		}
		
		&:active {
			transform: translateY(2rpx);
			background: #1565c0;
		}
	}
}
</style> 