<template>
    <div id="myChart" style="width: 900px;height:450px;">
    </div>
</template>
<script>
    import echarts from 'echarts'
    export default {
        name: 'Address',
        data() {
            return {}
        },
        mounted() {
            var myChart = echarts.init(document.getElementById('myChart'));
            myChart.setOption(
                {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        data:['中原中东部','中原西部','中原北部','中原南部',
                        '郑州','开封','商丘','许昌','洛阳','平顶山','南阳','安阳','新乡','鹤壁','濮阳','焦作',
                            '漯河','驻马店','周口','信阳']
                    },
                    series: [
                        {
                            name:'地理分布',
                            type:'pie',
                            selectedMode: 'single',
                            radius: [0, '30%'],

                            label: {
                                normal: {
                                    position: 'inner'
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data:[
                                {value:14, name:'中原中东部', selected:true},
                                {value:13, name:'中原西部'},
                                {value:9, name:'中原北部'},
                                {value:5, name:'中原南部'},

                            ]
                        },
                        {
                            name:'名俗收录量',
                            type:'pie',
                            radius: ['40%', '55%'],
                            label: {
                                normal: {
                                    formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                                    backgroundColor: '#eee',
                                    borderColor: '#aaa',
                                    borderWidth: 1,
                                    borderRadius: 4,
                                    rich: {
                                        a: {
                                            color: '#999',
                                            lineHeight: 22,
                                            align: 'center'
                                        },
                                        hr: {
                                            borderColor: '#aaa',
                                            width: '100%',
                                            borderWidth: 0.5,
                                            height: 0
                                        },
                                        b: {
                                            fontSize: 16,
                                            lineHeight: 33
                                        },
                                        per: {
                                            color: '#eee',
                                            backgroundColor: '#334455',
                                            padding: [2, 4],
                                            borderRadius: 2
                                        }
                                    }
                                }
                            },
                            data:[
                                {value:4, name:'郑州'},
                                {value:4, name:'开封'},
                                {value:5, name:'商丘'},
                                {value:1, name:'许昌'},
                                {value:8, name:'洛阳'},
                                {value:0, name:'平顶山'},
                                {value:5, name:'南阳'},
                                {value:2, name:'安阳'},
                                {value:0, name:'鹤壁'},
                                {value:1, name:'新乡'},
                                {value:4, name:'濮阳'},
                                {value:2, name:'焦作'},
                                {value:1, name:'漯河'},
                                {value:0, name:'周口'},
                                {value:1, name:'驻马店'},
                                {value:2, name:'信阳'}

                            ]
                        }
                    ]
                }
            )
        }
    }
</script>
