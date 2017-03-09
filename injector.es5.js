;(function () {
  'use strict';
  var API_URL = 'https://path-to-api';
  var BUTTON_APPEND_DOM_NODE = document.querySelector('#main .d-header .contents .title');
  var COLOR_GREEN = '#3cb054';
  var COLOR_RED = '#d7435b';

  var IS_POPUP_OPEN = false;
  var moneyButtonElement;
  var popupElement;

  function main () {
    createStyleElement();
    appendMoneyButton();
    appendPopup();
    handleInputEvent();
  }

  function createMoneyButton () {
    var button = document.createElement('button');

    button.innerHTML = '$';
    button.classList.add('addr-balance__button');
    button.id = 'addr-balance-root';
    button.addEventListener('click', function () { togglePopup() });

    moneyButtonElement = button;

    return button;
  }

  function appendMoneyButton() {
    var button = createMoneyButton();
    BUTTON_APPEND_DOM_NODE.appendChild(button);
  }

  function createPopup () {
    var popup = document.createElement('div');
    popup.classList.add('addr-balance__popup');
    popup.innerHTML = "\n      <div class=\"addr-balance__popup_body\">\n        <h1 class=\"addr-balance__popup_title\">Balance address check:</h1>\n        <input class=\"addr-balance__popup_input\" type=\"text\" maxlength=\"34\" placeholder=\"Type your peercoin address here...\" autofocus>\n      </div>\n      <div class=\"addr-balance__popup_body--details\">\n        <div class=\"addr-balance__popup_balance\">\n          <h2 class=\"addr-balance__popup_balance_title\">Balance:</h2>\n          <div class=\"addr-balance__popup_balance_value\"><b>2,155,726.09</b> PPC</div>\n        </div>\n        <hr>\n        <div class=\"addr-balance__popup_sent\">\n          <h2 class=\"addr-balance__popup_sent_title\">Sent</h2>\n          <div class=\"addr-balance__popup_sent_value\">819 TX-Inputs / 7,819,426.64 PPC</div>\n        </div>\n        <div class=\"addr-balance__popup_received\">\n          <h2 class=\"addr-balance__popup_received_title\">Received</h2>\n          <div class=\"addr-balance__popup_received_value\">819 TX-Inputs / 7,819,426.64 PPC</div>\n        </div>\n        <hr>\n        <a href=\"#\" class=\"addr-balance__details_link\">View Address Details</a>\n      </div>\n    ";

    popup.addEventListener('click', function (e) {
      e.stopPropagation();
    });

    popupElement = popup;
    
    return popup;
  }

  function appendPopup () {
    var popup = createPopup();
    moneyButtonElement.appendChild(popup);
  }

  function showPopup () {
    popupElement.classList.add('on');
    IS_POPUP_OPEN = true;
  }

  function hidePopup () {
    var input = getAddressInput();

    // Hiding popup
    popupElement.classList.remove('on');

    // Hiding details
    popupElement.querySelector('.addr-balance__popup_body--details').classList.remove('on');

    // Cleaning input
    input.value = '';
    input.disabled = false;

    // Seting popup open flag as false
    IS_POPUP_OPEN = false;
  }

  function togglePopup () {
    if(IS_POPUP_OPEN) {
      hidePopup();
    } else {
      showPopup();
    }
  }

  function getAddressInput () {
    return popupElement.querySelector('input') || false;
  }

  function handleInputEvent () {
    var input = getAddressInput();
    input.addEventListener('input', function () {
      var value = input.value.toUpperCase();
      if(value.length > 0) {
        if(value.charAt(0) !== 'P') {
          inputStatus('error');
        } else {
          inputStatus('success');

          // If address is valid, do the API call
          if(value.length === 34) {
            fetchAddressInfo(value);
          }
        }
      } else {
        inputStatus('success');
      }
    });
  }

  function inputStatus(status) {
    var input = getAddressInput();

    if(status === 'success') {
      input.classList.remove('addr-balance__popup_input--error');
      input.classList.add('addr-balance__popup_input--success');
    } else if (status === 'error') {
      input.classList.remove('addr-balance__popup_input--success');
      input.classList.add('addr-balance__popup_input--error');
    }
  }

  function fetchAddressInfo (address) {
    var input = getAddressInput();
    input.disabled = true;

    // Set external details link to current address
    popupElement.querySelector('.addr-balance__details_link').href = "https://peercoin.mintr.org/address/" + (input.value);

    // Simulating API call and showing "address results"
    setTimeout(function (){
      popupElement.querySelector('.addr-balance__popup_body--details').classList.add('on');
    }, 500);

    return address;
  }



  function createStyleElement () {
    var style = document.createElement('style');
    style.innerHTML = "\n    #addr-balance-root {}\n    #addr-balance-root hr {\n      height: 0;\n      border: none;\n      border-bottom: 1px solid #1b1b1b;\n      opacity: 0.1;\n      margin: 10px 0;\n    }\n    .addr-balance__button {\n      position: relative;\n      float: right;\n      margin-top: 8px;\n      margin-left: 7px;\n      margin-right: 7px;\n      outline: none;\n      border-radius: 50%;\n      width: 25px;\n      height: 25px;\n      text-align: center;\n      background: rgba(255,255,255,0.2);\n      line-height: 22px;\n      border: none;\n      color: #fff;\n\n    }\n    .addr-balance__popup {\n      top: 100%;\n      left: 0;\n      margin-top: 8px;\n      width: 290px;\n      background: #fff;\n      border-radius: 5px;\n      box-shadow: 0 5px 30px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.05);\n      z-index: 10;\n      position: absolute;\n      text-align: left;\n      opacity: 0;\n      transform: translate3d(0, -20px, 0) scale(0.9);\n      transform-origin: bottom left;\n      transition: all 0.2s ease-in-out;\n      pointer-events: none;\n    }\n    .addr-balance__popup.on {\n      pointer-events: auto;\n      opacity: 1;\n      transform: translate3d(0, 0, 0) scale(1);\n    }\n    .addr-balance__popup:before {\n      content: '';\n      position: absolute;\n      top: -5px;\n      left: 8px;\n      width: 0; \n      height: 0; \n      border-left: 5px solid transparent;\n      border-right: 5px solid transparent;\n      border-bottom: 5px solid white;\n    }\n    .addr-balance__popup_body {\n      padding: 15px;\n    }\n    .addr-balance__popup_body--details {\n      padding: 0 15px;\n      background: #f2f2f2;\n      border-radius: 0 0 5px 5px;\n      overflow: hidden;\n      height: 0;\n    }\n    .addr-balance__popup_body--details.on {\n      height: auto;\n    }\n    #addr-balance-root .addr-balance__popup_title {\n      color: " + COLOR_GREEN + ";\n      font-size: 14px;\n      margin: 0 0 5px 0;\n      font-weight: normal;\n    }\n    #addr-balance-root .addr-balance__popup_input {\n      width: 100%;\n      margin: 0;\n      background: none;\n      font-size: 14px;\n      padding: 5px 0;\n      border: none;\n      border-bottom: 1px solid " + COLOR_GREEN + ";\n      border-radius: 0;\n      box-shadow: none;\n    }\n    #addr-balance-root .addr-balance__popup_input:focus {\n      box-shadow: 0 -1px 0 " + COLOR_GREEN + " inset;\n    }\n    #addr-balance-root .addr-balance__popup_input.addr-balance__popup_input--error {\n      border-bottom: 1px solid " + COLOR_RED + ";\n    }\n    #addr-balance-root .addr-balance__popup_input.addr-balance__popup_input--error:focus {\n      box-shadow: 0 -1px 0 " + COLOR_RED + " inset;\n    }\n    .addr-balance__popup_balance {\n      padding: 10px 0;\n    }\n    .addr-balance__popup_balance_title {\n      color: " + COLOR_GREEN + ";\n      font-size: 14px;\n      margin: 0 0 5px 0;\n      font-weight: normal;\n    }\n    .addr-balance__popup_balance_value {\n      color: " + COLOR_GREEN + ";\n      font-size: 20px;\n      font-weight: 300;\n    }\n    .addr-balance__popup_balance_value b {\n      font-weight: bold;\n    }\n    .addr-balance__popup_sent {\n      margin-bottom: 10px;\n    }\n    .addr-balance__popup_sent_title {\n      color: " + COLOR_RED + ";\n      font-size: 13px;\n      margin: 0;\n      font-weight: normal;\n    }\n    .addr-balance__popup_sent_value {\n      color: " + COLOR_RED + ";\n      font-size: 13px;\n      font-weight: bold;\n    }\n    .addr-balance__popup_received_title {\n      color: " + COLOR_GREEN + ";\n      font-size: 13px;\n      margin: 0;\n      font-weight: normal;\n    }\n    .addr-balance__popup_received_value {\n      color: " + COLOR_GREEN + ";\n      font-size: 13px;\n      font-weight: bold;\n    }\n    #addr-balance-root .addr-balance__details_link {\n      display: block;\n      border-radius: 3px;\n      font-size: 13px;\n      text-align: center;\n      padding: 10px;\n      color: #fff;\n      background: " + COLOR_GREEN + ";\n      margin-bottom: 15px;\n    }\n\n    @media screen and (max-width: 550px) {\n      .addr-balance__popup {\n        position: fixed;\n        top: 50px;\n        left: 1%;\n        width: 98%;\n      }\n      .addr-balance__popup:before {\n        right: 50%;\n        margin-right: -2px;\n      }\n    }\n    ";

    document.body.appendChild(style);
  }

  return main();
})();
