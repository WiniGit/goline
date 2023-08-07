function createTextHTML(item) {
  item.value = document.createElement("div");
  let contentSpan = document.createElement("span");
  contentSpan.innerText = item.AttributesItem.Content ?? "";
  item.value.replaceChildren(contentSpan);
  $(item.value).addClass("w-text");
  if (!item.build) {
    contentSpan.contentEditable = false;
    contentSpan.onfocus = function () {
      item.isEditting = !item.isNew;
      contentSpan.addEventListener("keydown", inputKeyDown);
      contentSpan.addEventListener("keyup", inputKeyUp);
      if (item.inputActions) {
        inputActions = item.inputActions;
        inputActionIndex = item.inputActionIndex;
      }
      if (this.getAttribute("isCtrlZ") === "true") {
        ctrlZText();
      } else {
        var range = document.createRange();
        range.selectNodeContents(this);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        addInputAction();
        inputActions[inputActionIndex].type = "focus";
      }
      if (this.innerHTML == "") {
        item.value.style.minWidth = "1px";
        select_box = null;
      } else {
        item.value.style.minWidth = "0";
        select_box = selectBox(selected_list);
      }
      updateHoverWbase();
      if (window.getComputedStyle(item.value).position == "absolute") {
        let transformX = "0";
        switch (item.StyleItem.TypoStyleItem.TextAlign) {
          case TextAlign.center:
            transformX = "-50%";
            var thisComputeStyle = window.getComputedStyle(item.value);
            item.value.style.left = parseFloat(thisComputeStyle.left.replace("px")) + item.value.offsetWidth / 2 + "px";
            item.value.style.right = null;
            break;
          case TextAlign.right:
            transformX = "-100%";
            var thisComputeStyle = window.getComputedStyle(item.value);
            item.value.style.left = parseFloat(thisComputeStyle.left.replace("px")) + item.value.offsetWidth + "px";
            item.value.style.right = null;
            break;
          default:
            break;
        }
        let transformY = "0";
        switch (item.StyleItem.TypoStyleItem.TextAlignVertical) {
          case TextAlignVertical.center:
            transformY = "-50%";
            var thisComputeStyle = window.getComputedStyle(item.value);
            item.value.style.top = parseFloat(thisComputeStyle.top.replace("px")) + item.value.offsetHeight / 2 + "px";
            item.value.style.bottom = null;
            break;
          case TextAlignVertical.bottom:
            transformY = "-100%";
            var thisComputeStyle = window.getComputedStyle(item.value);
            item.value.style.top = parseFloat(thisComputeStyle.top.replace("px")) + item.value.offsetHeight + "px";
            item.value.style.bottom = null;
            break;
          default:
            break;
        }
        item.value.style.transform = `translate(${transformX},${transformY})`;
      }
    };
    let inputActions = [];
    let inputActionIndex = -1;
    let time = 0;
    function inputKeyDown(e) {
      if (e.key == "z" && (isMac ? e.metaKey : e.ctrlKey)) {
        e.preventDefault();
      } else {
        let timeNow = Date.now();
        if (time != 0 && timeNow - time >= 900) {
          addInputAction();
        }
        time = timeNow;
      }
    }
    function inputKeyUp(e) {
      if (e.key == "z" && (isMac ? e.metaKey : e.ctrlKey)) {
        e.preventDefault();
        ctrlZText();
        select_box = selectBox(selected_list);
        wdraw();
      }
    }
    function addInputAction() {
      let selection = window.getSelection();
      inputActionIndex++;
      inputActions = inputActions.slice(0, inputActionIndex);
      inputActions.push({
        value: contentSpan.innerHTML,
        startOffset: selection.anchorOffset,
        endOffset: selection.focusOffset,
        focusNode: selection.focusNode?.textContent ?? contentSpan,
        type: selection.type,
      });
      if (inputActions.length > 30) {
        inputActions = inputActions.slice(1);
        inputActionIndex = inputActions.length - 1;
      }
      console.log("addCtrlz Text", inputActions);
    }
    function ctrlZText() {
      console.log("ctrlz text", inputActionIndex, inputActions);
      if (inputActions[inputActionIndex + 1]?.type === "focus") {
        ctrlZ();
        WBaseDA.isCtrlZ = true;
        window.getSelection().removeAllRanges();
        contentSpan.blur();
      } else if (inputActionIndex >= 0) {
        let inputAction = inputActions[inputActionIndex];
        console.log("Ctrlz Text", inputAction);
        contentSpan.innerHTML = inputAction.value;
        let selection = window.getSelection();
        let range = document.createRange();
        if (inputAction.type === "focus" || inputActionIndex == 0) {
          range.selectNodeContents(contentSpan);
        } else {
          try {
            let textChild = [...contentSpan.childNodes].find((text) => text.nodeValue == inputAction.focusNode);
            if (textChild) {
              range.setStart(textChild, inputAction.startOffset);
              if (inputAction.type === "Range") range.setEnd(textChild, inputAction.endOffset);
            } else if (inputAction.type === "Range") {
              range.setEnd(contentSpan, inputAction.startOffset);
              range.setEnd(contentSpan, inputAction.endOffset);
            }
          } catch (error) {
            console.log(error);
          }
        }
        if (contentSpan.innerHTML == "") {
          contentSpan.style.minWidth = "1px";
          select_box = null;
        } else {
          contentSpan.style.minWidth = "0";
          select_box = selectBox(selected_list);
        }
        updateHoverWbase();
        selection.removeAllRanges();
        selection.addRange(range);
        inputActionIndex--;
      }
    }
    contentSpan.onblur = function () {
      addInputAction();
      this.removeAttribute("isCtrlZ");
      this.contentEditable = false;
      let selection = window.getSelection();
      selection.removeAllRanges();
      let thisRect = item.value.getBoundingClientRect();
      thisRect = offsetScale(thisRect.x, thisRect.y);
      let parentRect = { x: 0, y: 0 };
      if (item.ParentID != wbase_parentID) {
        parentRect = item.value.parentElement.getBoundingClientRect();
        parentRect = offsetScale(parentRect.x, parentRect.y);
      }
      if (!window.getComputedStyle(item.value.parentElement).display.match(/(flex|table)/g)) {
        _enumObj = EnumObj.attributePosition;
        item.value.style.left = thisRect.x - parentRect.x + "px";
        item.value.style.top = thisRect.y - parentRect.y + "px";
        item.value.style.transform = null;
        updateConstraints(item);
      }
      let this_text = wbase_list.find((e) => e.GID === this.id);
      this_text.AttributesItem.Content = this.innerText;
      if (!WBaseDA.isCtrlZ) {
        action_list[action_index].selected[0] = JSON.parse(JSON.stringify(item));
        action_list[action_index].selected[0].inputActions = inputActions;
        action_list[action_index].selected[0].inputActionIndex = inputActionIndex;
      }
      if (this.innerHTML == "") {
        console.log("delete text");
        WBaseDA.delete([this_text]);
      } else {
        if (item.isNew && this_text.StyleItem.FrameItem.Width != undefined) {
          this_text.StyleItem.FrameItem.Width = item.value.offsetWidth;
          this_text.StyleItem.FrameItem.Height = item.value.offsetHeight;
          this_text.StyleItem.TypoStyleItem.AutoWidth = TextAutoSize.fixedSize;
        }
        let listUpdate = [this_text];
        WBaseDA.edit(listUpdate, EnumObj.attribute, true);
        if (item.ParentID !== wbase_parentID) {
          let parent = wbase_list.find((e) => e.GID === item.ParentID);
          if (item.value.parentElement.localName === "td") {
            listUpdate.push(parent);
          } else if (parent.TreeData) {
            for (const property in parent.TreeData) {
              if (item.AttributesItem.NameField === `${property}`) {
                item.AttributesItem.Content = `${parent.TreeData[property]}`;
                contentSpan.innerText = item.AttributesItem.Content ?? "";
              }
            }
          }
        }
      }
      item.isNew = false;
      item.isEditting = false;
      WBaseDA.isCtrlZ = false;
      contentSpan.removeEventListener("keydown", inputKeyDown);
      contentSpan.removeEventListener("keyup", inputKeyUp);
    };
    contentSpan.oninput = function () {
      if (this.innerHTML == "") {
        item.value.style.minWidth = "1px";
        select_box = null;
      }
    };
  }
}

function calcTextNode(node) {
  let width;
  let height;
  let textNodes = textNodesUnder(node);
  if (textNodes.length > 0) {
    if (node.style.width == "fit-content") {
      width = Math.max(...textNodes.map((textNode) => caclTextSize(textNode.data, `${node.style.fontWeight} ${node.style.fontSize} ${node.style.fontFamily}`).width)) + Math.max(...textNodes.map((textNode) => textNode.data.length)) * parseFloat(node.style.letterSpacing.replace("px"));
    } else {
      width = node.offsetWidth;
    }
    if (node.style.height == "fit-content") {
      var range = document.createRange();
      range.selectNodeContents(textNodes[0]);
      var rects = range.getClientRects();
      if (rects.length > 0) {
        height = rects[0].height * textNodes.length;
      }
    } else {
      height = node.offsetHeight;
    }
  }
  return { width: Math.ceil(width), height: Math.ceil(height) };
}

function textNodesUnder(node) {
  var all = [];
  for (node = node.firstChild; node; node = node.nextSibling) {
    if (node.nodeType == 3) all.push(node);
    else all = all.concat(textNodesUnder(node));
  }
  return all;
}
