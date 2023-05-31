function createTableHTML(item, data) {
    item.value = createTable(item, data);
}

function createTable(item, listChild) {
    let table = item.value?.id ? item.value : document.createElement("table");
    $(table).addClass("w-table");
    item.JsonItem.TableLayout ??= "auto";
    item.JsonItem.Type ??= TableType.header;
    item.JsonItem.HeaderBackground ??= "00FFFFFF";
    item.JsonItem.FooterBackground ??= "00FFFFFF";
    table.setAttribute("type", item.JsonItem.Type);
    table.style.tableLayout = item.JsonItem.TableLayout;
    let children = [];
    let data = listChild ?? wbase_list.filter(e => item.ListChildID.some(id => id === e.GID));
    for (let tr of item.TableRows) {
        let tableRow = document.createElement("tr");
        tableRow.className = "table-row";
        for (let cell of tr) {
            let tableCell = document.createElement("td");
            tableCell.id = cell.id;
            tableCell.className = "table-cell";
            tableCell.rowSpan = cell.rowspan;
            tableCell.colSpan = cell.colspan;
            if (cell.contentid?.length >= 36) {
                let listContentID = cell.contentid.split(",");
                let cellChildren = [];
                for (let id of listContentID) {
                    let childValue = data.find(e => e.GID === id);
                    if (childValue) {
                        cellChildren.push(childValue.value)
                    }
                }
                cell.contentid = cellChildren.map(e => e.id).join(",");
                tableCell.replaceChildren(...cellChildren);
            }
            tableRow.appendChild(tableCell);
        }
        children.push(tableRow);
    }
    table.style.setProperty("--col-border", `${item.JsonItem.ColBorderWidth ?? 0}px`);
    table.style.setProperty("--row-border", `${item.JsonItem.RowBorderWidth ?? 0}px`);
    table.style.setProperty("--header-bg", `#${item.JsonItem.HeaderBackground.substring(2)}${item.JsonItem.HeaderBackground.substring(0, 2)}`);
    table.style.setProperty("--footer-bg", `#${item.JsonItem.FooterBackground.substring(2)}${item.JsonItem.FooterBackground.substring(0, 2)}`);
    table.replaceChildren(...children);
    return table;
}