function createRadioHTML(wb) {
  wb.value = document.createElement("label")
  wb.value.innerHTML = `<input type="radio" ${
    wb.JsonItem.Checked === 'true' ? 'checked' : ''
  } value="${wb.AttributesItem.Content}"/><span class="checkmark"></span>`
  wb.value.onclick = function (ev) {
    ev.stopImmediatePropagation()
    ev.stopPropagation()
    ev.preventDefault()
  }
}

// input.onchange = function (e) {
  //   e.stopImmediatePropagation();
  //   e.stopPropagation();
  //   wbaseItem.JsonItem.Checked = this.checked;
  //   toggle.style.setProperty("--checked-color", `#${wbaseItem.StyleItem.DecorationItem.ColorValue}`);
  //   toggle.style.setProperty("--unchecked-border", `#${wbaseItem.StyleItem.DecorationItem.BorderItem?.ColorValue}`);
  //   if (this.checked) {
    //     if (this.name && this.name !== "") {
      //       let formParent = document.querySelector(`form:has(.w-radio-btn[id="${wbaseItem.GID}"])`);
      //       if (formParent) {
        //         [...formParent.querySelectorAll(`input[name="${this.name}"]`)]
        //           .filter((radio) => radio.type === "radio" && radio.parentElement.id !== wbaseItem.GID)
        //           .forEach((radio) => {
          //             $(radio).trigger("change");
          //           });
          //       } else {
            //         [...document.getElementsByName(this.name)]
            //           .filter((radio) => radio.type === "radio" && radio.parentElement.id !== wbaseItem.GID)
            //           .forEach((radio) => {
              //             $(radio).trigger("change");
//           });
//       }
//     }
//   }
// };