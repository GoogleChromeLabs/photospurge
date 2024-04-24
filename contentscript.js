/* Copyright 2023 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*      http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License. */


let INTERVAL_GLOBAL;
let CANCEL_GLOBAL = false

const deletebutton = `<div role="button" id="deleteall" data-target="modal1" class="modal-trigger U26fgb c7fp5b FS4hgd dal1Fd m6aMje">
<span type="button">${chrome.i18n.getMessage("deleteall")}</span>
</div>`
const menuSection = `<div id="deletion">${deletebutton}</div>`
const cancelbutton = `<div role="button" id="cancel" class="U26fgb c7fp5b FS4hgd dal1Fd m6aMje">
<span type="button">${chrome.i18n.getMessage("cancel")}</span>
</div>`
const modal = `
<div id="modal1" class="modal">
  <div class="modal-content">
    <h4>${chrome.i18n.getMessage("deleteallphotos")}</h4>
    ${chrome.i18n.getMessage("deletemodalmessage")}
  </div>
  <div class="modal-footer">
    <a href="#!" id="confirmdelete" class="modal-close waves-effect waves-green btn-flat">${chrome.i18n.getMessage("agree")}</a>
  </div>
</div>`

/**
 * On DOM loading inject the CSS and add buttons.
 */
document.addEventListener('DOMContentLoaded', function () {
  addButtons()
  chrome.runtime.sendMessage({ type: "addcss" });
});

/**
 * Add buttons and modals as part of the initialization.
 */
function addButtons() {
  document.querySelector('.J3TAe').insertAdjacentHTML("afterbegin", menuSection);
  document.querySelector('body').insertAdjacentHTML("beforeend", modal);
  const elems = document.querySelectorAll('.modal');
  M.Modal.init(elems);
  document.querySelector('#confirmdelete').addEventListener("click", function (e) {
    deleteAll();
    document.querySelector('#deleteall').remove();
    document.querySelector('#deletion').insertAdjacentHTML("afterbegin", cancelbutton);
    document.querySelector('#cancel').addEventListener("click", resetDeleteButton)
  })

}

/**
 * Set the variable blocker for cancellation to true.
 * Clear the interval trigger to lazy load more photos.
 * Reset the delete all button.
 */
function resetDeleteButton() {
  CANCEL_GLOBAL = true;
  clearInterval(INTERVAL_GLOBAL);
  document.querySelector('#cancel').remove();
  document.querySelector('#deletion').insertAdjacentHTML("afterbegin", deletebutton);
}

/**
 * Initialize the deletion process. Initialize escape cancelation and reset cancel
 * variable blocker.
 */
async function deleteAll() {
  CANCEL_GLOBAL = false;
  window.addEventListener("keydown", (evt) => {
    if (evt.code == 'Escape') {
      resetDeleteButton();
    }
  });
  getVisualCheckboxes();
  INTERVAL_GLOBAL = setInterval(getVisualCheckboxes, 6000);
}

/**
 * Select the div with role of checkbox.
 */
async function getVisualCheckboxes() {
  if (CANCEL_GLOBAL) return;
  const checkboxfromclass = document.querySelectorAll('.QcpS9c.ckGgle')
  if (checkboxfromclass.length == 0) {
    resetDeleteButton()
    return
  }
  if (CANCEL_GLOBAL) return;
  checkboxfromclass.forEach(elem => {
    if (CANCEL_GLOBAL) return;
    elem.click()
  })
  if (CANCEL_GLOBAL) return;
  await sleep(1000);
  if (CANCEL_GLOBAL) return;
  const trashElement = document.querySelector('div[data-delete-origin] button');
  if (CANCEL_GLOBAL) return;
  trashElement.click();
  if (CANCEL_GLOBAL) return;
  await sleep(1000);
  if (CANCEL_GLOBAL) return;
  clickTrashConfirm();
  await sleep(1000);
}

/**
 * Check the trash confirmation.
 * @returns
 */
function clickTrashConfirm() {
  if (CANCEL_GLOBAL) return;
  const confirm = document.querySelector('[data-mdc-dialog-action="EBS5u"]');
  if (confirm) {
    if (CANCEL_GLOBAL) return;
    confirm.click()
  }
}

/**
 * Async Sleep function.
 * @param {number} ms Milliseconds to sleep
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
