import React from "react";
import "./styles.scss";
import { Select } from "antd";
import createSmartInput from "../createSmartInput";

export default createSmartInput(
  React.forwardRef((props, ref) => {
    const onChange = (tags) => {
      const { onChange, regex, onError } = props;
      if (regex) {
        if (!regex.test(tags[tags.length - 1]) && onError instanceof Function) {
          onError(tags[tags.length - 1]);
        }
        tags = tags.filter((tag) => regex.test(tag));
      }
      this.setState({ tags });
      if (onChange instanceof Function) {
        onChange(tags);
      }
    };
    return (
      <div className="tags">
        <Select
          mode="tags"
          onChange={onChange}
          dropdownStyle={{
            display: "none",
            ...props.dropdownStyle,
          }}
          {...props}
          ref={ref}
        />
      </div>
    );
  })
);
