import React, { useState, useEffect } from "react";

const createSmartInput = (WrappedInput, options) => {
  options = options || {};
  const { defaultValue, comparisonType = "normal" } = options || {};
  return React.forwardRef((props, ref) => {
    let { defaultValue: propsDefaultValue } = props;
    propsDefaultValue = props.value || propsDefaultValue || defaultValue;
    const [value, setValue] = useState(
      propsDefaultValue ? propsDefaultValue : undefined
    );

    useEffect(() => {
      if (comparisonType === "normal" && value !== props.value) {
        setValue(props.value);
      } else if (
        comparisonType === "json" &&
        JSON.stringify(value) !== JSON.stringify(props.value)
      ) {
        setValue(props.value);
      } else if (
        options.compareValue instanceof Function &&
        !options.compareValue(value, props.value)
      ) {
        setValue(props.value);
      }
    }, [props.value]);

    return (
      <WrappedInput
        {...props}
        value={value}
        {...(props.setValueProp ? { setValue } : {})}
        ref={ref}
      />
    );
  });
};

export default createSmartInput;
