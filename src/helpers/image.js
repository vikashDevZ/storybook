/**
 * Rotate image by 90 degrees
 * @param base64ImageSrc
 * @param callback
 */
export function rotateBase64Image90(base64ImageSrc, callback) {
  var canvas = document.createElement('canvas');
  var img = new Image();
  img.src = base64ImageSrc;
  img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext('2d');
    ctx.rotate((90 * Math.PI) / 180);
    ctx.translate(0, -canvas.width);
    ctx.drawImage(img, 0, 0);
    var base64 = canvas.toDataURL();
    callback(base64);
  };
}

/**
 * Check if image was taken from camera
 * @param file
 * @returns {boolean}
 */
export function wasImageFromCamera(file) {
  var lastModified = file.lastModified;
  var name = file.name;
  var currentTime = new Date().getTime();
  var differenceAllowed = 20000;
  if (name == 'image.jpg' && currentTime - lastModified <= differenceAllowed) {
    return true;
  }
  return false;
}

/**
 * Exif Orient the image
 * @param img
 * @param cb
 */
export function orientImage(img, cb) {
  if (typeof window.EXIF != 'undefined') {
    window.EXIF.getData(img, function () {
      var orientation = img.exifdata.Orientation;
      window.exifOrient(img, orientation, cb);
    });
  }
}
