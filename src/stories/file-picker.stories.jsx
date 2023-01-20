import FilePicker from '../components/filePicker'

export default {
  title: 'File Picker',
  component: FilePicker
};

const Template = (args) => (<FilePicker {...args} />);

export const File = Template.bind({})
File.args = {

}