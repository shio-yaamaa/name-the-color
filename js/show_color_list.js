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
  let colors = getColorList(rgb, colorArray);
  console.log(colors);
  let container = $('#' + containerId);
  
  colors.forEach(function (color, index) {
    let frame = $(container).children().eq(index);
    let hex = rgb2hex([color['r'], color['g'], color['b']]);
    $(frame).find('.color_list_preview').css('background-color', '#' + hex);
    $(frame).find('.color_list_name').text(color['name']);
    $(frame).find('.color_list_hex').text('#' + hex.toUpperCase());
    
    $(frame).find('.color_list_r').text(color['r']);
    $(frame).find('.color_list_g').text(color['g']);
    $(frame).find('.color_list_b').text(color['b']);
  });
}

function getColorList(rgb, colorArray) {
  let candidates = [null, null, null];
  let candidateDifferences = [-1, -1, -1];
  colorArray.forEach(function (colorInList, colorIndex) {
    let labOfColorInList = rgb2lab([colorInList['r'], colorInList['g'], colorInList['b']]);
    let labOfColor = rgb2lab(rgb);
    let difference = Math.pow(labOfColorInList[0] - labOfColor[0], 2)
      + Math.pow(labOfColorInList[1] - labOfColor[1], 2)
      + Math.pow(labOfColorInList[2] - labOfColor[2], 2);
    for (let i = 0; i < 3; i++) {
      if (candidates[i] == null || difference < candidateDifferences[i]) {
        candidates[i] = colorInList;
        candidateDifferences[i] = difference;
        break;
      }
    }
  });
  return candidates;
}