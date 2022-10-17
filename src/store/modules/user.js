import api from '@/api'
import router from '@/router'

const state = {
    token: "",
    username: '',
    useravatar: '',
    user_id: '',
    fbtoken: '',
    redirect: ''
}

const getters = {
    isLogin: state => {
        if(state.token) {
            return true
        } else {
            return false
        }
    },
    getToken: () => {
        return state.token
    },
    getFbToken: () => {
        return state.fbtoken
    },
    getUserId: () => {
        return state.user_id
    }
}

const actions = {
    auth(context, payload) {
        return new Promise(resolve => {
            // 模拟登录成功，写入 token 信息
            context.commit('setAuth', {
                token: payload
            })
            resolve()
        })
    },
    login(context, payload) {
        api.get('/fanbook/login', {params: {code: payload.data}}).then(res => {
            if (res.data) {
                console.log('res.data----------------', res.data)
                context.commit('setAuth', res.data.token)
                context.commit('setRedirect', {path: payload.redirect, query: payload.query})
                context.commit('getInfo', res.data)
                // 这个api返回的数据来空，需要查看api
                api.get('/fanbook/getMe').then(res => {
                    console.log('res---', res)
                    context.commit('userId', res.data?.user_id)
                })
                // this.login(res?.data.token).then(res=>console.log('res',res))
            }
        })
    },
    logout(context) {
        context.commit('delAuth')
    }
}

const mutations = {
    setRedirect(state, data) {
        state.redirect = data
    },
    setAuth(state, data) {
        localStorage.setItem('fanbookToken', data)
        localStorage.setItem('token', data)
        state.token = data
    },
    getInfo(state, data) {
        localStorage.setItem("username", data.name)
        localStorage.setItem("useravatar", data.avatar)
        localStorage.setItem("fbtoken", data.fbtoken)
        state.username = data.name  
        state.avatar = data.avatar
        state.fbtoken = data.fbtoken
        
        if(state.token) {
          // 重定向页面
          if(state.redirect) {
            console.log(state.redirect, 'state.redirect');
            router.push(state.redirect)
            return
          }
            console.log('台哦转 /home')
            router.push('/home')
        }
    },
    userId(state, data) {
        localStorage.setItem("user_id", data)
        state.user_id = data 
    },
    delAuth() {
        localStorage.removeItem('fanbookToken')
        localStorage.removeItem('token')
        localStorage.removeItem("username")
        localStorage.removeItem("useravatar")
        localStorage.removeItem("fbtoken")
        localStorage.removeItem("user_id")
        state.username = ''
        state.useravatar = ''
        state.user_id = ''
        state.fbToken = ''
        state.token = ''
    }
}

export default {
    namespaced: true,
    state,
    actions,
    getters,
    mutations
}
