import _ from 'lodash';

/**
 * Commonly used helper methods
 */
/**
 * To convert a string to camel case
 * @param str
 */
export function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    if (+match === 0) return ''; // or if (/\s+/.test(match)) for white spaces
    return index == 0 ? match.toLowerCase() : match.toUpperCase();
  });
}

/**
 * To convert first character of a string to uppercase
 * @param string
 * @returns {string}
 */
export function jsUcfirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function dateCompare(a, b) {
  var dateA = new Date(a.date);
  var dateB = new Date(b.date);
  return dateA - dateB;
}

/**
 * Check regex
 * @type {RegExp}
 */
export const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/**
 * Get background image style
 * @param image
 * @returns Object
 */
export function getBackgroundImageStyle(image) {
  if (!image || image == '') {
    return null;
  }
  return 'url("' + image + '")';
}

/**
 * Convert amount to user friendly format
 * @param n
 * @param d
 * @returns {*}
 */
// export function amountToString(n, d) {
//   d = d || 2;
//   var x, p;
//   x = ('' + n).length;
//   (p = Math.pow), (d = p(10, d));
//   x -= x % 3;
//   return Math.round((n * d) / p(10, x)) / d + ' kMGTPE'[x / 3];
// }

/**
 * Get amount in currency format
 */
export function toCurrency(amount) {
  return '$' + amount;
}

/**
 * Get plain text from html
 * @param html
 * @returns {string|string}
 */
export function getPlainText(html) {
  var tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

export function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
  //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
  var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

  var CSV = '';
  //Set Report title in first row or line

  CSV += ReportTitle + '\r\n\n';

  //This condition will generate the Label/Header
  if (ShowLabel) {
    var row = '';

    //This loop will extract the label from 1st index of on array
    for (var index in arrData[0]) {
      //Now convert each value to string and comma-seprated
      row += index + ',';
    }

    row = row.slice(0, -1);

    //append Label row with line break
    CSV += row + '\r\n';
  }

  //1st loop is to extract each row
  for (var i = 0; i < arrData.length; i++) {
    var row = '';

    //2nd loop will extract each column and convert it in string comma-seprated
    for (var index in arrData[i]) {
      row += '"' + arrData[i][index] + '",';
    }

    row.slice(0, row.length - 1);

    //add a line break after each row
    CSV += row + '\r\n';
  }

  if (CSV == '') {
    alert('Invalid data');
    return;
  }

  //Generate a file name
  var fileName = 'MyReport_';
  //this will remove the blank-spaces from the title and replace it with an underscore
  fileName += ReportTitle.replace(/ /g, '_');

  //Initialize file format you want csv or xls
  var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

  // now the little tricky part.
  // you can use either>> window.open(uri);
  // but this will not work in some browsers
  // or you will not get the correct file extension

  //this trick will generate a temp <a /> tag
  var link = document.createElement('a');
  link.href = uri;

  //set the visibility hidden so it will not effect on your web-layout
  link.style = 'visibility:hidden';
  link.download = fileName + '.csv';

  //this part will append the anchor tag and remove it after automatic click
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Get only the props that are different
 * Note that it will only check the props of new object
 * that have changed w.r.t  old object no the viceversa
 * The props which don't exist on new object are ignored
 * @param object  - New Object
 * @param base - Old Object
 */
export function getObjectsDiff(object, base) {
  function changes(object, base) {
    let arrayIndexCounter = 0;
    return _.transform(object, function (result, value, key) {
      if (!_.isEqual(value, base[key])) {
        let resultKey = _.isArray(base) ? arrayIndexCounter++ : key;
        result[resultKey] =
          _.isObject(value) && _.isObject(base[key])
            ? changes(value, base[key])
            : value;
        //console.log("Result: " + JSON.stringify(result));
      }
    });
  }
  return changes(object, base);
}

/**
 * Compares only the keys that exist on both the objects, Ignores which are not present
 * @param object  - New Object
 * @param base - Old Object
 * @param includeOthers - Include other properties which exist only one of the objects.
 */
export function getObjectsDiffKeys(obj1, obj2, includeOthers) {
  const diff = Object.keys(obj1).reduce((result, key) => {
    if (obj2.hasOwnProperty(key) && _.isEqual(obj1[key], obj2[key])) {
      const resultKeyIndex = result.indexOf(key);
      result.splice(resultKeyIndex, 1);
    } else {
      if (!obj2.hasOwnProperty(key) && includeOthers) {
        result.push(key);
      }
    }
    return result;
  }, Object.keys(obj2));

  return diff;
}

/**
 * Put delay
 * @param seconds
 * @returns {Promise<any>}
 */
export function delay(ms) {
  return new Promise((res) => setTimeout(res, ms * 1000));
}

export function nFormatter(num, digits = 1) {
  var si = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ];
  var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol;
}

/**
 * allowUpperCase changes string to uppercase
 * and deletes any spaces
 * @param {*} e
 */
export function allowUpperCase(e) {
  const { value } = e.target;
  if (value) {
    e.target.value = e.target.value.replace(' ', '').toUpperCase();
  }
}

export function parseJSON(json) {
  try {
    return JSON.parse(json);
  } catch (e) {
    console.error('Error while parsing json ', { e });
  }
}

/**
 * Convert RGB to Hex
 * @param r
 * @param g
 * @param b
 * @returns {string}
 */
export function rgbToHex(data) {
  if (!data) {
    return '';
  }
  const { r, g, b } = data;
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function readableSize(bytes) {
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  return (bytes / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + sizes[i];
}

export function convertToString(camelCase = '') {
  let output = '';
  for (let i = 0; i < camelCase.length; i++) {
    const char = camelCase.charAt(i);
    if (i == 0) {
      output = output + char.toUpperCase();
    } else if (char === char.toUpperCase()) {
      output = output + ' ' + char;
    } else {
      output = output + char;
    }
  }
  return output;
}
