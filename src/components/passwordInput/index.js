import React, { useState } from "react";
import "./styles.scss";
import createSmartInput from "../createSmartInput";
import { Input, Icon } from "antd";
export default createSmartInput(
  React.forwardRef((props, ref) => {
    const [showPassword, setShowPassword] = useState(
      props.defaultShowPassword || false
    );
    return (
      <Input
        ref={ref}
        suffix={
          <Icon
            onClick={() => setShowPassword(!showPassword)}
            type={showPassword ? "eye-invisible" : "eye"}
          />
        }
        {...props}
        type={showPassword ? "text" : "password"}
        className="password-input"
      />
    );
  })
);
