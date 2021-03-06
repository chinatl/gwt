import { SET_TRAIN_LIST_DATA, SET_CLASS_LIST, SET_QUESTION_DATA, SET_REFRESH_DATA, SET_TEST_DESC_DATA } from '../mutations'
import { post } from '@/utils/fetch'
const edu = {
    state: {
        edu_list_data: {},
        class_list: [],
        question_data: {},
        test_desc_data: {
            passScore: ''
        },
        refresh_data: {

        }
    },
    mutations: {
        [SET_TRAIN_LIST_DATA](state, data) {
            state.edu_list_data = data;
            sessionStorage.setItem(SET_TRAIN_LIST_DATA, JSON.stringify(data));
        },
        [SET_CLASS_LIST](state, data) {
            state.class_list = data;
            sessionStorage.setItem(SET_CLASS_LIST, JSON.stringify(data));
        },
        [SET_QUESTION_DATA](state, data) {
            state.question_data = data;
            sessionStorage.setItem(SET_QUESTION_DATA, JSON.stringify(data));
        },
        [SET_TEST_DESC_DATA](state, data) {
            state.test_desc_data = data;
            sessionStorage.setItem(SET_TEST_DESC_DATA, JSON.stringify(data));
        },
        [SET_REFRESH_DATA](state, data) {
            state.refresh_data = data;
            state.refresh_data.date = [data.createTime, data.endTime];
            state.refresh_data.passScore = data.passScore || '';
            sessionStorage.setItem(SET_REFRESH_DATA, JSON.stringify(data));
        },
        set_question_data(state, {
            name, value
        }) {
            state.question_data[name] = value;
        },
        set_refresh_data(state, {
            name, value
        }) {
            state.refresh_data[name] = value;
        },
        del_one_class_list(state, ctypeId) {
            state.class_list = state.class_list.filter(res => {
                return res.ctypeId !== ctypeId
            });
            sessionStorage.setItem(SET_CLASS_LIST, JSON.stringify(state.class_list));
        },
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
                iDisplayLength: 40,
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
