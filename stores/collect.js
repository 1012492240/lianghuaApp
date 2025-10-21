import { defineStore } from 'pinia'

export const useCollectStore = defineStore('collect', {
    state: () => ({
        collectedItems: [],
        address: '',
        collectTime: ''
    }),
    actions: {
        setCollectedItems(items) {
            this.collectedItems = items
        },
        setCollectInfo(address) {
            this.address = address
            this.collectTime = new Date().toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            })
        },
        clearCollectedItems() {
            this.collectedItems = []
            this.address = ''
            this.collectTime = ''
        }
    }
}) 