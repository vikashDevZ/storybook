import Tags from '../components/tags'
// import 'antd/lib/tag/style/index.css'

export default {
  title: 'Tags',
  component: Tags
};

const Template = (args) => (<Tags {...args} />);

export const Tag = Template.bind({})
Tag.args = {
  tagProps: {
    onClick: (evt) => console.log(evt.target.innerText),
  },
  allowNewTag: true,
  editable: true,
}