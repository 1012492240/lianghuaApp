import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        token: uni.getStorageSync('token') || null,
        userInfo: null,
    }),

    actions: {
        login(token, userInfo) {
            this.token = token
            this.userInfo = userInfo
            uni.setStorageSync('token', token)
            uni.setStorageSync('userInfo', userInfo)
        },

        logout() {
            this.token = null
            this.userInfo = null
            uni.removeStorageSync('token')
            uni.removeStorageSync('userInfo')
        },


    }
})