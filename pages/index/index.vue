<template>
  <view class="container">
    <page-header>
      <template #title-bar>
        <!-- 顶部标题栏 (固定定位) -->
        <view class="header">
          <view class="header-content">
            <u-icon name="account" size="22" @click="goToUser"></u-icon>
            <text class="app-title">首页</text>
            <u-icon name="chat" size="22" @click="goToNotice"></u-icon>
          </view>
        </view>
      </template>

<view style="padding: 0 12px;">
      <!-- 轮播图 -->
      <view class="swiper-section">
        <swiper 
          class="banner-swiper" 
          indicator-dots 
          autoplay 
          interval="5000" 
          duration="1000" 
          circular
          indicator-color="rgba(255, 255, 255, 0.3)"
          indicator-active-color="#f3d535"
        >
          <swiper-item v-for="(item, index) in bannerList" :key="index">
 
             <image 
                src="/static/bian.png" 
                style="width: 100%;"
                mode="aspectFill" 
                class="swiper-image"
                @click="handleBannerClick(item)"
              ></image>
   
          </swiper-item>
          
        </swiper>
      </view>

      <!-- API授权按钮 -->
      <view class="api-auth-section">
        <view class="api-auth-button" @click="goToExchange">
          <view class="api-icon">
            <u-icon name="setting" size="22" color="#fff"></u-icon>
          </view>
          <view class="api-content">
            <text class="api-title">API授权</text>
            <text class="api-desc">连接交易所账户进行量化交易</text>
          </view>
          <view class="api-arrow">
            <u-icon name="arrow-right" size="18" color="#868e96"></u-icon>
          </view>
        </view>
      </view>

      <!-- 其他功能区 -->
      <view class="other-functions">
        <!-- 第一行 -->
        <view class="function-row">
          <!-- 邀请奖励 -->
          <view class="function-item" @click="goToInvite">
            <view class="function-icon">
              <u-icon name="gift" size="18" color="#fff"></u-icon>
            </view>
            <text class="function-text">邀请奖励</text>
          </view>
          
          <!-- 我的社区 -->
          <view class="function-item" @click="goToCommunity">
            <view class="function-icon">
              <u-icon name="chat" size="18" color="#fff"></u-icon>
            </view>
            <text class="function-text">我的社区</text>
          </view>
          
          <!-- 激活套餐 -->
          <view class="function-item" @click="goToActivate">
            <view class="function-icon">
              <u-icon name="checkmark-circle" size="18" color="#fff"></u-icon>
            </view>
            <text class="function-text">激活套餐</text>
          </view>
        </view>
        
        <!-- 第二行 -->
        <view class="function-row">
          <!-- 购买套餐 -->
          <view class="function-item" @click="goToPurchase">
            <view class="function-icon">
              <u-icon name="bag" size="18" color="#fff"></u-icon>
            </view>
            <text class="function-text">购买套餐</text>
          </view>
          
          <!-- 排行榜 -->
          <view class="function-item" @click="goToRanking">
            <view class="function-icon">
              <u-icon name="order" size="18" color="#fff"></u-icon>
            </view>
            <text class="function-text">排行榜</text>
          </view>
          
          <!-- 占位 -->
          <view class="function-item placeholder"></view>
        </view>
      </view>

      <!-- 系统公告 -->
      <view class="notice-section">
        <view class="section-header">
          <text class="section-title">系统公告</text>
          <text class="more-text" @click="goToNotice">更多 ></text>
        </view>
        <view class="notice-content" @click="goToNotice">
          <u-icon name="volume" size="16" color="#868e96"></u-icon>
          <text class="notice-text">系统将于今晚23:00-24:00进行维护升级</text>
        </view>
      </view>

      <!-- 行情列表 -->
      <view class="market-section">
        <view class="section-header">
          <text class="section-title">实时行情</text>
          <text class="more-text" @click="goToMarket">更多 ></text>
        </view>
        <view class="market-list">
          <view class="market-item" v-for="(coin, index) in marketData" :key="index" @click="goToTrade(coin.symbol)">
            <view class="coin-info">
              <view class="coin-name">
                <text>{{ coin.name }}</text>
                <text class="coin-symbol">{{ coin.symbol }}</text>
              </view>
            </view>
            <view class="coin-price">
              <text class="price">¥{{ coin.price }}</text>
              <text :class="coin.change.startsWith('+') ? 'change-up' : 'change-down'">{{ coin.change }}</text>
            </view>
          </view>
        </view>
      </view>

</view>
      <!-- 底部导航占位 -->
      <view class="bottom-placeholder"></view>
    </page-header>
  </view>
</template>

<script setup>
import { ref } from "vue";
import PageHeader from "@/components/page-header/page-header.vue";
 
// 轮播图数据
const bannerList = ref([
  {
    image: "/static/bian.png",
    title: "智能量化交易系统",
    url: "/static/bian.png"
  },
  {
  image: "/static/bian.png",
    title: "多重安全保障",
    url: "/pages/task/list"
  },
  {
     image: "/static/bian.png",
    title: "24小时稳定运行",
    url: "/pages/task/list"
  }
]);

