import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: '', // 用户名
    nickname: '', // 昵称
    header: '', // 头像地址
    userId: '', // 用户id,
    userType: '',
    telephone: '',
    token: '', // 用户每次登录重新生成的 token
    socketId: '', // 每次登陆都重新连接一次，避免串起来
    refCode: '', // 如果是代理，则是其推荐码
    contacts: [], // 联系人列表
    focusChatId: 0, // 当前聊天界面的chatId
    unreadMsg: [], // 未读消息数目
    balance: 0,
  },
  mutations: {
    setRefCode(state, refCode){
      state.refCode = refCode
    },
    // 登录后设置token
    setToken(state, token) {
      state.token = token
    },
    setSocketId(state, socketId){
      state.socketId = socketId
    },
    // 登陆后设置用户名
    setUsername(state, username) {
      state.username = username
    },
    // 设置昵称
    setNickname(state, nickname) {
      state.nickname = nickname
    },
    // 设置头像
    setHeader(state, header) {
      state.header = header
    },
    // 设置用户 uid 
    setUserId(state, userId) {
      state.userId = userId
    },
    // 用户的类型
    setUserType(state, userType) {
      state.userType = userType
    },
    // 用户电话号码
    setTelephone(state, telephone) {
      state.telephone = telephone
    },
    // 设置联系人列表
    setContacts(state, contacts) {
      state.contacts = contacts
    },
    setUnreadMsg(state, data) {
      state.unreadMsg = data
    },
    // 给某个聊天增加一条未读消息
    pushUnreadMsg(state, chat) {
      let pos = state.unreadMsg.findIndex((element) => element.chatId == chat.chatId)
      console.log('pos=' + pos)
      let addItem = {}
      if(pos>=0){
        console.log('origin pos')
        console.log(state.unreadMsg[pos])
        addItem = state.unreadMsg[pos]
        addItem['unreadCount'] = parseInt(state.unreadMsg[pos].unreadCount) + 1
        state.unreadMsg.splice(pos,1)
      }else{
        addItem['unreadCount'] = 1
      }
      console.log('focus ' + state.focusChatId)
      console.log('chatId ' + chat.chatId)
      if(state.focusChatId == chat.chatId){
        addItem['unreadCount'] = 0
      }
      addItem['lastMessageId'] = chat.chatId
      addItem['lastMessageType'] = chat.messageType
      addItem['lastMessageInfo'] = chat.info
      addItem['lastMessageSenderNickname'] = chat.senderNickname
      addItem['lastMessageTime'] = chat.sendTime
      console.log('addItem')
      console.log(addItem)
      state.unreadMsg.unshift(addItem)
      console.log(state.unreadMsg)
    },
    // 清除未读消息数目
    clearUnreadMsgCount(state, chatId) {
      let pos = state.unreadMsg.findIndex((element) => element.chatId == chatId)
      if(pos>=0){
        state.unreadMsg[pos]['unreadCount'] = 0
      }
    },
    setUnreadMsgCount(state, {chatId, count}) {
      state.unreadMsgCount[chatId] = count
    },
    enterChatId(state, chatId) {
      state.focusChatId = chatId
    },
    leaveChatId(state) {
      state.focusChatId = 0
    },
    clearToken(state) {
      state.token = ''
    }
  },
  actions: {
  },
  modules: {
  }
})
