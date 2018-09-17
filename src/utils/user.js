import Vue from 'vue';
import { post } from '@/utils/fetch';
import { Message } from 'element-ui'
export function delete_item({
    url, data, success, title = "您确定要删除的信息吗？",
    text = "删除后将无法恢复，请谨慎操作！"
}) {
    Vue.swal({
        title: title,
        text: text,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        confirmButtonClass: "btn btn-success"
    }).then(res => {
        if (!res.value) {
            return;
        }
        post(
            url,
            data,
            "json"
        )
            .then(res => {
                if (res.result !== "0000") {
                    Vue.swal({
                        title: "操作失败！",
                        text: res.msg,
                        type: "error",
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "确定",
                        showConfirmButton: true
                    });
                    return;
                }
                Message({
                    message: "删除成功！",
                    type: "success"
                });
                success && success(res)
            })
            .catch(res => {
                console.log(res);
            });
    });
}
