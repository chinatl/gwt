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
                "token": "0314_caca55d7-ced5-4ab6-87e0-667cc9e5d2b1"
            }).then(res => {
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
