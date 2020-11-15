export const MOBILE_LOGIN = 1
export const USERNAME_LOGIN = 2

export const CATEGORY_PRIVATE = 1; // 私聊
export const CATEGORY_GROUP = 2; // 群组

export const TYPE_TEXT = 100; // 文本消息
export const TYPE_IMG = 101; // 图片消息
export const TYPE_PRIVATE_RED = 201; // 微信的私聊红包
export const TYPE_AVERAGE_RED = 202; // 微信的普通群聊均额红包
export const TYPE_LUCKY_RED = 203; // 微信的群聊拼手气红包

export const TYPE_REGISTER_PLAYER = 101; // 从本系统注册后登录的普通用户,用户名不允许出现 _
export const TYPE_GUEST_PLAYER = 201; // 游客用户, 用户名以 g_ 开头
export const TYPE_CUSTOMER_SERVICE = 501; // 客服人员，用户名以 s_ 开头