<template>
  <div id="myChart" style="width: 90%;height:450px;">
    </div>
</template>
<script>
  import echarts from 'echarts'
  export default {
    name: 'Bank',
    data() {
      return {}
    },
    mounted() {
      var myChart = echarts.init(document.getElementById('myChart'));
      myChart.setOption(
        {
          title: {
            text: '线性展示'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data:['传统音乐','传统舞蹈','传统戏曲','传统技艺','传统风俗']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['周一','周二','周三','周四','周五','周六','周日']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name:'传统音乐',
              type:'line',
              stack: '总量',
              data:[12, 13, 10, 13, 9, 16, 21]
            },
            {
              name:'传统舞蹈',
              type:'line',
              stack: '总量',
              data:[22, 18, 19, 23, 21, 22, 28]
            },
            {
              name:'传统戏曲',
              type:'line',
              stack: '总量',
              data:[15, 21, 20, 15, 19, 33, 14]
            },
            {
              name:'传统技艺',
              type:'line',
              stack: '总量',
              data:[32, 33, 31, 33, 39, 33, 32]
            },
            {
              name:'传统风俗',
              type:'line',
              stack: '总量',
              data:[10, 32, 21, 34, 12, 13, 20]
            }
          ]
        }
      )
    }
  }
</script>
