const txtfd_eye_on = `<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.535 11.0314C20.2527 9.21757 16.7559 5 12.0001 5C7.24426 5 3.75156 9.21757 2.46429 11.0322C2.16215 11.4615 2 11.9737 2 12.4986C2 13.0236 2.16215 13.5357 2.46429 13.965V13.965C3.75156 15.7797 7.24426 19.9973 12.0001 19.9973C16.7559 19.9973 20.2527 15.7797 21.5358 13.965C21.838 13.5356 22.0001 13.0232 22 12.4981C21.9999 11.973 21.8374 11.4607 21.535 11.0314V11.0314ZM12.0001 16.6646C11.1761 16.6646 10.3707 16.4202 9.6856 15.9625C9.00052 15.5047 8.46657 14.8541 8.15126 14.0929C7.83595 13.3316 7.75345 12.494 7.9142 11.6859C8.07494 10.8778 8.4717 10.1355 9.05432 9.5529C9.63693 8.97028 10.3792 8.57352 11.1873 8.41278C11.9954 8.25203 12.8331 8.33453 13.5943 8.64984C14.3555 8.96515 15.0061 9.4991 15.4639 10.1842C15.9216 10.8693 16.166 11.6747 16.166 12.4986C16.166 13.6035 15.7271 14.6631 14.9458 15.4444C14.1645 16.2256 13.1049 16.6646 12.0001 16.6646V16.6646Z" fill="#00204D" fill-opacity="0.6" style="mix-blend-mode:multiply"/></svg>`;
const txtfd_eye_off = `<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.535 10.5207C20.9132 9.64509 20.2186 8.82344 19.4587 8.0645L16.1085 11.4147C16.1408 11.6043 16.16 11.7958 16.166 11.988C16.166 13.0928 15.7271 14.1524 14.9458 14.9337C14.1645 15.715 13.1049 16.1539 12.0001 16.1539C11.8079 16.1479 11.6164 16.1287 11.4268 16.0964L8.71316 18.81C9.7535 19.25 10.8705 19.4799 12.0001 19.4866C16.7559 19.4866 20.2527 15.269 21.5358 13.4544C21.838 13.0249 22.0002 12.5125 22 11.9874C21.9999 11.4623 21.8374 10.95 21.535 10.5207Z" fill="#00204D" fill-opacity="0.6" style="mix-blend-mode:multiply"/><path d="M12.0001 4.48931C7.24426 4.48931 3.75156 8.70688 2.46429 10.5216C2.16215 10.9508 2 11.463 2 11.988C2 12.5129 2.16215 13.0251 2.46429 13.4544C3.56373 15.0216 4.90982 16.4003 6.45023 17.5369L9.0531 14.9341C8.6662 14.5472 8.35929 14.088 8.14989 13.5825C7.94048 13.0771 7.83268 12.5354 7.83264 11.9882C7.83257 10.8833 8.27143 9.8236 9.05268 9.04223C9.83393 8.26087 10.8936 7.82186 11.9985 7.82178C13.1035 7.82171 14.1632 8.26057 14.9445 9.04182L9.0531 14.9341L17.5524 6.43562C15.952 5.21981 14.0093 4.53883 12.0001 4.48931Z" fill="#00204D" fill-opacity="0.6" style="mix-blend-mode:multiply"/><path d="M2.83505 21.9861C2.67029 21.9861 2.50924 21.9372 2.37226 21.8457C2.23527 21.7541 2.12851 21.624 2.06546 21.4718C2.00242 21.3196 1.98592 21.1521 2.01805 20.9905C2.05018 20.8289 2.12951 20.6804 2.24599 20.5639L20.576 2.23388C20.7331 2.08211 20.9436 1.99813 21.1621 2.00003C21.3805 2.00193 21.5895 2.08955 21.744 2.24403C21.8985 2.39851 21.9861 2.60748 21.988 2.82594C21.9899 3.0444 21.9059 3.25486 21.7541 3.412L3.42411 21.742C3.2679 21.8983 3.05601 21.9861 2.83505 21.9861Z" fill="#00204D" fill-opacity="0.6" style="mix-blend-mode:multiply"/></svg>`;

