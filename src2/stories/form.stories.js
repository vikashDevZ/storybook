import { Checkbox } from 'antd';
import createSmartInput from '../components/createSmartInput';
import EnhancedForm from '../components/form'
import React from 'react';

export default {
  title: 'Form',
  component: EnhancedForm
};

const Template = (args) => <EnhancedForm {...args} />

export const TextInput = Template.bind({})
TextInput.args = {
  skipTranslate: true,
  elements: [
    {
      type: 'text',
      name: 'title',
      label: 'Title',
      required: true,
      maxLength: 200,
      options: {
        initialValue: 'initial value'
      },
      elements: [],
      fileCode: '',
      requiredMessage: ''
    }
  ],
  submitButtonProps: {
    children: 'Submit',
  }
}

export const CustomInput = () => {
  const form = React.useRef(null)
  return <EnhancedForm
    ref={form}
    skipTranslate={true}
    elements={[
      {
        type: 'custom',
        required: true,
        name: 'permissions',
        requiredMessage: 'Please select the permissions',
        Component: createSmartInput(
          React.forwardRef(({ value, onChange }, ref) => {
            return (
              <Checkbox.Group
                ref={ref}
                value={value}
                onChange={onChange}
              >
                {['Create', 'Update', 'Remove', 'Read'].map((name, index) => {
                  return (
                    <Checkbox key={index} value={name}>
                      {name}
                    </Checkbox>
                  );
                })}
              </Checkbox.Group>
            );
          })
        ),
        after: (
          <Checkbox
            onChange={(e) => {
              form.current.setFieldsValue({
                permissions: e.target.checked ? ['Create', 'Update', 'Remove', 'Read'] : [],
              });
            }}
          >
            Select All
          </Checkbox>
        ),
      }
    ]}
  >
  </EnhancedForm>
}

export const ValidationInput = Template.bind({})
ValidationInput.args = {
  skipTranslate: true,
  elements: [
    {
      type: 'text',
      name: 'key',
      label: 'Template label',
      required: true,
      options: {
        rules: [
          {
            pattern: /^[a-z0-9-_]+$/i,
            message:
              'Key can only be alphanumeric and can contain only hyphens (-)',
          },
        ],
      },
      inputProps: {
        disabled: false,
        className: 'uppercase',
      },
    }
  ]
}
