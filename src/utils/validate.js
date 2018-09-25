export function isvalidUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}
/* 最新手机号正则*/
// export function validatePhone(str) {
//   const reg = /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/
//   return reg.test(str)
// }

export function validateTime(rule, value, callback) {
  if (!value) {
    callback(new Error('请输入开始时间'));
  } else {
    var _now_date = Date.now();
    if (+value - _now_date > 1000 * 60 * 10) {
      callback();
    } else {
      callback('距离开始时间不得小于10分钟');
    }
  }
}
export function validateEndTime(rule, value, callback) {
  console.log(+value, rule)
  if (!value) {
    callback(new Error('请输入开始时间'));
  } else {
    var _now_date = Date.now();
    if (+value - _now_date > 1000 * 60 * 10) {
      callback();
    } else {
      callback('距离结束时间不得小于10分钟');
    }
  }
}
export function validatePhone(rule, value, callback) {
  const reg = /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/;
  const reg1 = /^\d{3,4}-\d{7,8}$/;
  if (!value) {
    callback(new Error('请输入手机号'));
  } else {
    if (!reg.test(value) && !reg1.test(value)) {
      callback(new Error('手机号不合法'));
    } else {
      callback();
    }
  }
}