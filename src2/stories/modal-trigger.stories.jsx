import { ModalTrigger } from "../components/modal";
import { Button } from "antd";
// import 'antd/lib/button/style/index.css'
// import 'antd/lib/modal/style/index.css'
export default {
  title: 'Modal Trigger',
  component: ModalTrigger
}

const Template = (args) => (<ModalTrigger {...args} />)

export const Modal = Template.bind({});
Modal.args = {
  // modalId: 1,
  children: (<Button>click</Button>),
  content: (<p>Modal content</p>),
  modalProps: {

    closable: true,
  }
}