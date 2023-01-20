import React, { useEffect, useState } from 'react';
import './styles.scss';
import { Icon, Select } from 'antd';

const Option = Select.Option;
/**
 * @description Change Language Component
 * @type Container
 * @author Inderdeep
 */
const Main = ({
  value: defaultValue,
  onChange,
  languages,
  disableTranslateOnClick,
}) => {

  const [value, setValue] = useState(defaultValue || 'en');
  useEffect(() => {
    document.querySelector('select.goog-te-combo') &&
      document.querySelector('select.goog-te-combo').value !== ''
      ? setValue(document.querySelector('select.goog-te-combo').value)
      : null;
  }, []);
  let englishPresent = false;
  
  if (!languages) {
    languages = [];
    window.document &&
      window.document.querySelectorAll &&
      window.document
        .querySelectorAll('select.goog-te-combo option')
        .forEach((item) => {
          if (item.value === 'en') {
            englishPresent = true;
          }
          if (item.value !== '') {
            languages.push({
              value: item.value,
              label: item.innerText,
            });
          }
        });
    if (!englishPresent) {
      languages = [
        {
          value: 'en',
          label: 'English',
        },
        ...languages,
      ];
    }
    languages = languages.sort((a, b) => {
      if (a.label < b.label) {
        return -1;
      }
      if (a.label > b.label) {
        return 1;
      }
      return 0;
    });
  }

  return (
    <div className="language">
      <Icon type="global" className="globe-icon" />
      <Select
        className="changeLanguage"
        defaultValue={value}
        value={value}
        onSelect={(value) => {
          setValue(value);
          window.changeGoogleTranslateLanguage instanceof Function &&
            !disableTranslateOnClick &&
            window.changeGoogleTranslateLanguage(value);
          if (onChange instanceof Function) {
            onChange(value);
          }
        }}
      //getPopupContainer={(trigger) => trigger.parentNode}
      >
        {languages.map(({ value, label }, index) => {
          return (
            <Option key={index} value={value}>
              {label}
            </Option>
          );
        })}
      </Select>
    </div>
  );
};

Main.displayName = 'changeLanguage';
//Pre process the container with Redux Plugins
export default Main;
