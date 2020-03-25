'use strict';
const $ = require('jquery');

const numberToWord = (num) => {
  var num = $('#number').val();
  $('#toWord').text(num);
}


describe("Print output of input", () => {
  test("it should print to toWord", () => {
    const input = "1234";

    const output = "1234";

    document.body.innerHTML =
      `<div>
    <input id="number" type="number" name="number" value="${input}"/>
    <button id="calculate" />
    <p id="toWord"></p>
    </div>`;

    $('#calculate').click();

    numberToWord();

    expect($('#toWord').text()).toEqual(output);

  });
});