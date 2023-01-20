import { useState, useEffect } from "react";

const getValue = (form, variable) => {
  if (!variable) {
    return form?.getFieldsValue();
  } else if (variable instanceof Array) {
    return form?.getFieldsValue(variable);
  } else {
    return form?.getFieldsValue([variable])[variable];
  }
};

/**
 * A hook to watch variables
 * @param {*} variable
 * @returns
 */
const useWatchForm = (form, variable) => {
  const [value, setValue] = useState(getValue(form?.current, variable));
  useEffect(() => {
    form?.current.subscribe(() => {
      setValue(getValue(form?.current, variable));
    });
    setValue(getValue(form?.current, variable));
  }, [JSON.stringify(form?.current)]);
  return value;
};

export default useWatchForm;
