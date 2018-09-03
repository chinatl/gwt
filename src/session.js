import { getItem } from '@/utils/auth'
import store from '@/store';
import { SET_TRAIN_LIST_DATA, SET_CLASS_LIST, SET_QUESTION_DATA, SET_TEST_DESC_DATA } from '@/store/mutations';
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