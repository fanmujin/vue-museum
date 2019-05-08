import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Admin from './views/nav1/Admin.vue'
import Form from './views/nav1/Form.vue'
import Display from './views/nav1/Display'
import Culture from './views/nav1/Culture'
import Page4 from './views/nav2/Page4.vue'
import Page5 from './views/nav2/Page5.vue'
import Page6 from './views/nav2/Page6.vue'
import Page7 from './views/nav3/Page7.vue'
import echarts from './views/charts/echarts.vue'
import addressChart from './views/charts/address-chart.vue'
import address from './views/nav4/address.vue'
let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '一览表',
        iconCls: 'fa fa-list',//图标样式class
        children: [
            { path: '/main', component: Main, name: '主页'},
            { path: '/admin', component: Admin, name: '用户列表'},
            { path: '/form', component: Form, name: '会展安排' },
            { path: '/display', component: Display, name: '展览列表' },
            { path: '/culture', component: Culture, name: '名俗列表' }

        ]
    },
    {
        path: '/',
        component: Home,
        name: '数字信息',
        iconCls: 'fa fa-bullhorn',
        children: [
            { path: '/page4', component: Page4, name: '网上展厅' },
            { path: '/page5', component: Page5, name: '消息通知' },
            { path: '/page6', component: Page6, name: '视频管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-file-text',
        leaf: true,//只有一个节点
        children: [
            { path: '/page7', component: Page7, name: '学术报告' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '地理信息',
        iconCls: 'fa fa-map-marker',
        children: [
            { path: '/address', component: address, name: '地理分布' },
            { path: '/addressChart', component: addressChart, name: '地理统计' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;