// 行情数据
const marketData = ref([
  {
    name: "比特币",
    symbol: "BTC",
    price: "350,000.00",
    change: "+2.5%"
  },
  {
    name: "以太坊",
    symbol: "ETH",
    price: "25,000.00",
    change: "-1.2%"
  },
  {
    name: "狗狗币",
    symbol: "DOGE",
    price: "1.20",
    change: "+5.8%"
  },
  {
    name: "瑞波币",
    symbol: "XRP",
    price: "5.80",
    change: "+0.8%"
  }
]);

// 轮播图点击处理
const handleBannerClick = (item) => {
  uni.navigateTo({ url: item.url });
};

// 导航函数
const goToExchange = () => {
  uni.navigateTo({ url: "/pages/task/list" });
};

const goToInvite = () => {
  uni.navigateTo({ url: "/pages/task/list" });
};

const goToCommunity = () => {
  uni.navigateTo({ url: "/pages/task/list" });
};

const goToActivate = () => {
  uni.navigateTo({ url: "/pages/task/list" });
};

const goToPurchase = () => {
  uni.navigateTo({ url: "/pages/task/list" });
};

const goToRanking = () => {
  uni.navigateTo({ url: "/pages/task/list" });
};

const goToNotice = () => {
  uni.navigateTo({ url: "/pages/notice/index" });
};

const goToMarket = () => {
  uni.navigateTo({ url: "/pages/task/list" });
};

const goToTrade = (symbol) => {
  uni.navigateTo({ url: "/pages/task/list" });
};

const goToUser = () => {
  uni.navigateTo({ url: "/pages/my/index" });
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #000000;
  /* 隐藏滚动条 */
  ::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
}

/* 全局隐藏滚动条 */
::-webkit-scrollbar {
  display: none;
}

.header {
  height: 45px;
  background-color: #121212;
  // background-color: white;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.5);
  border-bottom: 1px solid #333333;
  transition: all 0.3s ease;
  z-index: 9999;

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    padding: 0 12px;
  }

  .app-title {
    font-size: 16px;
    font-weight: 500;
    color: #f3d535;
  }
}

.swiper-section {
  margin: 15px 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  border: 1px solid #333333;
  
  .banner-swiper {
    height: 140px;
    border-radius: 12px;
    
    .swiper-item {

    }
  }
}

.api-auth-section {
  margin: 15px 0;
  
  .api-auth-button {
    background: linear-gradient(90deg, #121212, #222222);
    border: 1px solid #f3d535;
    border-radius: 12px;
    padding: 15px;
    display: flex;
    align-items: center;
    box-shadow: 0 4px 15px rgba(243, 213, 53, 0.2);
    transition: all 0.3s ease;
    
    &:active {
      transform: translateY(2px);
      box-shadow: 0 2px 10px rgba(243, 213, 53, 0.2);
    }
    
    .api-icon {
      width: 40px;
      height: 40px;
      background: rgba(243, 213, 53, 0.2);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      border: 1px solid #f3d535;
    }
    
    .api-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
      
      .api-title {
        font-size: 16px;
        font-weight: 500;
        color: #f3d535;
      }
      
      .api-desc {
        font-size: 12px;
        color: rgba(243, 213, 53, 0.8);
      }
    }
    
    .api-arrow {
      margin-left: 10px;
      
      ::v-deep .u-icon {
        color: #f3d535 !important;
      }
    }
  }
}

.other-functions {
  background-color: #121212;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.5);
  border: 1px solid #333333;
  
  .function-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .function-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      width: 32%;
      
      .function-icon {
        width: 38px;
        height: 38px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
        transition: all 0.2s ease;
        background: #222222;
        border: 1px solid #444444;
      }
      
      .function-text {
        font-size: 12px;
        color: #cccccc;
        text-align: center;
      }
      
      &:active {
        .function-icon {
          transform: scale(0.95);
          border-color: #f3d535;
        }
        
        .function-text {
          color: #f3d535;
        }
      }
    }
    
    .placeholder {
      visibility: hidden;
    }
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

  .section-title {
    font-size: 16px;
    font-weight: 500;
    color: #f3d535;
  }

  .more-text {
    font-size: 13px;
    color: #888888;
  }
}

.notice-section {
  background-color: #121212;
  border-radius: 12px;
  padding: 12px 15px;
  margin-bottom: 15px;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.5);
  border: 1px solid #333333;

  .notice-content {
    display: flex;
    align-items: center;
    gap: 8px;

    .notice-text {
      flex: 1;
      font-size: 13px;
      color: #aaaaaa;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

.market-section {
  background-color: #121212;
  border-radius: 12px;
  padding: 12px 15px;
  margin-bottom: 15px;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.5);
  border: 1px solid #333333;

  .market-list {
    .market-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #333333;

      &:last-child {
        border-bottom: none;
      }

      .coin-info {
        .coin-name {
          display: flex;
          flex-direction: column;
          gap: 4px;

          text {
            font-size: 15px;
            color: #ffffff;
            font-weight: 500;
          }

          .coin-symbol {
            font-size: 12px;
            color: #888888;
            font-weight: normal;
          }
        }
      }

      .coin-price {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 4px;

        .price {
          font-size: 15px;
          color: #ffffff;
          font-weight: 500;
        }

        .change-up {
          font-size: 13px;
          color: #4caf50;
        }

        .change-down {
          font-size: 13px;
          color: #f44336;
        }
      }
    }
  }
}

.bottom-placeholder {
  height: 15px;
}
</style>