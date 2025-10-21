export const formatTime = (date) => {
    const now = new Date()
    const diff = now - date

    // 小于1分钟
    if (diff < 60000) {
        return '刚刚'
    }
    // 小于1小时
    if (diff < 3600000) {
        return Math.floor(diff / 60000) + '分钟前'
    }
    // 小于24小时
    if (diff < 86400000) {
        return Math.floor(diff / 3600000) + '小时前'
    }
    // 小于30天
    if (diff < 2592000000) {
        return Math.floor(diff / 86400000) + '天前'
    }

    // 超过30天显示具体日期
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}`
}


// 格式化时间的函数
export const formatDate = (date) => {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hour = String(d.getHours()).padStart(2, '0')
    const minute = String(d.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day} ${hour}:${minute}`
}