function createTextFormFieldHTML(item, data) {
  item.value = document.createElement("div");
    $(item.value).addClass("textformfield");
  item.value.replaceChildren(...data.map(child => {
    if (child.CateID === EnumCate.textfield) createTextFieldHTML(child, item);
    child.value.style.position = "relative";
    if (child.value.style.width == "100%")
      child.value.style.flex = 1;
    return child.value;
  }));
}

function createTextFieldHTML(item, parent) {
  if (!item.value?.id) {
    item.value = document.createElement("div");
    $(item.value).addClass("row");
  }
  let textField = document.createElement("div");
  $(textField).addClass("textfield");
  let children = [];
  let input = document.createElement("input");
  input.id = `textfield-${item.GID}`;
  children.push(input);
  if (parent) {
    if (parent.AttributesItem.NameField !== "")
      input.name = parent.AttributesItem.NameField;
    input.readOnly = parent.JsonItem.ReadOnly;
    input.disabled = !parent.JsonItem.Enabled;
    input.value = parent.AttributesItem.Content ?? "";
    if (parent.JsonItem?.LabelText && parent.JsonItem?.LabelText != "") {
      let label = document.createElement("label");
      label.innerHTML = parent.JsonItem.LabelText;
      label.htmlFor = `textfield-${item.GID}`;
      children.push(label);
      if (input.value.trim() !== "") {
        $(textField).addClass("content");
      }
    } else if (parent.JsonItem?.HintText) {
      input.placeholder = parent.JsonItem.HintText;
    }
    input.onblur = function (e) {
      e.stopPropagation();
      this.value = this.value.trim();
      parent.AttributesItem.Content = this.value;
      $(this.parentElement).removeClass("content");
      if (this.value.trim() !== "") {
        $(this.parentElement).addClass("content");
      } else if ($(this.parentElement).find("label").length > 0) {
        this.placeholder = "";
        $(this.parentElement).find("label").css("color", "inherit");
      } else {
        input.placeholder = parent.JsonItem.HintText;
      }
      if (parent.JsonItem.AutoValidate) {}
    }
    input.onfocus = function (e) {
      e.stopPropagation();
      if ($(this.parentElement).find("label")) {
        let focusColor = "#1890ff";
        if (parent.JsonEventItem) {
          let eventFocus = parent.JsonEventItem.find(evt => evt.Name === "State")?.ListState?.find(state => state.Type === ComponentState.focus);
          if (eventFocus && eventFocus.BorderSkinID && eventFocus.BorderSkinID != "") {
            let borderSkin = BorderDA.list.find(skin => skin.GID === eventFocus.BorderSkinID);
            focusColor = `#${borderSkin.ColorValue.substring(2)}${borderSkin.ColorValue.substring(0, 2)}`;
          }
        }
        $(this.parentElement).find("label").css("color", focusColor);
      }
      if (parent.JsonItem?.HintText) {
        this.placeholder = parent.JsonItem.HintText;
      }
    }
  }
  if(!item.build) item.value.style.pointerEvents = "none";
  textField.replaceChildren(...children);
  item.value.replaceChildren(textField);
  if (parent?.JsonItem?.ObscureText) {
    input.type = "password";
    let isShowPass = false;
    let obscureBtn = document.createElement("div");
    obscureBtn.className = "obscure-btn-txtfd";
    obscureBtn.style.width = parent.StyleItem.TextStyleItem.FontSize + "px";
    if (isShowPass) {
      input.type = "text";
      obscureBtn.innerHTML = txtfd_eye_on.replace('fill="#00204D"', `fill=#${parent.StyleItem.TextStyleItem.ColorValue.substring(2)}`);
    } else {
      input.type = "password";
      obscureBtn.innerHTML = txtfd_eye_off.replace('fill="#00204D"', `fill=#${parent.StyleItem.TextStyleItem.ColorValue.substring(2)}`);
    }
    obscureBtn.onclick = function (e) {
      e.stopPropagation();
      isShowPass = !isShowPass;
      if (isShowPass) {
        input.type = "text";
        this.innerHTML = txtfd_eye_on.replace('fill="#00204D"', `fill=#${parent.StyleItem.TextStyleItem.ColorValue.substring(2)}`);
      } else {
        input.type = "password";
        this.innerHTML = txtfd_eye_off.replace('fill="#00204D"', `fill=#${parent.StyleItem.TextStyleItem.ColorValue.substring(2)}`);
      }
    }
    item.value.appendChild(obscureBtn);
  }
}

