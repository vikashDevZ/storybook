import React, { useImperativeHandle, useRef, useEffect } from "react";
import "./styles.scss";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Checkbox,
  Select,
  Switch,
} from "antd";
import FilePicker from "../filePicker";
import PasswordInput from "../passwordInput";
import PhoneInput from "../phoneInput";

const adjectiveMap = {
  checkbox: "check",
  switch: "mark",
  select: "select",
};

/**
 * @description Form Component
 * @type component
 * @author Inderdeep
 */
const Main = React.forwardRef(
  (
    {
      elements = [],
      form,
      actions = [],
      onSubmit,
      onError,
      requiredMessage,
      formProps,
      submitButtonProps,
      hideSubmitButton,
      excludedFields = []
    },
    ref
  ) => {
    const isSsr = !window?.document?.getElementById;

    /**
     * We had to disable this form on SSR because
     * when the url contains some query params, THis form breaks
     * due to error of invalid hook call. It seems maybe due to react-router
     * or antd form, Not sure yet.
     */
    if (isSsr) {
      return null;
    }
    const subscribeChanges = useRef(null);
    useImperativeHandle(ref, () => ({
      ...form,
      subscribe: (fn) => {
        subscribeChanges.current = fn;
      },
    }));

    const { getFieldDecorator, getFieldsValue } = form;

    if (!elements instanceof Array) {
      elements = [];
      console.warn("Elements should be a array");
    }
    const handleSubmit = (event) => {
      event.preventDefault();
      const { validateFieldsAndScroll } = form;
      validateFieldsAndScroll(async (errors, values) => {
        values = { ...values };
        if (errors) {
          onError instanceof Function && onError(errors, values, form);
          return;
        }
        excludedFields.forEach((field) => {
          delete values[field]
        })
        onSubmit instanceof Function && onSubmit(values, form);
      });
    };

    const renderElement = (element, index) => {
      if (!element) {
        return null;
      }
      let input = null;
      let {
        type,
        label,
        name,
        options,
        inputProps,
        optionProps,
        Component,
        data,
        required,
      } = element;
      let hideLabel = false;
      type = (type || "text").toLowerCase();
      inputProps = inputProps || {};
      options = {
        ...options,
      };
      options.rules = [...(options.rules || [])];
      inputProps.placeholder = inputProps.placeholder || label;
      switch (type) {
        case "text":
        case "email":
          input = (
            <Input
              type={type}
              className={`input ${inputProps.className || ""}`}
              maxLength={200}
              {...inputProps}
            />
          );
          if (
            type === "email" &&
            !options.rules.find((rule) => {
              return rule.type === "email";
            })
          ) {
            options.rules.push({
              type: "email",
              message:
                element.invalidMessage ||
                `Please enter a valid ${element.label ? `${element.label.toLowerCase()}` : "value"
                }`,
            });
          }
          break;
        case "phone":
          input = (
            <PhoneInput
              className={`input ${inputProps.className || ""}`}
              {...inputProps}
            />
          );
          if (
            !options.rules.find((rule) => {
              return rule.min || rule.max || rule.pattern;
            })
          ) {
            options.rules.push({
              min: 10,
              message:
                element.invalidMessage || "Please enter a valid phone number",
            });
            options.rules.push({
              max: 20,
              message:
                element.invalidMessage || "Please enter a valid phone number",
            });
          }
          break;
        case "password":
          input = (
            <PasswordInput
              className={`input ${inputProps.className || ""}`}
              maxLength={200}
              {...inputProps}
            />
          );
          break;
        case "textarea":
          input = (
            <Input.TextArea
              className={`input ${inputProps.className || ""}`}
              maxLength={1000}
              {...inputProps}
            />
          );
          break;
        case "number":
          input = (
            <InputNumber
              className={`input ${inputProps.className || ""}`}
              {...inputProps}
            />
          );
          break;

        case "select":
          input = (
            <Select
              className={`select ${inputProps.className || ""}`}
              {...inputProps}
            >
              {(data || []).map((item, index) => {
                let { label, value } = item;
                if (typeof item === "string") {
                  label = item;
                  value = item;
                }
                return (
                  <Select.Option {...optionProps} key={index} value={value}>
                    {label}
                  </Select.Option>
                );
              })}
            </Select>
          );
          break;
        case "switch":
          input = <Switch {...inputProps}></Switch>;
          options.valuePropName = "checked";
          break;
        case "checkbox":
          hideLabel = true;
          options.valuePropName = "checked";
          input = <Checkbox {...inputProps}>{element.label}</Checkbox>;
          break;
        case "file":
          if (element.maxFileCount) {
            options.rules.push({
              validator: (rule, value, callback) => {
                if (
                  value instanceof Array &&
                  value.length > element.maxFileCount
                ) {
                  callback(
                    element.maxFilesMessage ||
                    `A Maximum ${element.maxFileCount} number of files are allowed`
                  );
                } else {
                  callback();
                }
              },
            });
          }
          input = (
            <FilePicker
              uploadProps={{
                accept: "*/*",
                multiple: false,
                ...inputProps,
              }}
            ></FilePicker>
          );
          break;
        case "custom":
          delete inputProps.placeholder;
          input = <Component {...inputProps} />;
      }
      if (required) {
        options.rules.push({
          required: true,
          message:
            element.requiredMessage ||
            (requiredMessage &&
              requiredMessage.replace("{label}", element.label)) ||
            `Please ${adjectiveMap[type] || "enter"} ${element.label && typeof element.label === "string"
              ? `the ${element.label.toLowerCase()}`
              : "this field"
            }`,
          ...(type === "switch" || type === "checkbox"
            ? {
              transform: (value) => value || undefined, // Those two lines
              type: "boolean",
            }
            : {}),
        });
      }

      input = getFieldDecorator(name, options)(input);
      return (
        <React.Fragment
          key={typeof index === undefined ? Math.random() : index}
        >
          {element.before}
          <Form.Item
            hasFeedback={true}
            label={!hideLabel ? element.label || "" : undefined}
            {...element.formItemProps}
          >
            {element.inputBefore}
            {input}
            {element.inputAfter}
          </Form.Item>
          {element.after}
        </React.Fragment>
      );
    };
    const fieldValues = getFieldsValue();
    useEffect(() => {
      if (subscribeChanges.current instanceof Function) {
        subscribeChanges.current(fieldValues);
      }
    }, [JSON.stringify(fieldValues)]);

    return (
      <Form onSubmit={handleSubmit} {...formProps} ref={ref}>
        <div className="form">
          {elements.map((element, index) => {
            if (element.condition instanceof Function) {
              element = {
                ...element,
                ...element.condition({
                  element,
                  values: fieldValues,
                }),
              };
            }
            if (
              (element.type === 'inline' || element.type === 'section') &&
              element.elements instanceof Array &&
              element.elements.length
            ) {
              return (
                <div className={element.type === 'inline' ? "inline-fields" : "section"} key={index}>
                  {
                    (element.type === 'section') ? <div className="section-header">
                      <p className="name">{element.label}</p>
                      <p className="description">{element.description}</p>
                    </div> : null
                  }
                  <div className={element.type === 'inline' ? "inline" : "fields"}>
                    {element.elements.map((obj, i) => {
                      return renderElement(obj, i);
                    })}
                  </div>
                </div>
              );
            } else {
              return renderElement(element, index);
            }
          })}
        </div>
        {hideSubmitButton && actions.length === 0 ? null : (
          <div className="actions">
            {!hideSubmitButton && (
              <Button
                htmlType={"submit"}
                className="btn primary-btn"
                {...submitButtonProps}
              >
                {(submitButtonProps && submitButtonProps.children) || "Submit"}
              </Button>
            )}
            {actions}
          </div>
        )}
      </Form>
    );
  }
);
Main.displayName = "Form-Component";
const EnhancedForm = Form.create()(Main);
export default React.forwardRef((props, ref) => {
  return <EnhancedForm {...props} wrappedComponentRef={ref} />;
});

export const createFormWithConfig = (config = {}) => {
  return Form.create(config)(Main);
};