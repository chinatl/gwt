const getters = {
  sidebar: state => state.app.sidebar,
  slierbar_list: state => state.slierbar_list,
  is_admin: state => state.is_admin,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  field_manager_data: state => state.field_manager_data,
  levelList: state => state.levelList,
  visitedViews: state => state.tagsView.visitedViews,
  edu_list_data: state => state.edu_train.edu_list_data,
  class_list: state => state.edu_train.class_list,
  question_data: state => state.edu_train.question_data,
  test_desc_data: state => state.edu_train.test_desc_data,
  refresh_data: state => state.edu_train.refresh_data,
  page_list: state => state.page_list,
  sign: state => state.sign,
  user_info: state => state.user_info,
  token: state => state.token,
  field_app_list: state => state.field_app_list,
  tree_data: state => state.tree_data,
  user: state => state.user,
  meeting_type_list: state => state.meeting.meeting_type_list,
  notice_data: state => state.meeting.notice_data,
  message_data: state => state.message.message_data,
  report_data: state => state.message.report_data,
  part_tree: state => state.part.part_tree,
  part_user_list: state => state.part.uset_list,
  manager_tree_list: state => state.part.manager_tree_list,
}
export default getters
