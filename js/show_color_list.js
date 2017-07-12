/* global $ */
/* global tradJpnColors */
/* global jpnColors */
/* global engColors */
/* global rgb2hex */
/* global rgb2hsl */
/* global rgb2lab */

function showColorList(rgb) {
  showSingleColorList(rgb, tradJpnColors, 'trad_jpn_color_list');
  showSingleColorList(rgb, jpnColors, 'jpn_color_list');
  showSingleColorList(rgb, engColors, 'eng_color_list');
}

function showSingleColorList(rgb, colorArray, containerId) {
  console.log(containerId);
  var colors = getColorList(rgb, colorArray);
  console.log(colors);
  var container = document.getElementById(containerId);
  
  colors.forEach(function (color, index) {
    var frame = container.getElementsByClassName('single_color_container')[index];
    var hex = rgb2hex([color['r'], color['g'], color['b']]);
    frame.getElementsByClassName('color_list_preview')[0].style.backgroundColor = '#' + hex;
    frame.getElementsByClassName('color_list_name')[0].innerHTML = color['name'];
    frame.getElementsByClassName('color_list_hex')[0].innerHTML = '#' + hex.toUpperCase();
    
    frame.getElementsByClassName('color_list_r')[0].innerHTML = color['r'];
    frame.getElementsByClassName('color_list_g')[0].innerHTML = color['g'];
    frame.getElementsByClassName('color_list_b')[0].innerHTML = color['b'];
  });
}

function getColorList(rgb, colorArray) {
  var candidates = [null, null, null];
  var candidateDifferences = [-1, -1, -1];
  colorArray.forEach(function (colorInList, colorIndex) {
    var labOfColorInList = rgb2lab([colorInList['r'], colorInList['g'], colorInList['b']]);
    var labOfColor = rgb2lab(rgb);
    var difference = Math.pow(labOfColorInList[0] - labOfColor[0], 2)
      + Math.pow(labOfColorInList[1] - labOfColor[1], 2)
      + Math.pow(labOfColorInList[2] - labOfColor[2], 2);
    for (var i = 0; i < 3; i++) {
      if (candidates[i] == null || difference < candidateDifferences[i]) {
        candidates[i] = colorInList;
        candidateDifferences[i] = difference;
        break;
      }
    }
  });
  return candidates;
}