import { getItem } from '@/utils/auth'
import store from '@/store';
import { SET_TRAIN_LIST_DATA, SET_CLASS_LIST, SET_QUESTION_DATA, SET_TEST_DESC_DATA, SET_REFRESH_DATA, SET_USER_INFO, SET_USER_SIGN, SET_USER_TOKEN } from '@/store/mutations';
const set_store_state = (mutations, key) => {
    if (getItem(key)) {
        store.commit(mutations, getItem(key))
    }
};
set_store_state('SET_FIELD_MANAGER_DATA', 'field_manager_data');
set_store_state('SET_LEVELLIST', 'levelList');
set_store_state(SET_TRAIN_LIST_DATA, SET_TRAIN_LIST_DATA);
set_store_state(SET_CLASS_LIST, SET_CLASS_LIST);
set_store_state(SET_QUESTION_DATA, SET_QUESTION_DATA);
set_store_state(SET_TEST_DESC_DATA, SET_TEST_DESC_DATA);
set_store_state(SET_REFRESH_DATA, SET_REFRESH_DATA);
set_store_state(SET_USER_INFO, SET_USER_INFO);
set_store_state(SET_USER_SIGN, SET_USER_SIGN);
set_store_state(SET_USER_TOKEN, SET_USER_TOKEN);