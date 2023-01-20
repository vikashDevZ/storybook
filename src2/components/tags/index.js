import React from "react";
import "./styles.scss";
import { Tag, Tooltip, Input, message } from "antd";
import createSmartInput from "../createSmartInput";

/**
 * Returns the JSX Markup for the view
 * @returns {XML}
 */
const Main = createSmartInput(
  React.forwardRef(
    (props, ref) => {
      const [newValue, setNewValue] = React.useState(undefined);
      const triggerChange = (...args) => {
        if (props.setNewValue instanceof Function) {
          props.setValue(...args);
        }
        if (props.onChange && props.onChange instanceof Function) {
          props.onChange(...args);
        }
      };
      /**
       * on Remove of Tag
       * @param removedTag
       */
      const removedTag = (removedTag) => {
        const value = props.value.filter((tag) => {
          if (tag.value) {
            return tag.value !== removedTag;
          } else {
            return tag !== removedTag;
          }
        });
        triggerChange(value, removedTag, "remove");
      };
      return (
        <div className="tags" ref={ref}>
          {(props.value || []).map((tag, index) => {
            const label = tag.label || tag;
            const value = tag.value || tag;
            const isLongTag = label.length > 20;
            const tagElem = (
              <Tag
                key={index}
                closable={!!props.editable}
                {...props.tagProps}
                afterClose={() => removedTag(value)}
              >
                {isLongTag ? `${label.slice(0, 20)}...` : label}
              </Tag>
            );
            return isLongTag ? (
              <Tooltip title={label} key={index}>
                {tagElem}
              </Tooltip>
            ) : (
              tagElem
            );
          })}
          {props.allowNewTag && (
            <Input
              placeholder="Enter text and press enter"
              {...props.newTagProps}
              value={newValue}
              onChange={(e) => setNewValue(e.target.value?.trim())}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (
                    !props.allowDuplicates &&
                    props.value?.indexOf(newValue) !== -1
                  ) {
                    message.error(
                      props.duplicateMsg || "Duplicate values are not allowed"
                    );
                    return;
                  }
                  triggerChange([...props.value, newValue], newValue, "add");
                  setNewValue(undefined);
                }
              }}
            />
          )}
        </div>
      );
    },
    {
      setValueProp: true,
    }
  )
);
export default Main;
