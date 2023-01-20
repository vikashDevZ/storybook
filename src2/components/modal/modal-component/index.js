import React, { useCallback, useState, useEffect } from 'react'
import { Modal } from 'antd';
import './styles.scss';
import ModalUtils from '../modal-utils';

/**
 * @description Modal Component
 * @type component
 * @author Inderdeep
 */
const Main = (props) => {
  const [visible, setVisible] = useState(props.visible && true);

  const { children, modalId, contentProps } = props;

  const hideModal = useCallback(
    () => {
      setVisible(
        false
      );
      const { onHide } = props;
      if (onHide && onHide instanceof Function) {
        onHide();
      }
    }
    ,
    [visible],
  )

  useEffect(() => {
    const { onShow } = props;
    if (onShow && onShow instanceof Function) {
      onShow();
    }
  }, []);

  useEffect(() => {
    if (visible != props.visible) {
      setVisible(props.visible)
      if (props.visible) {
        const { onShow } = props;
        if (onShow && onShow instanceof Function) {
          onShow();
        }
      }
    }
  }, [props]);

  let content;
  if (modalId) {
    /**
     * contentProps -> When modal Id is passed
     * @type {*}
     */
    let ModalScene = ModalUtils.getModalScene(modalId);
    content = ModalScene ? (
      <ModalScene
        {...contentProps}
        hideModal={props.hideModal || hideModal}
      />
    ) : null;
  } else {
    content = children;
  }

  const newProps = {
    visible,
    mask: true,
    closable: true,
    maskClosable: false,
    destroyOnClose: true,
    afterClose: () => { },
    onCancel: hideModal,
    ...props,
  };
  //delete props.children;
  delete newProps.modalId;

  return <Modal {...newProps}>{content}</Modal>;
}

export default Main