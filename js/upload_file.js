/* global $ */
/* global Image */

/* global rgb2hex */
/* global getLuminance */

/* global showColorList */

var uploadArea = document.getElementById('upload_area');
var fileInput = document.getElementById('file_input');
var validateError = document.getElementById('upload_validate_error');
var uploadedImage = document.getElementById('uploaded_image');
var canvas = document.getElementById('canvas');
var colorList = document.getElementById('color_list');

// for updating color_info
var color = document.getElementById('color');
var hex_p = document.getElementById('hex');
var rgb_p = [document.getElementById('r'), document.getElementById('g'), document.getElementById('b')];

var pixelsData = null;

// window.innerWidthはAndroidでは普通やけどiOSで大きいっぽい。iOSではscreen.widthが普通やけどデスクトップPCやとでかい。
var imageWidth = Math.min(Math.min(window.innerWidth, screen.width), 400);
window.addEventListener('resize', function(){
  console.log('window resized');
  imageWidth = Math.min(window.innerWidth, 400);
});

uploadArea.addEventListener('dragover', function(event) {
  event.preventDefault();
  this.classList.add('dragover');
});
uploadArea.addEventListener('dragleave', function(event) {
  event.preventDefault();
  this.classList.remove('dragover');
});
uploadArea.addEventListener('drop', function(event) {
  event.preventDefault();
  this.classList.remove('dragover');
  var file = validateFiles(event.dataTransfer.files);
  if (file) {
    displayImage(file);
  }
});
fileInput.addEventListener('change', function(event) {
  var file = validateFiles(this.files);
  if (file) {
    displayImage(file);
  }
});
canvas.addEventListener('click', function(event) {
  var rect, ref, rgbAtPixel, x, y;
  rect = event.target.getBoundingClientRect();
  ref = [event.clientX - rect.left, event.clientY - rect.top], x = ref[0], y = ref[1];
  rgbAtPixel = getRgbAtPixel(canvas, pixelsData, x, y);
  color.style.display = 'block';
  colorList.style.display = 'block';
  for (var i = 0; i < 3; i++) {
    document.getElementsByClassName('single_color_list').item(i).style.display = 'flex';
  }
  updateColor(rgb2hex(rgbAtPixel), rgbAtPixel);
});

var validateFiles = function(files) {
  if (!files || files.length === 0) {
    return false;
  }
  if (files.length > 1) {
    toggleValidateError(true, '単一のファイルを選択してください');
    return false;
  }
  if (files[0].type.split('/')[0] !== 'image') {
    toggleValidateError(true, '画像以外のファイルは無効です');
    return false;
  }
  toggleValidateError(false, null);
  return files[0];
};

var toggleValidateError = function(show, message) {
  if (show) {
    validateError.style.display = 'block';
    validateError.innerHTML = message;
  } else {
    validateError.style.display = 'none';
  }
};

var displayImage = function(file) {
  var fileReader = new FileReader();
  fileReader.readAsDataURL(file);
  fileReader.onload = function () {
    var image = new Image();
    image.onload = function() {
      uploadedImage.style.display = 'block';
      
      var context = canvas.getContext('2d');
      var isLandscape = this.width >= this.height;
      canvas.width = imageWidth;
      canvas.height = isLandscape ? this.height * (canvas.width / this.width) : 400;
      var scale = isLandscape ? canvas.width / this.width : canvas.height / this.height;
      // drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
      if (isLandscape) {
        context.drawImage(this, 0, 0, this.width, this.height, 0, 0, canvas.width, canvas.height);
      } else {
        context.drawImage(this, 0, 0, this.width, this.height, (canvas.width - this.width * scale) / 2, 0, this.width * scale, canvas.height);
      }
      pixelsData = context.getImageData(0, 0, canvas.width, canvas.height).data;
    };
    image.src = fileReader.result;
  };
};

var getRgbAtPixel = function(canvas, pixelsData, x, y) {
  var alpha, base, ref;
  ref = [Math.round(x), Math.round(y)], x = ref[0], y = ref[1];
  base = (canvas.width * y + x) * 4;
  alpha = pixelsData[base + 3];
  return [pixelsData[base + 0] + (255 - alpha), pixelsData[base + 1] + (255 - alpha), pixelsData[base + 2] + (255 - alpha)];
};

var updateColor = function(hex, rgb) {
  color.style.backgroundColor = '#' + hex;
  color.style.color = getLuminance(rgb) > 0.6 ? 'black' : 'white';
  hex_p.innerHTML = '#' + (hex.toUpperCase());
  rgb_p.forEach(function (element, index) {
    element.innerHTML = rgb[index];
  });
  
  showColorList(rgb);
};