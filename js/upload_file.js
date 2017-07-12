/* global $ */
/* global Image */

/* global rgb2hex */
/* global getLuminance */

/* global showColorList */

let uploadArea = $('#upload_area');
let fileInput = $('#file_input');
let validateError = $('#upload_validate_error');
let uploadedImage = $('#uploaded_image');
let canvas = $('#canvas')[0];
let colorList = $('#color_list');

console.log(canvas[0]);

// for updating color_info
let color = $('#color');
let hex_p = color.find('#hex');
let rgb_p = [color.find('#r'), color.find('#g'), color.find('#b')];

let pixelsData = null;

// $(window).width()はスマホでは普通に小さい
let imageWidth = Math.min($(window).width(), 400);
$(window).on('resize', function(){
  imageWidth = Math.min($(window).width(), 400);
});

uploadArea.on('dragover', function(event) {
  event.preventDefault();
  $(this).addClass('dragover');
}).on('dragleave', function(event) {
  event.preventDefault();
  $(this).removeClass('dragover');
}).on('drop', function(event) {
  var file = validateFiles(event.originalEvent.dataTransfer.files);
  event.preventDefault();
  $(this).removeClass('dragover');
  if (file) {
    displayImage(file);
  }
});
fileInput.on('change', function(event) {
  let file = validateFiles(this.files);
  if (file) {
    displayImage(file);
  }
});
$(canvas).on('click', function(event) {
  var rect, ref, rgbAtPixel, x, y;
  rect = event.target.getBoundingClientRect();
  ref = [event.clientX - rect.left, event.clientY - rect.top], x = ref[0], y = ref[1];
  rgbAtPixel = getRgbAtPixel(canvas, pixelsData, x, y);
  color.css('display', 'block');
  colorList.css('display', 'block');
  colorList.children().each(function (index, element) {
    $(element).css('display', 'flex');
  });
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
    validateError.css('display', 'block').html(message);
  } else {
    validateError.css('display', 'none');
  }
};

let displayImage = function(file) {
  let fileReader = new FileReader();
  fileReader.readAsDataURL(file);
  fileReader.onload = function () {
    let image = new Image();
    image.onload = function() {
      $(uploadedImage).css('display', 'block');
      $('#upload_area').append($('<p></p>').text('画像を読み込もうとしています'));
      
      let context = canvas.getContext('2d');
      let isLandscape = this.width >= this.height;
      canvas.width = imageWidth;
      canvas.height = isLandscape ? this.height * (canvas.width / this.width) : 400;
      let scale = isLandscape ? canvas.width / this.width : canvas.height / this.height;
      // drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
      if (isLandscape) {
        context.drawImage(this, 0, 0, this.width, this.height, 0, 0, canvas.width, canvas.height);
      } else {
        context.drawImage(this, 0, 0, this.width, this.height, isLandscape ? 0 : (canvas.width - this.width * scale) / 2, isLandscape ? (canvas.height - this.height * scale) / 2 : 0, isLandscape ? canvas.width : this.width * scale, isLandscape ? this.height * scale : canvas.height);
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
  color.css('background-color', "#" + hex);
  console.log(getLuminance(rgb));
  color.css('color', getLuminance(rgb) > 0.6 ? 'black' : 'white');
  hex_p.text("#" + (hex.toUpperCase()));
  rgb_p.forEach(function (element, index) {
    $(element).text(rgb[index]);
  });
  
  showColorList(rgb);
};