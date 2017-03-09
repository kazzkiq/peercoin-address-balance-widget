;(function () {
  'use strict';
  const API_URL = 'https://path-to-api';
  const BUTTON_APPEND_DOM_NODE = document.querySelector('#main .d-header .contents .title');
  const COLOR_GREEN = '#3cb054';
  const COLOR_RED = '#d7435b';

  let IS_POPUP_OPEN = false;
  let moneyButtonElement;
  let popupElement;

  function main () {
    createStyleElement();
    appendMoneyButton();
    appendPopup();
    handleInputEvent();
  }

  function createMoneyButton () {
    let button = document.createElement('button');

    button.innerHTML = '$';
    button.classList.add('addr-balance__button');
    button.id = 'addr-balance-root';
    button.addEventListener('click', () => { togglePopup() });

    moneyButtonElement = button;

    return button;
  }

  function appendMoneyButton() {
    let button = createMoneyButton();
    BUTTON_APPEND_DOM_NODE.appendChild(button);
  }

  function createPopup () {
    let popup = document.createElement('div');
    popup.classList.add('addr-balance__popup');
    popup.innerHTML = `
      <div class="addr-balance__popup_body">
        <h1 class="addr-balance__popup_title">Balance address check:</h1>
        <input class="addr-balance__popup_input" type="text" maxlength="34" placeholder="Type your peercoin address here..." autofocus>
      </div>
      <div class="addr-balance__popup_body--details">
        <div class="addr-balance__popup_balance">
          <h2 class="addr-balance__popup_balance_title">Balance:</h2>
          <div class="addr-balance__popup_balance_value"><b>2,155,726.09</b> PPC</div>
        </div>
        <hr>
        <div class="addr-balance__popup_sent">
          <h2 class="addr-balance__popup_sent_title">Sent</h2>
          <div class="addr-balance__popup_sent_value">819 TX-Inputs / 7,819,426.64 PPC</div>
        </div>
        <div class="addr-balance__popup_received">
          <h2 class="addr-balance__popup_received_title">Received</h2>
          <div class="addr-balance__popup_received_value">819 TX-Inputs / 7,819,426.64 PPC</div>
        </div>
        <hr>
        <a href="#" class="addr-balance__details_link">View Address Details</a>
      </div>
    `;

    popup.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    popupElement = popup;
    
    return popup;
  }

  function appendPopup () {
    let popup = createPopup();
    moneyButtonElement.appendChild(popup);
  }

  function showPopup () {
    popupElement.classList.add('on');
    IS_POPUP_OPEN = true;
  }

  function hidePopup () {
    let input = getAddressInput();

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
    let input = getAddressInput();
    input.addEventListener('input', () => {
      let value = input.value.toUpperCase();
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
    let input = getAddressInput();

    if(status === 'success') {
      input.classList.remove('addr-balance__popup_input--error');
      input.classList.add('addr-balance__popup_input--success');
    } else if (status === 'error') {
      input.classList.remove('addr-balance__popup_input--success');
      input.classList.add('addr-balance__popup_input--error');
    }
  }

  function fetchAddressInfo (address) {
    let input = getAddressInput();
    input.disabled = true;

    // Set external details link to current address
    popupElement.querySelector('.addr-balance__details_link').href = `https://peercoin.mintr.org/address/${input.value}`;

    // Simulating API call and showing "address results"
    setTimeout(()=> {
      popupElement.querySelector('.addr-balance__popup_body--details').classList.add('on');
    }, 500);

    return address;
  }



  function createStyleElement () {
    let style = document.createElement('style');
    style.innerHTML = `
    #addr-balance-root {}
    #addr-balance-root hr {
      height: 0;
      border: none;
      border-bottom: 1px solid #1b1b1b;
      opacity: 0.1;
      margin: 10px 0;
    }
    .addr-balance__button {
      position: relative;
      float: right;
      margin-top: 8px;
      margin-left: 7px;
      margin-right: 7px;
      outline: none;
      border-radius: 50%;
      width: 25px;
      height: 25px;
      text-align: center;
      background: rgba(255,255,255,0.2);
      line-height: 22px;
      border: none;
      color: #fff;

    }
    .addr-balance__popup {
      top: 100%;
      left: 0;
      margin-top: 8px;
      width: 290px;
      background: #fff;
      border-radius: 5px;
      box-shadow: 0 5px 30px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.05);
      z-index: 10;
      position: absolute;
      text-align: left;
      opacity: 0;
      transform: translate3d(0, -20px, 0) scale(0.9);
      transform-origin: bottom left;
      transition: all 0.2s ease-in-out;
      pointer-events: none;
    }
    .addr-balance__popup.on {
      pointer-events: auto;
      opacity: 1;
      transform: translate3d(0, 0, 0) scale(1);
    }
    .addr-balance__popup:before {
      content: '';
      position: absolute;
      top: -5px;
      left: 8px;
      width: 0; 
      height: 0; 
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-bottom: 5px solid white;
    }
    .addr-balance__popup_body {
      padding: 15px;
    }
    .addr-balance__popup_body--details {
      padding: 0 15px;
      background: #f2f2f2;
      border-radius: 0 0 5px 5px;
      overflow: hidden;
      height: 0;
    }
    .addr-balance__popup_body--details.on {
      height: auto;
    }
    #addr-balance-root .addr-balance__popup_title {
      color: ${COLOR_GREEN};
      font-size: 14px;
      margin: 0 0 5px 0;
      font-weight: normal;
    }
    #addr-balance-root .addr-balance__popup_input {
      width: 100%;
      margin: 0;
      background: none;
      font-size: 14px;
      padding: 5px 0;
      border: none;
      border-bottom: 1px solid ${COLOR_GREEN};
      border-radius: 0;
      box-shadow: none;
    }
    #addr-balance-root .addr-balance__popup_input:focus {
      box-shadow: 0 -1px 0 ${COLOR_GREEN} inset;
    }
    #addr-balance-root .addr-balance__popup_input.addr-balance__popup_input--error {
      border-bottom: 1px solid ${COLOR_RED};
    }
    #addr-balance-root .addr-balance__popup_input.addr-balance__popup_input--error:focus {
      box-shadow: 0 -1px 0 ${COLOR_RED} inset;
    }
    .addr-balance__popup_balance {
      padding: 10px 0;
    }
    .addr-balance__popup_balance_title {
      color: ${COLOR_GREEN};
      font-size: 14px;
      margin: 0 0 5px 0;
      font-weight: normal;
    }
    .addr-balance__popup_balance_value {
      color: ${COLOR_GREEN};
      font-size: 20px;
      font-weight: 300;
    }
    .addr-balance__popup_balance_value b {
      font-weight: bold;
    }
    .addr-balance__popup_sent {
      margin-bottom: 10px;
    }
    .addr-balance__popup_sent_title {
      color: ${COLOR_RED};
      font-size: 13px;
      margin: 0;
      font-weight: normal;
    }
    .addr-balance__popup_sent_value {
      color: ${COLOR_RED};
      font-size: 13px;
      font-weight: bold;
    }
    .addr-balance__popup_received_title {
      color: ${COLOR_GREEN};
      font-size: 13px;
      margin: 0;
      font-weight: normal;
    }
    .addr-balance__popup_received_value {
      color: ${COLOR_GREEN};
      font-size: 13px;
      font-weight: bold;
    }
    #addr-balance-root .addr-balance__details_link {
      display: block;
      border-radius: 3px;
      font-size: 13px;
      text-align: center;
      padding: 10px;
      color: #fff;
      background: ${COLOR_GREEN};
      margin-bottom: 15px;
    }

    @media screen and (max-width: 550px) {
      .addr-balance__popup {
        position: fixed;
        top: 50px;
        left: 1%;
        width: 98%;
      }
      .addr-balance__popup:before {
        right: 50%;
        margin-right: -2px;
      }
    }
    `;

    document.body.appendChild(style);
  }

  return main();
})();
