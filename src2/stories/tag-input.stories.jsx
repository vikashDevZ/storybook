import TagInput from '../components/tagInput'
// import 'antd/lib/select/style/index.css'

export default {
  title: 'Tag Input',
  component: TagInput
};

const Template = (args) => (<TagInput {...args} />);

export const TagInp = Template.bind({})
TagInp.args = {
}