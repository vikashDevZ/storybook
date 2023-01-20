import React from 'react';

/**
 * @description Style Tag Component
 * @type Component
 * @author
 */
const Main = ({ children, ...props }) => {
  return (
    <style
      dangerouslySetInnerHTML={
        children
          ? {
              __html: children,
            }
          : null
      }
      {...props}
    ></style>
  );
};
Main.displayName = 'Style-Tag';
export default Main;
