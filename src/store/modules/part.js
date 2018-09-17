import { SET_PART_TREE, SET_USER_LIST, SET_MANAGER_TREE } from '../mutations'
import { post } from '@/utils/fetch'
import { resolve_tree, generate_tree } from '@/utils'
const app = {
    state: {
        part_tree: [],
        uset_list: [],
        manager_tree_list: []
    },
    mutations: {
        [SET_PART_TREE](state, data) {
            state.part_tree = data;
            sessionStorage.setItem(SET_PART_TREE, JSON.stringify(data))
        },
        [SET_USER_LIST](state, data) {
            state.uset_list = data;
            sessionStorage.setItem(SET_USER_LIST, JSON.stringify(data))
        },
        [SET_MANAGER_TREE](state, data) {
            state.manager_tree_list = data;
            sessionStorage.setItem(SET_MANAGER_TREE, JSON.stringify(data))
        }
    },
    actions: {
        get_part_tree({ commit }) {
            post('gwt/system/sysOrg/getOrgTreeData', {}, 'json').then(res => {
                if (res.result !== '0000') {
                    return
                };
                commit(SET_PART_TREE, res.data.nodes);
                post("gwt/system/sysUser/loadOrgUser",
                    {
                        orgId: "",
                        orgIds:
                            resolve_tree(res.data.nodes).map(res => res.id).join(','),
                        fromCommon: "Y",
                        fromPerson: "Y",
                        realName: ""
                    }, 'json').then(res => {
                        if (res.result !== '0000') {
                            return
                        };
                        commit(SET_USER_LIST, res.data.userOrgs)
                    })
            })
        },
        get_manager_tree({ commit }) {
            post('gwt/system/sysOrg/getSelfDoaminOrgTree', {}, 'json').then(res => {
                if (res.result !== '0000') {
                    return
                };
                commit(SET_MANAGER_TREE, generate_tree(res.data.nodes))
            })
        }
    }
}

export default app
