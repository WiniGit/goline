class PopupDA {
    static default = {
        type: "warning",
        title: "Content Title",
        content: "It is a long established fact that a reader will be distracted by the readable content.",
        cancelTitle: "Cancel",
        confirmTitle: "Confirm",
        cancelAction: function () {
            
        },
        confirmAction: function () { 
            
        },
    };

    static get_popupImage(type) {
        switch (type) {
            case "info":
                return 'https://cdn.jsdelivr.net/gh/WiniGit/goline@4d0f8a1/lib/assets/popup-img/info.svg'
            case "error":
                return 'https://cdn.jsdelivr.net/gh/WiniGit/goline@4d0f8a1/lib/assets/popup-img/error.svg'
            case "warning":
                return 'https://cdn.jsdelivr.net/gh/WiniGit/goline@4d0f8a1/lib/assets/popup-img/warning.svg'
            case "success":
                return 'https://cdn.jsdelivr.net/gh/WiniGit/goline@4d0f8a1/lib/assets/popup-img/success.svg'
            default:
                return 'https://cdn.jsdelivr.net/gh/WiniGit/goline@4d0f8a1/lib/assets/popup-img/info.svg'
        }
    }
    static get_popupButtonColor(type) {
        switch (type) {
            case "info":
                return "#366AE2";
            case "error":
                return "#E14337";
            case "warning":
                return "#FC6B03";
            case "success":
                return "#39AC6D";
            default:
                return "#366AE2";
        }
    }

    static create_alertPopup_center(item) {
        let popup = document.createElement("div");
        popup.className = "popup-alert elevation7 col center";

        let popupImg = document.createElement("img");
        popupImg.className = "popup-alert-image box72";
        popupImg.src = PopupDA.get_popupImage(item.type);
        popup.appendChild(popupImg);

        let popupTitle = document.createElement("div");
        popupTitle.className = "popup-alert-title heading-6";
        popupTitle.innerHTML = item.title;
        popup.appendChild(popupTitle);

        let popupContent = document.createElement("div");
        popupContent.className = "popup-alert-content body-3";
        popupContent.style.textAlign = "center";
        popupContent.innerHTML = item.content;
        popup.appendChild(popupContent);

        let popupActionContainer = document.createElement("div");
        popupActionContainer.className = "action-container center row";
        popup.appendChild(popupActionContainer);

        let buttonCancel = document.createElement("button");
        buttonCancel.className = "button-cancel button-transparent row center text-subtitle button-text-3";
        buttonCancel.textContent = item.cancelTitle;
        buttonCancel.onclick = function () {
            item.cancelAction();
            $(popup).remove();
            $('.popup-background').hide();
        }
        popupActionContainer.appendChild(buttonCancel);

        let buttonConfirm = document.createElement("button");
        buttonConfirm.className = "button-confirm button-transparent row center button-text-3";
        buttonConfirm.textContent = item.confirmTitle;
        buttonConfirm.style.backgroundColor = PopupDA.get_popupButtonColor(item.type);

        buttonConfirm.onclick = function () {
            item.confirmAction();
            $(popup).remove();
            $('.popup-background').hide();
        }
        popupActionContainer.appendChild(buttonConfirm);

        return popup;
    }

    static create_alertPopup(item) {
        let popup = document.createElement("div");
        popup.className = "popup-alert elevation7 col ";

        let popupImg = document.createElement("img");
        popupImg.className = "popup-alert-image box72";
        popupImg.src = PopupDA.get_popupImage(item.type);
        popup.appendChild(popupImg);

        let popupTitle = document.createElement("div");
        popupTitle.className = "popup-alert-title heading-6";
        popupTitle.innerHTML = item.title;
        popup.appendChild(popupTitle);

        let popupContent = document.createElement("div");
        popupContent.className = "popup-alert-content body-3";
        popupContent.innerHTML = item.content;
        popup.appendChild(popupContent);

        let popupActionContainer = document.createElement("div");
        popupActionContainer.className = "action-container row";
        popup.appendChild(popupActionContainer);

        let buttonCancel = document.createElement("button");
        buttonCancel.className = "button-cancel button-transparent row center text-subtitle button-text-3";
        buttonCancel.textContent = item.cancelTitle;
        buttonCancel.onclick = function () {
            item.cancelAction;
            $(popup).remove();
            $('.popup-background').hide();
        }
        popupActionContainer.appendChild(buttonCancel);

        let buttonConfirm = document.createElement("button");
        buttonConfirm.className = "button-confirm button-transparent row center button-text-3";
        buttonConfirm.textContent = item.confirmTitle;
        buttonConfirm.style.backgroundColor = PopupDA.get_popupButtonColor(item.type);
        buttonConfirm.onclick = function () {
            item.confirmAction;
            $(popup).remove();
            $('.popup-background').hide();
        }
        popupActionContainer.appendChild(buttonConfirm);

        return popup;
    }
}