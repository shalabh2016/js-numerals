'use strict';
const $ = require('jquery');

function process(num) {
  var numString = num.toString(),
    units, tens, scales,
    group, groups = [], groupLength = 0,
    word, words = [], ints = [],
    start = 0, end = 0,
    switchToFour = false;

  /* If the number is zero, simple return Zero. */
  if (num == 0) {
    return 'Zero';
  }

  /* Units */
  units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];

  /* Tens */
  tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  /* Scales, if scale is larger than trillion then we can simply add here. */
  scales = ['', 'thousand', 'million', 'billion', 'trillion'];

  /**
  * Grouping number in groups of 3. e.g. 000,000,000 and
  * as given in problem statement 1999 = ninteen hundredd ninty nine but
  * 2001 is two thousand and one therefore this 'switchToFour' is designed to detect the numbers.
  */
  start = numString.length;

  /* Separating 1999 to 2001 type numbers. */
  if (numString.length === 4
    && (parseFloat(numString[1]) > 0
      && (parseFloat(numString[1]) > 0
        && parseFloat(numString[2]) < 10)
      && parseFloat(numString[2]) < 10)
    && (parseFloat(numString[3]) > 0
      && parseFloat(numString[3]) < 10)) {
    switchToFour = true;
  }

  while (start > 0) {
    end = start;
    if (switchToFour) {
      groups.push(numString.slice((start = Math.max(0, start - 2)), end));
    } else if (!switchToFour) {
      groups.push(numString.slice((start = Math.max(0, start - 3)), end));
    }
  }

  /* If the number is bigger than Trillion then simple return. */
  groupLength = groups.length;
  if (groupLength > scales.length) {
    return 'Sorry we cannot convert with our existing Scale database.';
  }

  for (var i = 0; i < groupLength; i++) {

    group = parseInt(groups[i]);

    if (group) {

      ints = groups[i].split('').reverse().map(parseFloat);

      /* If tens integer is 1, i.e. 10, then add 10 to units integer. */
      if (ints[1] === 1) {
        ints[0] += 10;
      }

      /* Add scale word */

      if ((word = scales[i]) && !switchToFour) {
        words.push(word);
      } else if (switchToFour && i === 1) {
        words.push('hundred');
      }


      /* Add unit word if array item exists */
      if ((word = units[ints[0]])) {
        words.push(word);
      }

      /* Add tens word if array item exists */
      if ((word = tens[ints[1]])) {
        (ints[0] === 0) ? words.push(word) : words.push(`${word} -`);
      }

      /* Add 'and' string after units or tens integer if: */
      if (switchToFour) {
        if (ints[0] && ints[1]) {
          /* Group has a hundreds integer or group is the first of multiple group */
          if (!i && groupLength) {
            words.push('and');
          }
        }
      } else if (!switchToFour) {
        if (ints[0] && numString.length > 2) {
          /* Group has a hundreds integer or group is the first of multiple group */
          if (ints[2] || !i && groupLength) {
            words.push('and');
          }
        }
      }

      /* Add hundreds word if array item exists */
      if ((word = units[ints[2]])) {
        words.push(word + ' hundred');
      }

    }
  }
  return words.reverse().join(' ');
}

function numberToWord() {
  var num = $('#number').val();
  var result = process(num);
  $('#toWord').text(process(num));
}

function constructBody(input) {
  document.body.innerHTML =
    `<div>
        <input id="number" type="number" name="number" value="${input}"/>
        <button id="calculate" />
        <p id="toWord"></p>
      </div>`;
}


describe("Print output of input", () => {
  test("it should print to toWord", () => {

    var input = "7";
    var output = "seven";
    constructBody(input);
    $('#calculate').click();
    numberToWord();
    expect($('#toWord').text()).toEqual(output);

    input = "42";
    output = "forty - two";
    constructBody(input);
    $('#calculate').click();
    numberToWord();
    expect($('#toWord').text()).toEqual(output);

    input = "2001";
    output = "two thousand and one";
    constructBody(input);
    $('#calculate').click();
    numberToWord();
    expect($('#toWord').text()).toEqual(output);

    input = "1999";
    output = "nineteen hundred and ninety - nine";
    constructBody(input);
    $('#calculate').click();
    numberToWord();
    expect($('#toWord').text()).toEqual(output);

    input = "17999";
    output = "seventeen thousand nine hundred and ninety - nine";
    constructBody(input);
    $('#calculate').click();
    numberToWord();
    expect($('#toWord').text()).toEqual(output);

  });
});