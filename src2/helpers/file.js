/**
 * Convert data URI to blob
 * @param dataurl
 * @returns {*}
 */
export function dataURLtoBlob(dataurl) {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {
    type: mime,
  });
}

/**
 * Convert blob to blobURI
 * @param blob
 * @returns {*}
 */
export function blobToBlobURL(blob) {
  window.URL = window.URL || window.webkitURL;
  var blobUrl = window.URL.createObjectURL(blob);
  return blobUrl;
}

/**
 * Convert dataURI to blobURI
 * @param dataURI
 * @returns {*}
 */
export function dataURLToBlobURL(dataURI) {
  var blob = this.convertToFile(dataURI);
  return this.blobToBlobURL(blob);
}

/**
 * Convert a data URI to file
 * @param dataURI
 * @returns {*}
 */
export function convertToFile(dataURI) {
  // convert base64/URLEncoded data component to raw binary data held in a string
  var byteString;
  if (dataURI.split(',')[0].indexOf('base64') >= 0)
    byteString = atob(dataURI.split(',')[1]);
  else byteString = unescape(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to a typed array
  var ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], {
    type: mimeString,
  });
}

export function blobToDataURL(blob, callback) {
  var a = new FileReader();
  a.onload = function (e) {
    callback(e.target.result);
  };
  a.readAsDataURL(blob);
}
