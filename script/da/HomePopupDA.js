class HomePopup {
    static seleted_userID;
    // static seleted_permission;

    static create_memberRow(item) {
        let userPemission;
        if ($('#info-container').hasClass("team")) {
            let cus = TeamDA.selected.CustomerTeamItems.find(e => e.CustomerID == userItem.ID);
            if (cus == null) {
                let teamParent = TeamDA.list.find(e => e.ID == TeamDA.selected.ParentID);
                cus = teamParent.CustomerTeamItems.find(el => el.CustomerID == userItem.ID);
            }
            userPemission = cus?.Permission;
        }
        else {
            userPemission = ProjectDA.selected.Permission;
        }
        let member_row =
            `<div data-id=${item.ID} data-permission=${item.Permission} class="member-row row">
                <span class="member-name space regular1 text-body">
                    ${item.CustomerName ?? "Anonymus"}
                    <span class="text-subtitle regular11 ${item.CustomerID == userItem.ID ? "" : "hide"}">(You)</span>
                </span>
                <button class=" ${item.Permission == EnumPermission.owner || item.CustomerID == userItem.ID || item.Permission <= userPemission ? "inactive" : ""} button-change-permission button-transparent row center" type="button">
                    <span class="regular1 text-body">
                        ${item.Permission == EnumPermission.owner ? "owner" : item.Permission == EnumPermission.editer ? "can edit" : "can view"}
                    </span>
                    <span class="center box24 ${item.Permission == EnumPermission.owner ? "hide" : ""}">
                        <i class="fa-solid fa-chevron-down"></i>
                    </span>
                </button>
            </div>`;
        return member_row;
    }

    static create_listMemberRow(list) {
        let list_memberRow = '';
        for (let item of list) {
            list_memberRow += HomePopup.create_memberRow(item);
        }
        return list_memberRow;
    }

    static create_popupInviteMember(list_member) {
        HomePopup.seleted_userID = null;
        let popup =
            `<div class="popup-invite-member col elevation7 popup-action ">
                <div class="popup-header row">
                    <div class="semibold1 space">invite-member</div>
                    <button class="box32 center button-transparent close-popup" style="padding: 0" type="button">
                        <i class="fa-solid fa-close fa-xl" style="pointer-events: none"></i>
                    </button>
                </div>
                <div class="popup-body row border-bottom">
                    <div class="email-and-permisson-container row space">
                        <input class="regular1 text-body email-input" placeholder="Enter email" type="text">
                            <button class="button-select-permisson background-disable button-transparent" type="button">
                                <span class="permission-selected regular11 text-label">Can view</span>
                                <span class="box32 center"><i class="fa-solid fa-chevron-down"></i></span>
                            </button>
                    </div>
                    <button class="button-send-invite background-grey3 button-transparent" type="button">
                        <span class="semibold1 text-white">Send</span>
                    </button>
                </div>
                <div class="popup-footer col">
                    <div class="semibold1 text-title" style="padding: 8px 16px; box-sizing: border-box;">Members</div>
                    <div class="list-member col">${HomePopup.create_listMemberRow(list_member)}</div>
                </div>
            </div>`;
        return popup;
    }


    static create_popupSelectPermisson(permission) {
        let popup =
            `<div class="dropdown-popup popup-select-permission col">
                <div data-id="0" class="${permission != 0 || HomePopup.seleted_userID == null ? "hide" : ""} option-tile regular1 text-white row">Owner</div>
                <div data-id="1" class="${permission == 2 ? "hide" : ""} option-tile regular1 text-white row">Can edit</div>
                <div data-id="2" class="option-tile regular1 text-white row">Can view</div>
                <div data-id="" class="${permission != 0 || HomePopup.seleted_userID == null ? "hide" : ""} option-tile remove regular1 text-white row">Remove</div>
            </div>`;
        return popup;
    }
}