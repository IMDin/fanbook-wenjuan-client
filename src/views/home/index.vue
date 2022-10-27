<template>
  <div class="home-container">
    <el-container>
      <el-header
        class="header-container"
        height="38"
      >
        <div>
          <img
            class="header-logo-img"
            src="@/assets/images/blue.png"
            @click="$router.push({path:'/'})"
          >
        </div>
        <div class="right-header">
          <el-link href="#">
            {{ username }}
          </el-link>
          <!-- <div slot="reference">
                <p class="nick-name">
                 
                </p>
            </div> -->
          <el-popover
            placement="bottom-end"
            trigger="click"
            width="150"
          >
            <div class="user-person-menu">
              <!-- <el-divider /> -->
              <div>
                <!-- <p
                  class="person-menu-item"
                  @click="$router.push({path: '/home/member'})"
                >
                  <font-icon class="fab fa-get-pocket" />
                  我的账户
                </p> -->
                <!-- <el-divider /> -->
                <p
                  class="person-menu-item"
                  @click="logoutHandle"
                >
                  <font-icon class="fas fa-sign-out" />
                  退出登录
                </p>
              </div>
            </div>
            
            <div slot="reference">
              <img
                :src="avatar"
                class="user-avatar"
              >
            </div>
          </el-popover>
        </div>
      </el-header>
      <el-container>
        <el-aside
          width="280px"
          v-if="this.defaultActiveMenu !== '/role'"
        >
          <el-card>
            <el-button
              type="primary"
              @click="createBlankTemplate"
            >
              新建项目
            </el-button>
            <div class="menu-view">
              <div
                v-for="menu in menuList"
                :key="menu.route"
                :class="defaultActiveMenu==menu.route?'menu-item-active menu-item':'menu-item'"
                @click="menuClickHandle(menu)"
              >
                <font-icon :class="menu.icon" />
                <span>{{ menu.name }}</span>
              </div>
            </div>
          </el-card>
        </el-aside>
        <el-container>
          <el-main>
            <router-view />
          </el-main>
          <el-footer />
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import {formConf} from '@/components/generator/config'
import store from '@/store'
import router from '@/router'

export default {
    name: 'NewIndex',
    components: {},
    data() {
        return {
            defaultActiveMenu: '',
            name:'',
            avatar:'',
            menuList: [
                {
                    route: '/home',
                    name: '我的项目',
                    icon: 'fa-pencil-square'
                },
                // {
                //     route: '/project/template',
                //     name: '模板中心',
                //     icon: 'fa-caret-square-o-up'
                // }, 
                {
                    route: '/project/recycle',
                    name: '回收站',
                    icon: 'fa-trash'
                }
            ]
        }
    },

    computed: {
   
        getStore() {
            return store
        },
        getUserInfo() {
              // console.log("localStorage.getItem",localStorage.getItem("code"))
            let user = JSON.parse(this.getStore.getters['user/userInfo'])
            return user
        }
    },
    created() {
     
      // if(!localStorage.getItem("fanbookToken") &&  this.$route.path === '/home'){
      //     window.history.go(0)
      // }
        //   console.log("是否已经保存token",localStorage.getItem("fanbookToken"))
         this.username=localStorage.getItem("username")
          this.avatar=localStorage.getItem("useravatar")
        this.defaultActiveMenu = this.$route.path
    },
    methods: {
        menuClickHandle(menu) {
            this.$router.replace({path: menu.route})
        },
        createBlankTemplate() {
            this.$api.post('/user/project/create', {
                'describe': formConf.description,
                'name': formConf.title,
                'fbUser': localStorage.getItem("user_id")
            }).then(res => {
                console.log(res)
                this.$router.push({path: '/project/form', query: {key: res.data}})
            })
        },
        logoutHandle() {
            this.$confirm('您确定要退出登录吗？', '退出确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$store.dispatch('user/logout').then(() => {
                    router.push({
                        path: '/',
                        query: {
                            redirect: router.currentRoute.fullPath
                        }
                    })
                })
            }).catch(() => {

            })
        }
    }
}
</script>

<style lang="scss" scoped>
$menuActiveText: #409eff;

.home-container {
    background-color: rgba(247, 247, 247, 90);
    display: flex;
    height: 100%;
    width: 100%;
    flex-direction: column;
}
.header-container {
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    line-height: 38px;
    min-width: 1024px;
    .header-logo-img {
        height: 45px;
        float: left;
        margin-left: 55px;
        padding: 2px;
    }
    .right-header {
        display: flex;
        flex-direction: row;
        > * {
            margin: 0 9px;
        }
    }
    .user-avatar {
        width: 35px;
        height: 35px;
        border-radius: 100px;
        cursor: pointer;
    }
}
.menu-view {
    margin-top: 20px;
    height: 501px;
    background-color: rgba(255, 255, 255, 100);
    padding: 20px;
    text-align: center;
    .menu-item-active {
        color: $menuActiveText !important;
    }
    .menu-item {
        color: #333;
        font-size: 16px;
        text-align: left;
        line-height: 35px;
        &:hover {
            cursor: pointer;
            color: $menuActiveText;
        }
        & .fas:hover {
            color: $menuActiveText;
        }
        .fas {
            display: inline-block;
            width: 20px;
            height: 20px;
            margin: 5px;
        }
        span {
            margin-left: 10px;
        }
    }
}

.banner-container {
    height: 60px;
}
.el-aside {
    padding: 0;
    margin: 0;
    .el-card {
        height: 100%;
        ::v-deep .el-card__body {
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
        }
        .el-button {
            width: 80%;
            margin-top: 20px;
        }
    }
}
.user-person-menu {
    .nick-name {
        height: 16px;
        color: rgba(70, 70, 70, 86);
        font-size: 14px;
        line-height: 16px;
        text-align: left;
    }
    .person-menu-item {
        color: rgba(70, 70, 70, 86);
        font-size: 14px;
        text-align: center;
        &:hover {
            cursor: pointer;
            color: $menuActiveText;
        }
    }
    .el-divider {
        margin: 5px 0;
    }
    .person-menu-divider {
        background-color: rgba(210, 210, 210, 78);
        border: 1px solid rgba(210, 210, 210, 78);
    }
}
.about-container {
    text-align: center;
    .fa-user {
        font-size: 19px;
        color: rgba(172, 172, 172, 100);
        margin: 1px;
    }
}
.element.style {
    width: 109px;
    position: absolute;
    top: 47px;
    left: 1340px;
    transform-origin: center top;
    z-index: 3001;
}
</style>
<style>
    .el-popover {
      padding: 1px !important;
      min-width: 109px;
    }
</style>
