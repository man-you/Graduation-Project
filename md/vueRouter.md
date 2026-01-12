```
{
  path: '/xxx',          // 必填，路由访问路径，如 /study/courseList
  name: 'XxxXxx',        // 必填，路由唯一名称，驼峰命名，不可重复！配合keep-alive缓存使用
  component: Layout/组件, // 必填，路由对应的组件，业务页面都用Layout作为父组件
  hidden: true,          // 可选，默认false；是否在左侧侧边栏隐藏该路由，比如：课程详情、作业提交页
  redirect: 'noRedirect',// 可选，默认空；重定向地址，noRedirect=点击父菜单不跳转，只展开子菜单
  alwaysShow: true,      // 可选，默认false；强制显示父菜单，即使只有1个子路由，学习平台必用
  meta: {                // ✅ 核心！路由元信息，所有权限/展示/行为都在这里配置，标准化核心
    title: '菜单名称',    // 必填，侧边栏/面包屑/标签页 显示的名称，如「课程列表」「用户管理」
    icon: 'el-icon-xxx', // 可选，侧边栏菜单图标，用Element Plus图标即可，标准化
    roles: ['admin'],    // ✅ 必填（权限核心），能访问该路由的角色，数组格式：['admin','teacher','student']
    noCache: true,       // 可选，默认false；是否禁用页面缓存，比如作业提交页、编辑页建议开启
    affix: true,         // 可选，默认false；是否固定在顶部标签页，不可关闭，比如首页建议开启
    breadcrumb: false,   // 可选，默认true；是否在面包屑隐藏该路由，一般不用改
    activeMenu: '/xxx'   // 可选，默认空；强制侧边栏高亮的路由，比如隐藏的课程详情页高亮「课程列表」
  },
  children: []           // 可选，子路由，实现多级菜单，比如「课程管理」下的「我的课程」「作业管理」
}
```
