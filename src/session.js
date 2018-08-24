import { getItem } from '@/utils/auth'
import store from '@/store';
const set_store_state = (mutations, key) => {
    if (getItem(key)) {
        store.commit(mutations, getItem(key))
    }
};
set_store_state('SET_FIELD_MANAGER_DATA','field_manager_data');
set_store_state('SET_LEVELLIST','levelList');