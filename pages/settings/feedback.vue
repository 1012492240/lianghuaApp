<template>
  <view class="container">
    <view class="feedback-section">
      <!-- 问题类型选择 -->
      <view class="section-block">
        <text class="section-title">问题类型</text>
        <view class="type-list">
          <view
            v-for="(item, index) in feedbackTypes"
            :key="index"
            class="type-item"
            :class="{ active: selectedType === index }"
            @tap="selectedType = index"
          >
            <text>{{ item }}</text>
          </view>
        </view>
      </view>

      <!-- 问题描述输入区 -->
      <view class="section-block">
        <text class="section-title">问题描述</text>
        <view class="input-wrapper">
          <textarea
            v-model="content"
            class="content-input"
            placeholder="请详细描述您遇到的问题..."
            placeholder-style="color: #A3AED0"
          />
        </view>
      </view>

      <!-- 联系方式输入区 -->
      <view class="section-block">
        <text class="section-title">联系方式</text>
        <view class="input-wrapper">
          <input
            v-model="contact"
            class="contact-input"
            placeholder="请输入您的手机号或邮箱（选填）"
            placeholder-style="color: #A3AED0"
          />
        </view>
      </view>

      <!-- 提交按钮 -->
      <view class="button-wrapper">
        <button class="submit-btn" @tap="submitFeedback">提交反馈</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import PageHeader from "@/components/page-header/page-header.vue";
import { ref } from "vue";

const feedbackTypes = ["功能异常", "体验问题", "产品建议", "其他"];
const selectedType = ref(0);
const content = ref("");
const contact = ref("");

const submitFeedback = () => {
  if (!content.value.trim()) {
    uni.showToast({
      title: "请描述您的问题",
      icon: "none",
    });
    return;
  }

  uni.showLoading({ title: "提交中..." });
  setTimeout(() => {
    uni.hideLoading();
    uni.showToast({
      title: "提交成功",
      icon: "success",
    });
    content.value = "";
    contact.value = "";
  }, 1500);
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #f8f9fe;
}

.feedback-section {
  padding: 20px;

  .section-block {
    margin-bottom: 24px;

    .section-title {
      font-size: 15px;
      color: #2b3674;
      font-weight: 500;
      margin-bottom: 12px;
      display: block;
    }
  }

  .type-list {
    display: flex;
    flex-wrap: wrap;

    .type-item {
      margin: 5rpx 12rpx;

      padding: 8px 20px;
      background: #ffffff;
      border-radius: 12px;
      border: 1px solid #e0e5f2;
      transition: all 0.3s ease;

      text {
        font-size: 14px;
        color: #2b3674;
      }

      &.active {
        background: rgba(25, 137, 250, 0.1);
        border-color: #1989fa;

        text {
          color: #1989fa;
          font-weight: 500;
        }
      }

      &:active {
        opacity: 0.8;
      }
    }
  }

  .input-wrapper {
    background: #ffffff;
    border-radius: 16px;
    border: 1px solid #e0e5f2;
    overflow: hidden;
    transition: all 0.3s ease;

    &:focus-within {
      border-color: #1989fa;
      box-shadow: 0 0 0 2px rgba(25, 137, 250, 0.1);
    }
  }

  .content-input {
    width: 100%;
    height: 120px;
    padding: 16px;
    font-size: 14px;
    color: #2b3674;
    line-height: 1.5;
  }

  .contact-input {
    width: 100%;
    height: 48px;
    padding: 0 16px;
    font-size: 14px;
    color: #2b3674;
  }

  .button-wrapper {
    padding: 24px 0;
  }

  .submit-btn {
    width: 100%;
    height: 48px;
    background: #1989fa;
    border-radius: 12px;
    font-size: 16px;
    color: #ffffff;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    transition: all 0.3s ease;

    &:active {
      transform: scale(0.98);
      opacity: 0.9;
    }
  }
}
</style> 