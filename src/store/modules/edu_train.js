import { SET_TRAIN_LIST_DATA, SET_CLASS_LIST } from '../mutations'
import { post } from '@/utils/fetch'
const edu = {
    state: {
        edu_list_data: {},
        class_list: {},
    },
    mutations: {
        [SET_TRAIN_LIST_DATA](state, data) {
            state.edu_list_data = data;
            sessionStorage.setItem(SET_TRAIN_LIST_DATA, JSON.stringify(data));
        },
        [SET_CLASS_LIST](state, data) {
            state.class_list = data;
            sessionStorage.setItem(SET_CLASS_LIST, JSON.stringify(data));
        }
    },
    actions: {
        get_class_list({
            commit
        }) {
            post("api/course/type/queryCourseType.do", {
                sEcho: 1,
                iColumns: 4,
                sColumns: ",,,",
                iDisplayStart: 0,
                iDisplayLength: 10,
                mDataProp_0: "typeName",
                mDataProp_1: "ceateUser",
                mDataProp_2: "ceateTime",
                mDataProp_3: "function",
                iSortCol_0: 0,
                sSortDir_0: "asc",
                typeName: ""
            })
                .then(res => {
                    if (!res.data) {
                        commit(SET_CLASS_LIST, [])
                        return;
                    }
                    commit(SET_CLASS_LIST, res.data);
                })
                .catch(res => {
                    console.log(res)
                });
        }
    }

}
export default edu
