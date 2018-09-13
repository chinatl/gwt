import { SET_MESSAGE_DATA, SET_REPORT_DATA } from '../mutations'
import { post } from '@/utils/fetch'

const message = {
    state: {
        message_data: {},
        report_data: {}

    },
    mutations: {
        [SET_MESSAGE_DATA](state, data) {
            state.message_data = data;
            sessionStorage.setItem(SET_MESSAGE_DATA, JSON.stringify(data));
        },
        [SET_REPORT_DATA](state, data) {
            state.report_data = data;
            sessionStorage.setItem(SET_REPORT_DATA, JSON.stringify(data));
        }
    },
    actions: {
        get_report_desc({ commit }, msgId) {
            post('gwt/system/sysReport/get', {
                msgId
            }, 'json').then(res => {
                if (res.result !== '0000') {
                    return
                }
                res.data.sysReport.msgId = msgId;
                commit(SET_REPORT_DATA, res.data.sysReport)
            }).catch(res => {
                console.log(res)
            })
        }
    }
}
export default message
