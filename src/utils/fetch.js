import request from './request'
import config from '@/config'
import qs from 'qs';
import { Base64 } from 'js-base64';
import md5 from 'js-md5';
import store from '@/store'
export function get(url, data) {
	if (!url.includes('http')) {
		url = config + url
	}
	return request({
		url: url,
		method: 'get',
		params: data
	})
};
export function post(url, data, type) {
	var content_type;
	if (type === 'json') {
		content_type = 'application/json';
		var object = Base64.encode(JSON.stringify(data));
		var sign;
		if (store.getters.sign) {
			sign = md5(object + store.getters.sign);
		}
		data = {
			object,
			sign
		};
	} else if (type === 'form') {
		content_type = '';
	}
	else {
		content_type = 'application/x-www-form-urlencoded;charset=utf-8';
		data = qs.stringify(data);
	}
	return request.post(config + url, data, {
		headers: {
			'Content-Type': content_type
		}
	})
}
export function update(url, data) {
	return request.update(config + url, data)
}
export function deleteItem(url, data) {
	return request.delete(config + url, data)
}