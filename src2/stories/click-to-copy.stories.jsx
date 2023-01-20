import ClickToCopy from '../components/clickToCopy'

export default {
  title: 'Click to Copy',
  component: ClickToCopy
};

const Template = (args) => (<ClickToCopy {...args} />);

export const Copy = Template.bind({})
Copy.args = {
  text: 'Click to copy this text'
}