import React from 'react';

/**
 * @description Script Tag Component
 * @type Component
 * @author
 */
const Main = ({ children, ...props }) => {
  return (
    <script
      dangerouslySetInnerHTML={
        children
          ? {
              __html: children,
            }
          : null
      }
      {...props}
    ></script>
  );
};
Main.displayName = 'Script-Tag';
export default Main;
