import ChangeLang from '../components/changeLanguage'
// import 'antd/lib/icon/style/index.css'
// import 'antd/lib/select/style/index.css'

export default {
  title: 'Change Language',
  component: ChangeLang
};

const Template = (args) => (<ChangeLang {...args} />);

export const ChangeLanguage = Template.bind({})
ChangeLanguage.args = {
  languages: [
    {
      value: 'en',
      label: 'English',
    },
    {
      value: 'hi',
      label: 'Hindi',
    },
  ]
}