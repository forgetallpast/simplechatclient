import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
import store from '../store'
import storage from '../library/storage'
import api from '../library/api'

const routes = [{
    path: '/',
    redirect: '/welcome'
  },
  {
    path: '/welcome',
    name: 'welcome',
    component: () => import('../views/Welcome.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/forget_password',
    name: 'forget_password',
    component: () => import('../views/ForgetPassword.vue')
  },
  {
    path: '',
    redirect: '/contact'
  },
  // 微信
  {
    path: '/wechat',
    name: 'wechat',
    component: () => import('../views/WeChat.vue')
  },
  // 联系人
  {
    path: '/contact',
    name: 'contact',
    component: () => import('../views/Contact.vue')
  },
  // 发现
  {
    path: '/find',
    name: 'find',
    component: () => import('../views/Find.vue')
  },
  // 我
  {
    path: '/self',
    name: 'self',
    component: () => import('../views/Self.vue')
  },
  // 更改个人信息
  {
    path: '/personal_info',
    name: 'personal_info',
    component: () => import('../views/PersonalInfo.vue')
  },
  // 设置名字
  {
    path: '/change_nickname',
    name: 'change_nickname',
    component: () => import('../views/personal/ChangeNickname.vue')
  },
  // 设置头像
  {
    path: '/change_header',
    name: 'change_header',
    component: () => import('../views/personal/ChangeHeader.vue')
  },
  // 账号与安全
  {
    path: '/account_security',
    name: 'account_security',
    component: () => import('../views/AccountSecurity.vue')
  },
  // 游客用户绑定手机号与密码
  {
    path: '/guest_bind',
    name: 'guest_bind',
    component: () => import('../views/personal/GuestBind.vue')
  },
  // 更改密码
  {
    path: '/change_password',
    name: 'change_password',
    component: () => import('../views/personal/ChangePassword.vue')
  },
  // 对话框
  {
    path: '/dialogue',
    name: 'dialogue',
    component: () => import('../views/Dialogue.vue')
  },
  // 钱包
  {
    path: '/wallet',
    name: 'wallet',
    component: () => import('../views/money/Wallet.vue')
  },
  // 银行卡管理
  {
    path: '/bankcards',
    name: 'bankcards',
    component: () => import('../views/money/Bankcards.vue')
  },
  // 页面改成类似微信钱包
  {
    path: '/wechat_wallet',
    name: 'wechat_wallet',
    component: () => import('../views/money/WechatWallet.vue')
  },
  // 设置
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../views/Settings.vue')
  },
  // 交易记录
  {
    path: '/transaction_record',
    name: 'transaction_record',
    component: () => import('../views/money/TransactionRecord.vue')
  },
  // 不同类型的交易记录
  {
    path: '/transaction_type_record',
    name: 'transaction_type_record',
    component: () => import('../views/money/TransactionTypeRecord.vue')
  },
  // 存款
  {
    path: '/deposit',
    name: 'deposit',
    component: () => import('../views/money/Deposit.vue')
  },
  // 更改提现密码
  {
    path: '/change_withdraw_password',
    name: 'change_withdraw_password',
    component: () => import('../views/money/ChangeWithdrawPassword.vue')
  },
  // 用户增加银行卡
  {
    path: '/add_bankcard',
    name: 'add_bankcard',
    component: () => import('../views/money/AddBankcard.vue')
  },
  // 群组信息，群主专用
  {
    path: '/group_info',
    name: 'group_info',
    component: () => import('../views/group/GroupInfo.vue')
  },
  // 增加群成员
  {
    path: '/add_group_member',
    name: 'add_group_member',
    component: () => import('../views/group/AddGroupMember.vue')
  },
  // 与我私聊对话的另外那个用户的级别信息
  {
    path: '/other_user_info',
    name: 'other_user_info',
    component: () => import('../views/personal/OtherUserInfo.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})
// 要刷新用户信息，只需要将 store.state.token 置空就可以了
router.beforeEach(async (to, from, next) => {
  let token = store.state.token
  if (!token) {
    token = storage.get('token')
    if (token) {
      store.commit("setToken", token)
      let userInfoResult = await api.postData("/api/user/info", {
        token: token
      });
      if (userInfoResult.code == 0) {
        store.commit("setRefCode", userInfoResult.data.refCode);
        store.commit("setUsername", userInfoResult.data.username);
        store.commit("setNickname", userInfoResult.data.nickname);
        store.commit("setHeader", userInfoResult.data.header);
        store.commit("setUserId", userInfoResult.data.userId);
        store.commit("setUserType", userInfoResult.data.userType)
        store.commit("setTelephone", userInfoResult.data.telephone)
      } else {
        // 错误提示
      }

    }
  }
  if (!token && to.name != 'login' && to.name != 'register' && to.name != 'welcome' && to.name != 'forget_password') {
    next({
      name: 'welcome'
    })
  } else {
    next()
  }
})
export default router