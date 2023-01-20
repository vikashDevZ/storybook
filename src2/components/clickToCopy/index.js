import React from "react";
import { Tooltip, Icon } from "antd";
import Link from "../link";
import { selectElementText } from "../../helpers/web";
/**
 * Returns the JSX Markup for the view
 * @returns {XML}
 */
const Main = function (props) {
  const { text } = props
  const copyRef = React.useRef(null);
  return (
    <Tooltip
      placement="topLeft"
      trigger={"click"}
      title="Copied to Clipboard"
      arrowPointAtCenter
    >
      <p
        className="value"
        onClick={() => {
          navigator.clipboard.writeText(text);
          selectElementText(copyRef);
        }}
      >
        <span
          ref={copyRef}
        >
          {text}
        </span>
        <Link className="copy" onClick={() => navigator.clipboard.writeText(text)}>
          <Icon type="copy" />
        </Link>
      </p>
    </Tooltip >
  );
};
export default Main;
