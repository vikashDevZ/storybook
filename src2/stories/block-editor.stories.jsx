import BlockEditor from '../components/blockEditor'
export default {
  title: 'Block Editor',
  component: BlockEditor
};

const Template = (args) => (<BlockEditor {...args} />);

export const Block = Template.bind({})
Block.args = {
  editorProps: {
    init: {
      images_upload_handler: async (blobInfo, progress) => {

      },
      // content_style: `:root {}`,
    },
  }
}

// editorProps: {
//   onInit: (evnt, editor) => (editorRef.current = editor),
// },