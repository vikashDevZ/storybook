import React, { useCallback } from 'react';
import { Modal, Input, Form, Button, InputNumber } from 'antd';
import './styles.scss';

const ConfirmFormComponent = (props) => {

  const {
    form,
    validationRules,
    okText,
    inputLabel,
    className,
    hideModal,
    disableCancel,
    actions,
    placeholder,
    extraItems,
    inputProps,
    inputType,
    disableValueInput,
  } = props;
  const { getFieldDecorator } = form;

  const onSubmit = useCallback((event) => {
    event.preventDefault();
    const { onSubmit, hideModal } = props;
    const { validateFieldsAndScroll } = props.form;
    validateFieldsAndScroll(async (errors, values) => {
      if (errors) {
        return;
      }
      if (onSubmit instanceof Function) {
        onSubmit(values, {
          hideModal,
          startSpinning: () => {
            window.startSpinning('.confirm-form-modal .ant-modal-body');
          },
          stopSpinning: () => {
            window.stopSpinning('.confirm-form-modal .ant-modal-body');
          },
        });
      }
    });
  }, [form])


  return (
    <Form className={className} onSubmit={onSubmit}>
      <div className="confirm-input new-form">
        <div className="form">
          {!disableValueInput && (
            <Form.Item label={inputLabel || 'Value'}>
              {getFieldDecorator('value', {
                rules: validationRules || [
                  { required: true, message: 'Please enter a value' },
                ],
              })(
                inputType && inputType === 'number' ? (
                  <InputNumber
                    className="input"
                    placeholder={placeholder || 'Enter Value'}
                    {...inputProps}
                  />
                ) : (
                  <Input
                    className="input"
                    placeholder={placeholder || 'Enter Value'}
                    {...inputProps}
                  />
                )
              )}
            </Form.Item>
          )}

          {(extraItems || []).map(
            (
              {
                label,
                key,
                validationRules,
                element,
                placeholder,
                value,
                inputProps,
              },
              index
            ) => {
              return (
                <Form.Item label={label} key={index}>
                  {getFieldDecorator(key, {
                    rules: validationRules || [
                      { required: true, message: 'Please enter a value' },
                    ],
                    initialValue: value,
                  })(
                    element ? (
                      element
                    ) : (
                      <Input
                        className="input"
                        placeholder={placeholder}
                        {...inputProps}
                      />
                    )
                  )}
                </Form.Item>
              );
            }
          )}
        </div>
        <div className="actions">
          <Button htmlType={'submit'} className="primary-btn">
            {'Save' || { okText }}
          </Button>
          {!disableCancel && (
            <Button
              onClick={hideModal}
              type={'default'}
              htmlType={'button'}
              className="red-btn-text"
            >
              Cancel
            </Button>
          )}
          {actions}
        </div>
      </div>
    </Form>
  );
}

export const ConfirmForm = Form.create()(ConfirmFormComponent);

export default function (config, hoc) {
  const defaultConfig = {};
  config = config || {};
  let WrappedConfirmForm = Form.create()(ConfirmFormComponent);

  config = {
    ...defaultConfig,
    modalConfig: {
      icon: null,
      ...defaultConfig.modalConfig,
      ...config.modalConfig,
      content: (
        <WrappedConfirmForm
          {...config}
          hideModal={() => {
            ConfirmModal.destroy();
          }}
        />
      ),
      footer: null,
      closable: true,
      className: `confirm-form-modal ${(config.modalConfig && config.className) || ''
        }`,
      renderFooter: () => {
        return null;
      },
    },
  };
  const ConfirmModal = Modal.info(config.modalConfig);
}
