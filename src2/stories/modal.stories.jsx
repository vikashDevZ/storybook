import { Modal } from "../components/modal";
import { within, userEvent } from '@storybook/testing-library'
// import 'antd/lib/modal/style/index.css'

export default {
  title: 'Modal Component',
  component: Modal,
  argTypes: {
    hideModal: { action: 'Hide Modal' }
  }
}

const Template = ({ content, ...args }) => (<Modal {...args} >
  {content}
</Modal>
)

export const ModalComponent = Template.bind({})

ModalComponent.args = {
  visible: true,
  content: (<p>sample content</p>),
  closable: true
}

// ModalComponent.play = async ({ canvasElement }) => {
//   const canvas = within(canvasElement)
//   const container = document.getElementsByClassName(`ant-modal-close`)[0]
//   // const closeButton = await canvas.getByText(container, { name: 'Cancel' })
//   // await userEvent.click(closeButton)
//   await userEvent.click(container)
// }