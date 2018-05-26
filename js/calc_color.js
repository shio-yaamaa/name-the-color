var hex2rgb = function(hex) {
  var i, j, rgb;
  rgb = [];
  for (i = j = 0; j < 3; i = ++j) {
    rgb.push(parseInt(hex.slice(i * 2, i * 2 + 2), 16));
  }
  return rgb;
};

var rgb2hex = function(rgb) {
  return rgb.reduce((function(sum, element) {
    return sum + (element < 16 ? "0" + (element.toString(16)) : element.toString(16));
  }), '');
};

// to determine the font color according to the background luminance
var getLuminance = function(rgb) {
  return (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255;
};

var rgb2hsl = function(rgb) {
  var delta, h, l, max, min, s;
  rgb = rgb.map(function(element) {
    return parseFloat(element) / 255;
  });
  min = Math.min.apply(null, rgb);
  max = Math.max.apply(null, rgb);
  delta = max - min;
  l = (min + max) / 2;
  s = 0;
  if (l > 0 && l < 1) {
    s = delta / (l < 0.5 ? 2 * l : 2 - 2 * l);
  }
  h = 0;
  if (delta > 0) {
    if (max === rgb[0] && max !== rgb[1]) {
      h += (rgb[1] - rgb[2]) / delta;
    }
    if (max === rgb[1] && max !== rgb[2]) {
      h += 2 + (rgb[2] - rgb[0]) / delta;
    }
    if (max === rgb[2] && max !== rgb[0]) {
      h += 4 + (rgb[0] - rgb[1]) / delta;
    }
    h /= 6;
  }
  if (h < 0) {
    h += 1;
  }
  return [parseInt(h * 255, 10), parseInt(s * 255, 10), parseInt(l * 255, 10)];
};

function rgb2lab(rgb) {
  return xyz2lab(scaleXyz(rgb2xyz(toLinear(rgb))));
}

function toLinear(rgb) {
  rgb.map(function (element) {
    if (element <= 0.04045) {
      return element / 12.92;
    } else {
      return Math.pow((element + 0.055) / 1.055, 2.4);
    }
  });
  return rgb;
}

function rgb2xyz(rgb) {
  var xyz = [-1, -1, -1];
  var m = [
    [0.4124, 0.3576, 0.1805],
    [0.2126, 0.7152, 0.0722],
    [0.0193, 0.1192, 0.9505]
  ];
  m.forEach(function (mRow, index) {
    xyz[index] = mRow[0] * rgb[0] + mRow[1] * rgb[1] + mRow[2] * rgb[2];
  });
  return xyz;
}

function scaleXyz(xyz) {
  var scaledXyz = [-1, -1, -1];
  [95.047, 100.000, 108.883].forEach(function (element, index) {
    scaledXyz[index] = xyz[index] / element;
  });
  return xyz;
}

function xyz2lab(xyz) {
  var f = function (t) {
    if (t > 0.0089) {
      return Math.pow(t, 1.0 / 3);
    } else {
      return (Math.pow(29.0 / 3, 3) * t + 16) / 116;
    }
  };
  return [116 * f(xyz[1]) - 16, 500 * (f(xyz[0]) - f(xyz[1])), 200 * (f(xyz[1]) - f(xyz[2]))];
}