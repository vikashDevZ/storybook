import Longtext from '../components/longtext/index';
// import 'antd/lib/button/style/index.css'
// import 'antd/lib/modal/style/index.css'

export default {
  title: 'Long Text',
  component: Longtext,
}

const Template = (args) => (<Longtext {...args} />)

export const LongText = Template.bind({});
LongText.args = {
  text: 'Lorem dtndndcmttxj ipsum dolor sit amet consectetur adipisicing elit. Possimus non perferendis nihil sunt. Quibusdam atque iusto modi.',
  title: 'my title',
  limit: 25
}