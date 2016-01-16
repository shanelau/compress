/*!
 * compress.js
 * @version 1.0
 * @author liuxing
 *
 * 这是一个基于canvas，应用在移动端的前端图片压缩的JS。
 * Date: 2016-1-16
 */

(function(window) {

  /**
   *
   * @param origin base64 image data
   * @param width integer width for compressed image
   * @param callback function
   * @returns {string} base64 image data
   */
  function compress(srcString, afterWidth, callback) {
    var hidCanvas = document.createElement('canvas');
    var hidCtx;
    if (hidCanvas.getContext) {
      hidCtx = hidCanvas.getContext('2d');
    } else {
      // callback();
      // browser not support
    }
    var p = new Image();

    //安卓获取的base64数据无信息头，加之
    if (srcString.substring(5, 10) != "image") {
      p.src = srcString.replace(/(.{5})/, "$1image/jpeg;");
    } else {
      p.src = srcString;
    }
    var upImgWidth = p.width,
      upImgHeight = p.height;
    if (upImgWidth < afterWidth) {
      p = null;
      return callback(srcString);
    }

    //压缩换算后的图片高度
    var afterHeight = afterWidth * upImgHeight / upImgWidth;
    if (upImgWidth < 10 || upImgWidth < 10) {
      callback(srcString);
    } else {

      // 设置压缩canvas区域高度及宽度
      hidCanvas.setAttribute("height", afterHeight);
      hidCanvas.setAttribute("width", afterWidth);

      // canvas绘制压缩后图片
      drawImageIOSFix(hidCtx, p, 0, 0, upImgWidth, upImgHeight, 0, 0,
        afterWidth, afterHeight);
      // 获取压缩后生成的img对象
      p = null;
      callback(convertCanvasToImage(hidCanvas).src);
    }
  };

  //canvas转图像
  function convertCanvasToImage(canvas) {
    var image = new Image();
    image.src = canvas.toDataURL("image/jpeg");
    return image;
  }

  /**
   * 以下代码是修复canvas在ios中显示压缩的问题。
   * Detecting vertical squash in loaded image.
   * Fixes a bug which squash image vertically while drawing into canvas for some images.
   * This is a bug in iOS6 devices. This function from https://github.com/stomita/ios-imagefile-megapixel
   *
   */
  function detectVerticalSquash(img) {
    var iw = img.naturalWidth,
      ih = img.naturalHeight;
    var canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = ih;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    var data = ctx.getImageData(0, 0, 1, ih).data;
    // search image edge pixel position in case it is squashed vertically.
    var sy = 0;
    var ey = ih;
    var py = ih;
    while (py > sy) {
      var alpha = data[(py - 1) * 4 + 3];
      if (alpha === 0) {
        ey = py;
      } else {
        sy = py;
      }
      py = (ey + sy) >> 1;
    }
    var ratio = (py / ih);
    return (ratio === 0) ? 1 : ratio;
  }

  /**
   * A replacement for context.drawImage
   * (args are for source and destination).
   */
  function drawImageIOSFix(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
    var vertSquashRatio = detectVerticalSquash(img);
    // Works only if whole image is displayed:
    // ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
    // The following works correct also when only a part of the image is displayed:
    ctx.drawImage(img, sx * vertSquashRatio, sy * vertSquashRatio,
      sw * vertSquashRatio, sh * vertSquashRatio,
      dx, dy, dw, dh);
  }
  window.compress = compress;
})(window);
