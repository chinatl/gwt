/**
 * Created by tanglan .
 */

export function parseTime(time, cFormat) {
  if (!time) {
    return ''
  }
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

// 格式化时间
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 *get getByteLen
 * @param {Sting} val input value
 * @returns {number} output value
 */
export function getByteLen(val) {
  let len = 0
  for (let i = 0; i < val.length; i++) {
    if (val[i].match(/[^\x00-\xff]/ig) != null) {
      len += 1
    } else {
      len += 0.5
    }
  }
  return Math.floor(len)
}

export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

export function param(json) {
  if (!json) return ''
  return cleanArray(Object.keys(json).map(key => {
    if (json[key] === undefined) return ''
    return encodeURIComponent(key) + '=' +
      encodeURIComponent(json[key])
  })).join('&')
}

export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
}

export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

export function objectMerge(target, source) {
	/* Merges two  objects,
	   giving the last one precedence */

  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach((property) => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

export function scrollTo(element, to, duration) {
  if (duration <= 0) return
  const difference = to - element.scrollTop
  const perTick = difference / duration * 10
  setTimeout(() => {
    console.log(new Date())
    element.scrollTop = element.scrollTop + perTick
    if (element.scrollTop === to) return
    scrollTo(element, to, duration - 10)
  }, 10)
}

export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString = classString.substr(0, nameIndex) + classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

export const pickerOptions = [
  {
    text: '今天',
    onClick(picker) {
      const end = new Date()
      const start = new Date(new Date().toDateString())
      end.setTime(start.getTime())
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近一周',
    onClick(picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(end.getTime() - 3600 * 1000 * 24 * 7)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近一个月',
    onClick(picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近三个月',
    onClick(picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      picker.$emit('pick', [start, end])
    }
  }]

export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach((keys) => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = source[keys].constructor === Array ? [] : {}
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}
//关键字高亮方法
export function get_color_number(source, keyword) {
  if (!source || typeof source !== 'string') {
    return [{
      value: source
    }]
  }
  if (!keyword || typeof source !== 'string') {
    return [{
      value: source
    }]
  };
  /*旧关键字的长度*/
  var keyword_length = keyword.length;
  /*关键字转大写*/
  var upper_keyword = keyword.toUpperCase();
  /*资源转大写*/
  var upper_source = source.toUpperCase();
  /*动态正则*/
  var reg = new RegExp(keyword, 'ig');
  /*生成新的字符串*/
  var newSource = source.replace(reg, "");
  /*生成一个返回的新数组用来拼接*/
  var split_arr = upper_source.split(upper_keyword);
  /*旧关键字数组*/
  var old_keyword = source.substr(split_arr[0].length, keyword_length);
  var old_keyword_arr = [];
  /*生成一个拼接的数组*/
  var compouted_arr = [];
  var num = 0;
  var old_num = 0;
  for (var i = 0; i < split_arr.length; i++) {
    compouted_arr.push(newSource.substr(num, split_arr[i].length));
    old_num += split_arr[i].length;
    old_keyword_arr.push(source.substr(old_num, keyword_length));
    old_num += 1;
    num += split_arr[i].length;
  }
  /*生成的数组*/
  var return_arr = [];
  for (var i = 0; i < compouted_arr.length; i++) {
    return_arr[2 * i] = {};
    return_arr[2 * i].value = compouted_arr[i];
  };
  for (var j = 0; j < return_arr.length; j++) {
    if (!return_arr[j]) {
      return_arr[j] = {};
      return_arr[j].name = 'red';
      return_arr[j].value = old_keyword_arr.splice(0, 1)[0];
    }
  };
  return return_arr.filter(res => {
    return res.value
  });
}
//跳路由
export function go_route(str) {
  if (!str) {
    return
  }
  this.$router.push({
    path: '/' + str
  })
}
//压缩图片代码
export function dealImage(path, callback) {
  var img = new Image();
  img.src = path;
  img.onload = function () {
    //默认按比例压缩  
    var w = this.width / 2,
      h = this.height / 2;
    var quality = .1; // 默认图片质量为0.7  
    //生成canvas  
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    // 创建属性节点  
    canvas.setAttribute("width", w);
    canvas.setAttribute("height", h);

    ctx.drawImage(this, 0, 0, w, h);
    // quality值越小，所绘制出的图像越模糊  
    callback && callback(canvas.toDataURL('image/jpeg', quality));
  };
};
export function getFileType(name) {
  if (!name) {
    return 'unknown'
  }
  if (/\.(docx?)$/.test(name)) {
    return "doc";
  }
  if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(name)) {
    return "png";
  }
  if (/\.(pptx?)$/.test(name)) {
    return "ppt";
  }
  if (/\.(csv|xlsx?)$/.test(name)) {
    return "";
  }
  if (/\.(pdf)$/.test(name)) {
    return "pdf";
  }
  if (!/\.[a-zA-z]+$/.test(name)) {
    return "文件夹";
  }
  return 'unknown'
}
export function fileType(name) {
  if (!name) {
    return 'unknown'
  }
  if (/\.(docx?)$/.test(name)) {
    return "doc";
  }
  if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(name)) {
    return "photo";
  }
  if (/\.(pptx?)$/.test(name)) {
    return "ppt";
  }
  if (/\.(csv|xlsx?)$/.test(name)) {
    return "excel";
  }
  if (/\.(pdf)$/.test(name)) {
    return "pdf";
  }
  if (/\.(txt)$/.test(name)) {
    return "txt";
  }
  if (!/\.[a-zA-z]+$/.test(name)) {
    return "文件夹";
  }
  return 'unknown'
}

export function resolve_tree(arr) {
  var newArr = [];
  function getChild(arr) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].id) {
        newArr.push(arr[i]);
        if (arr[i].childrens.length) {
          getChild(arr[i].childrens)
        }
      }
    }
  }
  getChild(arr)
  return newArr
};
export function generate_tree(arr) {
  var newArr = [];
  for (var i = arr.length - 1; i >= 0; i--) {
    if (arr[i].nodeType === 'USER_GROUP' || arr[i].nodeType === 'ORG_GROUP' || arr[i].nodeType === 'DOMAIN' || arr[i].pId.includes('region_')) {
      newArr.push(arr.splice(i, 1)[0]);
    }
  }
  getTree(newArr);
  function getTree(generate_arr) {
    if (!generate_arr) return
    if (!generate_arr.length) return
    for (var k = 0; k < generate_arr.length; k++) {
      generate_arr[k].childrens = [];
      for (var i = arr.length - 1; i >= 0; i--) {
        if (arr[i].pId === generate_arr[k].id) {
          generate_arr[k].childrens.push(arr.splice(i, 1)[0]);
        }
      };
      getTree(generate_arr[k].childrens)
    }
  }
  console.log(arr)
  return newArr
}

