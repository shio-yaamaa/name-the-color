/* global $ */
/* global Image */

/* global rgb2hex */
/* global getLuminance */

/* global showColorList */

document.getElementsByTagName('header')[0].style.backgroundColor = 'skyblue';

let uploadArea = document.getElementById('upload_area');
let fileInput = document.getElementById('file_input');
let validateError = document.getElementById('upload_validate_error');
let uploadedImage = document.getElementById('uploaded_image');
let canvas = document.getElementById('canvas');
let colorList = document.getElementById('color_list');

console.log(uploadArea)
console.log(canvas);

// for updating color_info
let color = document.getElementById('color');
let hex_p = document.getElementById('hex');
let rgb_p = [document.getElementById('r'), document.getElementById('g'), document.getElementById('b')];

let pixelsData = null;

// window.innerWidthはスマホでは普通に小さい？
let imageWidth = Math.min(window.innerWidth, 400);
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
  var file = validateFiles(event.originalEvent.dataTransfer.files);
  event.preventDefault();
  this.classList.remove('dragover');
  if (file) {
    displayImage(file);
  }
});
fileInput.addEventListener('change', function(event) {
  document.getElementsByTagName('header')[0].style.backgroundColor = 'orange';
  let file = validateFiles(this.files);
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
  for (let i = 0; i < 3; i++) {
    document.getElementsByClassName('single_color_list').item(i).style.display = 'flex';
  }
  updateColor(rgb2hex(rgbAtPixel), rgbAtPixel);
});

let validateFiles = function(files) {
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

let toggleValidateError = function(show, message) {
  if (show) {
    validateError.style.display = 'block';
    validateError.innerHTML = message;
  } else {
    validateError.style.display = 'none';
  }
};

let displayImage = function(file) {
  let fileReader = new FileReader();
  fileReader.readAsDataURL(file);
  fileReader.onload = function () {
    let image = new Image();
    image.onload = function() {
      uploadedImage.style.display = 'block';
      document.getElementsByTagName('header')[0].style.backgroundColor = 'green';
      
      let context = canvas.getContext('2d');
      let isLandscape = this.width >= this.height;
      canvas.width = imageWidth;
      canvas.height = isLandscape ? this.height * (canvas.width / this.width) : 400;
      let scale = isLandscape ? canvas.width / this.width : canvas.height / this.height;
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

let getRgbAtPixel = function(canvas, pixelsData, x, y) {
  var alpha, base, ref;
  ref = [Math.round(x), Math.round(y)], x = ref[0], y = ref[1];
  base = (canvas.width * y + x) * 4;
  alpha = pixelsData[base + 3];
  return [pixelsData[base + 0] + (255 - alpha), pixelsData[base + 1] + (255 - alpha), pixelsData[base + 2] + (255 - alpha)];
};

let updateColor = function(hex, rgb) {
  color.style.backgroundColor = '#' + hex;
  color.style.color = getLuminance(rgb) > 0.6 ? 'black' : 'white';
  hex_p.innerHTML = '#' + (hex.toUpperCase());
  rgb_p.forEach(function (element, index) {
    element.innerHTML = rgb[index];
  });
  
  showColorList(rgb);
};