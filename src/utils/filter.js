import Vue from 'vue'
Vue.filter('stringToArray', function (value) {
  return value.split(',')
})

Vue.filter('filterSex', function (value) {
  return value === 0 ? '男' : '女'
})

// [{},{}] 返回指定的value 以 / 分割
Vue.filter('jsonToString', function (value) {
  let jsonArr = JSON.parse(value)
  let newString = ''
  jsonArr.forEach((element, index) => {
    newString = newString + element.systemNamePrefix + '-' + element.systemNameSuffix
    if (jsonArr.length - 1 !== index) {
      newString = newString + ' / '
    }
  })
  return newString
})
