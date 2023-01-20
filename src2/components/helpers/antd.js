/**
 * Get First error
 * @param errors
 * @returns {*}
 */
export function getFirstError(errors) {
  if (Object.keys(errors).length == 0) {
    return;
  }
  const key = Object.keys(errors)[0];
  return errors[key].errors[0].message;
}

export function defaultFilterAutoComplete(inputValue, option) {
  return (
    option.props.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
  );
}
