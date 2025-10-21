<template>
  <view class="app-container">
    <view class="page-container">
      <page></page>
    </view>
  </view>
</template>



<script setup>
import { onLaunch } from "@dcloudio/uni-app";
import { formatTime } from "@/utils/date.js";
// import eventBus from "@/utils/eventBus";
import { useUserStore } from "@/store/user";
import { reactive, ref, onMounted } from "vue";
import checkUpdate from "@/uni_modules/uni-upgrade-center-app/utils/check-update";
const noticeList = ref([]);

const userStore = useUserStore();
// 加载保存的通知列表
const loadNoticeList = () => {
  try {
    const savedList = uni.getStorageSync("noticeList");
    if (savedList) {
      console.log("执行");
      noticeList.value = JSON.parse(savedList);
    }
  } catch (e) {
    console.error("加载通知列表失败：", e);
  }
};

// 处理推送消息
// const handlePushMessage = (res) => {
//   console.log("收到推送消息:", res);
//   try {
//     eventBus.emit("pushMessage", res); // 触发全局事件
//   } catch (e) {
//     console.log("error", e);
//   }
// };

// onMounted(() => {
//   uni.getPushClientId({
//     success: (res) => {
//       let push_clientid = res.cid;
//       console.log("客户端推送标识:", push_clientid);
//     },
//     fail(err) {
//       console.log(err);
//     },
//   });
//   uni.onPushMessage(handlePushMessage);
// });

onLaunch(() => {
  // checkUpdate()
  // 添加路由拦截
  // const whiteList = ['/pages/login/index'] // 白名单

  // // 拦截所有导航方法
  // const interceptors = ['navigateTo', 'redirectTo', 'reLaunch', 'switchTab']

  // interceptors.forEach(method => {
  // 	uni.addInterceptor(method, {
  // 		invoke(e) {
  // 			// 检查是否是白名单页面
  // 			if (!userStore.isLogin && !whiteList.some(path => e.url.includes(path))) {
  // 				uni.reLaunch({ url: '/pages/login/index' })
  // 				return false
  // 			}
  // 			return true
  // 		}
  // 	})
  // })

  // 初始检查登录状态
  // if (!userStore.token) {
  //   const userStore = useUserStore();
  //   console.log(userStore, "userStore");
  //   // 确保在启动时如果未登录，一定会跳转到登录页
  //   setTimeout(() => {
  //     uni.reLaunch({ url: "/pages/login/index" });
  //   }, 0);
  // }
});
</script>

<style lang="scss">
@import "uview-plus/index.scss";

@keyframes tabItemGlow {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
}
</style>
