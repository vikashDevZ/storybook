import React, { useMemo, useState, useEffect } from "react";
import createSmartInput from "../createSmartInput";
import { Input, Select } from "antd";
import "./styles.scss";
import {
  getCountries,
  getCountryCallingCode,
  parsePhoneNumber,
} from "libphonenumber-js";
import CountryCodeMap from "./countryCodeMap";
const separater = " - ";
let baseCountryData;
export const getCountryData = () => {
  if (!baseCountryData) {
    baseCountryData = getCountries()
      .sort((a, b) => CountryCodeMap[a].localeCompare(CountryCodeMap[b]))
      .map((country, index) => {
        const countryCallingCode = getCountryCallingCode(country);
        const countryName = CountryCodeMap[country];
        if (!countryName) {
          return null;
        }
        return {
          countryCallingCode,
          countryName,
          country,
        };
      })
      .filter((item) => !!item);
  }
  return baseCountryData;
};

export function parsePhone(phone) {
  try {
    if (phone && !phone.startsWith("+")) {
      phone = "+" + phone;
    }
    const parsed = parsePhoneNumber(phone);
    return parsed;
  } catch (e) {
    console.warn("Error while parsing phone", e);
  }
}

export function formatPhoneNumber(
  value,
  phoneSeparator = "-",
  mask = "... ... ... ..."
) {
  if (!value || value === "") {
    return "";
  }
  const lengths = mask.split(" ").map((str) => str.length);
  let regexString = "";
  let formatRegex = "";
  let remainingLength = value.length;
  for (let [index, length] of lengths.entries()) {
    formatRegex += `${index === 0 ? "" : phoneSeparator}$${index + 1}`;
    if (remainingLength > length) {
      regexString += `(\\d{${length}})`;
    } else {
      if (index === 0) {
        return value;
      }
      regexString += `(\\d{${remainingLength}})`;
      break;
    }

    remainingLength = remainingLength - length;
  }
  return value.replace(new RegExp(regexString), formatRegex);
}

export default createSmartInput(
  React.forwardRef((props, ref) => {
    const countryData = getCountryData();
    const phoneSeparator = props.separater || "-";
    const mask = props.mask || "... ... .... ...";
    const phone = useMemo(
      () => (props.value ? parsePhone(props.value) : null),
      []
    );
    const [countryCodeIndex, setCountryCodeIndex] = useState(
      phone
        ? countryData.findIndex(({ countryCallingCode }) => {
          return countryCallingCode === phone?.countryCallingCode;
        })
        : 0
    );
    const [phoneNumber, setPhoneNumber] = useState(
      phone?.nationalNumber || undefined
    );
    const countryCodes = useMemo(
      () =>
        countryData.map(
          ({ country, countryCallingCode, countryName }, index) => {
            return (
              <Select.Option key={index} value={index}>
                {props?.labelFormatter
                  ? props.labelFormatter({
                    country,
                    countryCallingCode,
                    countryName,
                  })
                  : `+${countryCallingCode}${separater}${countryName}`}
              </Select.Option>
            );
          }
        ),
      []
    );
    useEffect(() => {
      if (props.onChange instanceof Function) {
        const value = `+${countryData[countryCodeIndex]?.countryCallingCode}${phoneNumber}`;
        props.onChange(value);
      }
    }, [countryCodeIndex, phoneNumber]);

    const selectCountryCode = (
      <Select
        placeholder="Select country"
        showSearch
        filterOption={(input, option) => {
          const parts = option.props.children.split(separater);
          return (
            parts[0].indexOf(input.toLowerCase()) !== -1 ||
            parts[1].toLowerCase().startsWith(input.toLowerCase())
          );
        }}
        {...props?.selectProps}
        onChange={(value) => {
          setCountryCodeIndex(value);
          if (props?.selectProps?.onChange instanceof Function) {
            props?.selectProps?.onChange(value);
          }
        }}
        value={countryCodeIndex}
        dropdownClassName="select-country-code-dropdown"
      >
        {countryCodes}
      </Select>
    );
    return (
      <Input
        ref={ref}
        maxLength={20}
        {...props?.inputProps}
        pattern={`[0-9${phoneSeparator}]*`}
        addonBefore={selectCountryCode}
        className="phone-input"
        onChange={(e) => {
          if (e.target.validity.valid) {
            const value = e.target.value.replace(
              new RegExp(phoneSeparator, "g"),
              ""
            );
            setPhoneNumber(value);
            if (props?.inputProps?.onChange instanceof Function) {
              props?.inputProps?.onChange(value, e);
            }
          }
        }}
        value={formatPhoneNumber(phoneNumber, phoneSeparator, mask)}
      />
    );
  })
);
