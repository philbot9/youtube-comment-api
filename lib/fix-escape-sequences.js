/*
 * Sometimes Youtube uses '\U' which should be '\u'. So try to replace
 * any invalid escape sequences with their lowercase versions.
 */
module.exports = function (str) {
  var re = /[^\\](\\[^"\/\\bfnrtu])/g;
  return str.replace(re, function (m) {
    if (!re.test(m.toLowerCase())) {
      return m[0] + m.substring(1).toLowerCase();
    } else {
      return m[0] + '';
    }
  });
}
