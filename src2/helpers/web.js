/**
 * Check if SSR or not
 * @returns {boolean}
 */
export function isSSR() {
  return typeof window.document === 'undefined';
}

/**
 * This contains only methods related to web
 */
const isClientLoaded = !isSSR();

/**
 * To check if its mobile or Tablet
 * @param string
 * @returns {string}
 */
export function mobileAndTabletcheck() {
  var check = false;
  //Check for isomorphic code
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(window.navigator.userAgent || window.navigator.vendor || window.opera);
  return check;
}

/**
 * Get all subdomains
 * @returns {*}
 */
export function getSubdomains() {
  if (isClientLoaded) {
    var regexParse = new RegExp('[a-z-0-9]{2,63}.[a-z.]{2,5}$');
    var urlParts = regexParse.exec(window.location.hostname);
    var subdomain = window.location.hostname
      .replace(urlParts[0], '')
      .slice(0, -1);
    //Replace www
    if (subdomain.substr(0, 4) == 'www.') {
      subdomain = subdomain.substr(4);
    }
    return subdomain == '' || subdomain == 'www' ? null : subdomain;
  } else {
    return null;
  }
}

/**
 * Get Main Domain
 * @returns {*}
 */
export function getMainDomain() {
  if (isClientLoaded) {
    var regexParse = new RegExp('[a-z-0-9]{2,63}.[a-z.]{2,5}$');
    var urlParts = regexParse.exec(window.location.hostname);
    return (
      window.location.protocol +
      '//' +
      urlParts[0] +
      (window.location.port != '' ? ':' + window.location.port : '')
    );
  } else {
    return null;
  }
}

/**
 * Check if browser is of iphone or not
 */
export function isIphone() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

/**
 * Check if mobile or not
 * @returns {boolean}
 */
export function isMobile() {
  var isMobile = false; //initiate as false
  // device detection
  if (
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
      navigator.userAgent
    ) ||
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
      navigator.userAgent.substr(0, 4)
    )
  )
    isMobile = true;
  return isMobile;
}

/**
 * Convert a object to form data
 * @param obj
 * @param form
 * @param namespace
 * @returns {*}
 */
export function toFormData(obj, form, namespace) {
  let fd = form || new FormData();
  let formKey;

  for (let property in obj) {
    if (obj.hasOwnProperty(property) && obj[property]) {
      if (namespace) {
        formKey = namespace + '[' + property + ']';
      } else {
        formKey = property;
      }

      // if the property is an object, but not a File, use recursivity.
      if (obj[property] instanceof Date) {
        fd.append(formKey, obj[property].toISOString());
      } else if (
        typeof obj[property] === 'object' &&
        !(obj[property] instanceof File)
      ) {
        toFormData(obj[property], fd, formKey);
      } else {
        // if it's a string or a File object
        fd.append(formKey, obj[property]);
      }
    }
  }

  return fd;
}

/**
 * CHeck if enter is pressed
 * @param event
 * @returns {boolean}
 */
export function isEnterPress(event) {
  return event.which == 13;
}

/**
 * Scroll to top in a container
 * @param input
 */
export function scrollToTop(input) {
  var objDiv;

  if (typeof input == 'string') {
    objDiv = document.querySelector(input)[0];
  } else {
    objDiv = input;
  }
  if (objDiv) {
    objDiv.scrollTop = 0;
  }
}

/**
 * Scroll to top of window
 */
export function scrollToTopWindow() {
  window.scrollTo(0, 0);
}

/**
 * Scroll to bottom in a container
 * @param input
 */
export function scrollToBottom(input) {
  var objDiv;
  if (typeof input == 'string') {
    objDiv = document.querySelector(input)[0];
  } else {
    objDiv = input;
  }
  if (objDiv) {
    objDiv.scrollTop = objDiv.scrollHeight;
  }
}

/**
 * Parses the hash and constructs a object
 * @param hash
 */
export function parseLocationHash() {
  let hash = window.location.hash;
  hash = hash.substr(1); //Remove # character
  return parseQueryString(hash);
}

/**
 * Parses the query string without ? and constructs a object
 * @param hash
 */
export function parseQueryString(str) {
  str = str || '';
  let pieces = str.split('&'),
    data = {},
    i,
    parts;
  // process each query pair
  for (i = 0; i < pieces.length; i++) {
    parts = pieces[i].split('=');
    if (parts.length < 2) {
      parts.push('');
    }
    data[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
  }
  return data;
}

/**
 * Convert a object to query string
 * @param obj
 * @returns {string}
 */
export function toQueryString(obj) {
  return (
    '?' +
    Object.keys(obj)
      .reduce(function (a, k) {
        a.push(k + '=' + encodeURIComponent(obj[k]));
        return a;
      }, [])
      .join('&')
  );
}

/**
 * Change Fevicon
 * @param src
 */
export function changeFevicon(link) {
  function change(src) {
    var link = document.createElement('link'),
      oldLink = document.getElementById('dynamic-favicon');
    link.id = 'dynamic-favicon';
    link.rel = 'shortcut icon';
    link.href = src;
    if (oldLink) {
      document.head.removeChild(oldLink);
    }
    document.head.appendChild(link);
  }
  change(link);
}

/**
 * Change Fevicon
 * @param src
 */
export function changeTitle(title) {
  document.title = title;
}

/**
 * Select element text
 * @param element
 */
export function selectElementText(element) {
  if (!element) {
    return;
  }
  var range, selection;
  if (window.getSelection && document.createRange) {
    selection = window.getSelection();
    range = document.createRange();
    range.selectNodeContents(element);
    selection.removeAllRanges();
    selection.addRange(range);
  } else if (document.selection && document.body.createTextRange) {
    range = document.body.createTextRange();
    range.moveToElementText(element);
    range.select();
  }
}

/**
 * text ellipsis
 * @param text,number of words
 */
export function ellipsis(text, no_words) {
  text = text.replace(/(^\s*)|(\s*$)/gi, '');
  text = text.replace(/[ ]{2,}/gi, ' ');
  text = text.replace(/\n /, '\n');
  const length = text.split(' ').length;
  if (length > no_words) {
    return text.split(' ').splice(0, no_words).join(' ') + '...';
  } else {
    return text.split(' ').splice(0, no_words).join(' ');
  }
}
