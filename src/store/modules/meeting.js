import { SET_MEETING_TYPE_LIST } from '../mutations'
import { post } from '@/utils/fetch'
const app = {
    state: {
        meeting_type_list: []
    },
    mutations: {
        [SET_MEETING_TYPE_LIST](state, data) {
            state.meeting_type_list = data;
            sessionStorage.setItem(SET_MEETING_TYPE_LIST, JSON.stringify(data))
        }
    },
    actions: {
        get_meeting_type_list({ commit }) {
            post('gwt/system/sysDic/getDicByType', {
                "type": "NOTICE_TYPE",
            },'json').then(res => {
                if (res.result !== '0000') {
                    return
                }
                res.data.sysDic.unshift({
                    itemName: '全部类型',
                    itemKey: ''
                })
                commit(SET_MEETING_TYPE_LIST, res.data.sysDic);
            })
        }
    }
}

export default app
