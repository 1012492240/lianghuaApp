import { API_BASE_URL } from '@/config'
import md5 from 'md5'
import { useUserStore } from '@/store/user'

const http = (options) => {
    return new Promise((resolve, reject) => {
        uni.request({
            ...options,
            success: (res) => {
                console.log(res, "res.data.code");
                if (res.data.code >= 200 && res.data.code < 300) {
                    console.log("res返回结果", res,);
                    resolve(res)
                } else {
                    console.log("执行失败123", res,);
                    reject(res)
                }
            },
            fail: (err) => {
                reject(err)
            }
        })
    })
}

// 请求拦截器
const requestInterceptor = (config) => {
    const userStore = useUserStore()
    config.header = config.header || {}

    // 添加token
    if (userStore.token) {
        console.log(userStore.token, "userStore.token");
        config.header['token'] = userStore.token
    }

    // 处理加密字段
    if (config.data?.password) {
        config.data.password = md5(config.data.password)
    }

    return config
}

// API 封装
export const api = {
    // 用户登录
    login: (phone, password) => {
        const config = {
            url: `${API_BASE_URL}/baseInfo/login`,
            method: 'POST',
            data: {
                phone,
                login_type: "1",
                password
            }
        }
        return http(requestInterceptor(config))
    },

    // 保存评论配置
    saveCommentConfig: (data) => {
        const config = {
            url: `${API_BASE_URL}/dy/save_cfg_dy_comment`,
            method: 'POST',
            data,
            header: {
                'Content-Type': 'application/json'
            }
        }
        return http(requestInterceptor(config))
    },

    // 获取评论配置
    getCommentConfig: () => {
        const config = {
            url: `${API_BASE_URL}/dy/get_cfg_dy_comment`,
            method: 'POST'
        }
        return http(requestInterceptor(config))
    },

    // 保存同城配置
    saveSameCityConfig: (data) => {
        const config = {
            url: `${API_BASE_URL}/dy/save_cfg_dy_same_city`,
            method: 'POST',
            data,
            header: {
                'Content-Type': 'application/json'
            }
        }
        return http(requestInterceptor(config))
    },
    // 获取同城配置

    getSameCityConfig: () => {
        const config = {
            url: `${API_BASE_URL}/dy/get_cfg_dy_same_city`,
            method: 'POST'
        }
        return http(requestInterceptor(config))
    },

    // 更新微信消息配置
    updateWechatMessage: (collectBatchId, msgContent) => {
        const config = {
            url: `${API_BASE_URL}/wechat/update_wx_msg`,
            method: 'POST',
            data: {
                collect_batch_id: collectBatchId,
                msg_content: msgContent
            }
        }
        return http(requestInterceptor(config))
    },

    // 获取点赞配置
    getLikeConfig: () => {
        const config = {
            url: `${API_BASE_URL}/dy/get_cfg_dy_like`,
            method: 'POST'
        }
        return http(requestInterceptor(config))
    },

    // 保存点赞配置
    saveLikeConfig: (data) => {
        const config = {
            url: `${API_BASE_URL}/dy/save_cfg_dy_like`,
            method: 'POST',
            data,
            header: {
                'Content-Type': 'application/json'
            }
        }
        return http(requestInterceptor(config))
    },

    // 获取采集记录列表
    getCollectHistory: (params) => {
        const config = {
            url: `${API_BASE_URL}/collect/history?page=${params.page}&size=${params.size}`,
            method: 'GET',
            data: {
                key_words: params.keyword,
                collect_type: params.type === 'industry' ? '0' : params.type === 'nearby' ? '1' : '',
                // page: params.page,
                // size: params.size
            }
        }
        return http(requestInterceptor(config))
    },

    // 获取采集统计数据
    getCollectStats: () => {
        const config = {
            url: `${API_BASE_URL}/collect/statistics`,
            method: 'GET'
        }
        return http(requestInterceptor(config))
    },

    // 获取采集记录详情
    getCollectDetail: (collectBatchId) => {
        const config = {
            url: `${API_BASE_URL}/collect/detail`,
            method: 'GET',
            data: {
                collect_batch_id: collectBatchId
            }
        }
        return http(requestInterceptor(config))
    },

    // 获取消息提示词配置
    getMsgPrompt: () => {
        const config = {
            url: `${API_BASE_URL}/dy/get_cfg_msg_prompt`,
            method: 'POST'
        }
        return http(requestInterceptor(config))
    },

    // 保存消息提示词配置
    saveMsgPrompt: (data) => {
        const config = {
            url: `${API_BASE_URL}/dy/save_cfg_msg_prompt`,
            method: 'POST',
            data,
            header: {
                'Content-Type': 'application/json'
            }
        }
        return http(requestInterceptor(config))
    },

    // 设置微信加好友限制
    getWxAddFriendLimit: (data) => {
        const config = {
            url: `${API_BASE_URL}/wechat/get_wx_add_friend_limit`,
            method: 'POST',
            data,
            header: {
                'Content-Type': 'application/json'
            }
        }
        return http(requestInterceptor(config))
    },

    // 获取用户基础设置
    getUserConfig: () => {
        const config = {
            url: `${API_BASE_URL}/baseInfo/get_user_config`,
            method: 'POST'
        }
        return http(requestInterceptor(config))
    },
    // 获取系统基础设置
    getSysConfig: () => {
        const config = {
            url: `${API_BASE_URL}/baseInfo/get_sys_config`,
            method: 'POST'
        }
        return http(requestInterceptor(config))
    },

    // 修改用户基础设置
    updateUserConfig: (configContent) => {
        const config = {
            url: `${API_BASE_URL}/baseInfo/update_user_config`,
            method: 'POST',
            data: {
                config_content: configContent
            },
            header: {
                'Content-Type': 'application/json'
            }
        }
        return http(requestInterceptor(config))
    },

    // 获取用户代理统计数据
    getUserAgentStats: () => {
        const config = {
            url: `${API_BASE_URL}/baseInfo/get_user_agent_stats`,
            method: 'POST'
        }
        return http(requestInterceptor(config))
    },
    //

}

