import React, { useCallback, useState } from 'react'
import Modal from '../modal-component';
import './styles.scss';
/**
 * @description Modal Trigger Component
 * @type component
 * @author Inderdeep
 */
const Main = (props) => {

  const [visible, setVisible] = useState(false);

  const { children, content, modalId } = props;


  const onClick = useCallback((onClick) => {
    setVisible(
      true
    );
    if (onClick instanceof Function) {
      onClick();
    }
  }, [visible])


  const hideModal = useCallback(
    () => {
      const { onHide } = props;
      setVisible(false)
      if (onHide && onHide instanceof Function) {
        onHide();
      }
    },
    [visible],
  )

  /**
   * Modal Props are the actual Modal Properties supported by modal component
   */
  let { style, modalProps } = props;
  style = style || {};
  modalProps = modalProps || {};
  /**
   * This modal implementation will work for a single child based mode
   * and the child should contactUs the onClick event
   */
  let modifiedChildren = React.cloneElement(children, {
    onClick: (event) => {
      onClick(children.props.onClick);
    },
  });
  let modifiedContent = content;
  if (content) {
    modifiedContent = React.cloneElement(content, {
      hideModal: hideModal,
    });
  }
  return (
    <span>
      {modifiedChildren}
      <Modal
        hideModal={hideModal}
        visible={visible}
        modalId={modalId}
        {...modalProps}
        onCancel={hideModal}
      >
        {modifiedContent}
      </Modal>
    </span>
  );
}

export default Main;