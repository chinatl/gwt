const getters = {
  sidebar: state => state.app.sidebar,
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
  page_list: state => state.page_list
}
export default getters