// 响应拦截器
export const responseHandler = {
    success: (res) => {
        console.log('success成功')
        const userStore = useUserStore()

        console.log("res======失败", res,);
        // res.data 是后端返回的数据
        const response = res.data   // 兼容直接传入data的情况

        console.log("测试data2222");
        if (response.code != '200' && response.code != 200) {

            uni.showToast({
                title: response.message || '请求失败',
                icon: 'none',
                duration: 3000
            })
            return Promise.reject(response)
        }
        return response.data  // 返回业务数据
    },
    error: (err) => {
        console.log("测试data");
        console.log(err, 'err')
        const response = err.data   // 兼容直接传入data的情况

        const userStore = useUserStore()
        if (response.code == '401') {
            const pages = getCurrentPages(); // 获取页面栈
            if (pages.length > 0) {
                const currentPage = pages[pages.length - 1]; // 获取当前页面
                const currentRoute = currentPage.route; // 获取当前页面路径

                console.log(currentRoute, 'pages/login/index', 'cccccc')

                if (currentRoute == "pages/login/index") {
                    uni.showToast({
                        title: err.data.message,
                        duration: 2000,
                        icon: 'none',
                    })
                } else {
                    userStore.logout()
                    uni.showToast({
                        title: err.data.message,
                        duration: 2000,
                        icon: 'none',
                    })
                    setTimeout(() => {
                        uni.reLaunch({
                            url: '/pages/login/index'
                        })
                    }, 2000)
                }
            }
        } else {
			console.log('执行333')
            uni.showToast({
                title: err.data.message,
                duration: 2000,
                icon: 'none',
            })
        }

        // const msg = err.errMsg || '请求失败'
        // if (!msg.includes('request:fail')) {
        //     uni.showToast({ title: msg, icon: 'none', duration: 3000 })
        // } else {
        //     uni.showToast({ title: '网络连接异常，请检查网络', icon: 'none', duration: 3000 })
        // }
        return Promise.reject(err)
    }
}