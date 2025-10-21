<template>
  <view class="container">

     
      <u-navbar
			title="隐私政策"
			:autoBack="true"
			fixed
			placeholder
			bgColor="#ffffff"
			titleStyle="color: #333333; font-size: 16px; "
		></u-navbar>

      <view class="content-section">
        <view class="privacy-box">
          <template v-for="(section, index) in privacyData" :key="index">
            <!-- 前言部分 -->
            <view class="section" v-if="section.type === 'preface'">
              <text class="text" v-for="(content, idx) in section.contents" :key="idx">{{ content }}</text>
            </view>

            <!-- 其他章节 -->
            <view class="section" v-else>
              <text class="section-title">{{ section.title }}</text>
              <text class="text" v-for="(content, idx) in section.contents" :key="idx">{{ content }}</text>
              <view class="sub-section" v-if="section.subSections">
                <view v-for="(sub, subIdx) in section.subSections" :key="subIdx">
                  <text class="sub-title">{{ sub.title }}</text>
                  <text class="text" v-for="(subContent, contentIdx) in sub.contents" :key="contentIdx">{{ subContent }}</text>
                </view>
              </view>
            </view>
          </template>
        </view>
      </view>

  </view>
</template>

<script setup>
import PageHeader from '@/components/page-header/page-header.vue'
import { privacyData } from './privacy-data.js'
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
    
    .title {
      font-size: 48rpx;
      font-weight: 600;
      color: #1976d2;
      margin-bottom: 8rpx;
      display: block;
    }
    
    .title-en {
      font-size: 20rpx;
      color: #78909c;
      letter-spacing: 8rpx;
      text-transform: uppercase;
      display: block;
      margin-bottom: 16rpx;
    }
    
    .title-decoration {
      position: relative;
      height: 2px;
      width: 120rpx;
      margin: 0 auto;
      
      .line {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        background: linear-gradient(to right, transparent, #1976d2, transparent);
      }
      
      .dot {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 8rpx;
        height: 8rpx;
        background: #1976d2;
        border-radius: 50%;
        box-shadow: 0 0 10rpx rgba(25, 118, 210, 0.3);
      }
    }
  }
}

.content-section {
  padding: 40rpx;
  padding-bottom: 40rpx;
  
  .privacy-box {
    background: #ffffff;
    border-radius: 24rpx;
    padding: 40rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
    
    .section {
      margin-bottom: 40rpx;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .section-title {
        font-size: 32rpx;
        color: #1976d2;
        font-weight: 600;
        margin-bottom: 20rpx;
        display: block;
      }
      
      .text {
        font-size: 28rpx;
        color: #37474f;
        line-height: 1.6;
        margin-bottom: 16rpx;
        display: block;
        
        &:last-child {
          margin-bottom: 0;
        }
      }
      
      .sub-section {
        margin-top: 20rpx;
        padding-left: 30rpx;
        
        .sub-title {
          font-size: 28rpx;
          color: #1976d2;
          font-weight: 500;
          margin-bottom: 12rpx;
          display: block;
        }
      }
    }
  }
}
</style> 