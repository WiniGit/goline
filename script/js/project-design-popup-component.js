// inport popup to screen
let popup_component =
    '<div id="choose-component-popup" class = "choose-component-popup wini_popup col">' +
    '   <div data-cateid="w-button" class="component-option row regular1">' +
    '       <i class="fa-solid fa-circle"></i>' +
    '       <span class="title">Button</span>' +
    '   </div>' +
    '   <div data-cateid="w-switch" class="component-option row regular1">' +
    '       <i class="fa-solid fa-circle"></i>' +
    '       <span class="title">Switch</span>' +
    '   </div>' +
    '   <div data-cateid="w-checkbox" class="component-option row regular1">' +
    '       <i class="fa-solid fa-circle"></i>' +
    '       <span class="title">Checkbox</span>' +
    '   </div>' +
    '   <div data-cateid="w-button" class="component-option row regular1">' +
    '       <i class="fa-solid fa-circle"></i>' +
    '       <span class="title">Radio button</span>' +
    '   </div>' +
    '   <div data-cateid="w-textformfield" class="component-option row regular1">' +
    '       <i class="fa-solid fa-circle"></i>' +
    '       <span class="title">Textformfield</span>' +
    '   </div>' +
    '   <div data-cateid="w-table" class="component-option row regular1">' +
    '       <i class="fa-solid fa-circle"></i>' +
    '       <span class="title">Table</span>' +
    '   </div>' +
    // '   <div data-cateid="' + `${EnumCate.tree}` + '" class="component-option row regular1">' +
    // '       <i class="fa-solid fa-circle"></i>' +
    // '       <span class="title">Tree</span>' +
    // '   </div>' +
    // '   <div data-cateid="' + `${EnumCate.chart}` + '" class="component-option row regular1">' +
    // '       <i class="fa-solid fa-circle"></i>' +
    // '       <span class="title">Chart</span>' +
    // '   </div>' +
    // '   <div data-cateid="' + `${EnumCate.carousel}` + '" class="component-option row regular1">' +
    // '       <i class="fa-solid fa-circle"></i>' +
    // '       <span class="title">Carousel</span>' +
    // '   </div>' +
    '</div>'
$('body').append(popup_component);

$('body').on('click', '#choose-component-popup .component-option', function (ev) {
    $('#choose-component-popup').css('display', 'none');
    $('#choose-component-popup').attr('cateid', $(this).data('cateid'));

    // ! create baseComponent data on server
    // toolStateChange(ToolState.move);
    // let component = createNewWbase(WbClass.carousel).pop();
    // component.PageID = 0;
    // component.Sort = 9;
    // let text1 = createNewWbase(WbClass.checkbox, [], component.ListID + `,${component.GID}`, 1).pop();
    // text1.Sort = 0;
    // text1.PageID = 0;
    // text1.AttributesItem.NameField = "IsSelect";
    // let text2 = createNewWbase(WbClass.text, [], component.ListID + `,${component.GID}`, 1).pop();
    // text2.Sort = 1;
    // text2.PageID = 0;
    // text2.AttributesItem.Content = "Slide";
    // text2.AttributesItem.NameField = "title";
    // let text3 = createNewWbase(WbClass.text, [], component.ListID + `,${component.GID}`, 1).pop();
    // text3.Sort = 2;
    // text3.PageID = 0;
    // text3.AttributesItem.Content = "Content";
    // let text4 = createNewWbase(WbClass.text, [], component.ListID + `,${component.GID}`, 1).pop();
    // text4.Sort = 3;
    // text4.PageID = 0;
    // text4.AttributesItem.Content = "Content";
    // text4.StyleItem.TextStyleItem.FontSize = 14;
    // component.CountChild = 1;
    // component.ListChildID = [text2.GID];
    // let i = 0;
    // component.TableRows.reduce((a,b) => a.concat(b)).forEach(e => {
    //     e.contentid = component.ListChildID[i];
    //     i++
    // });
    // WBaseDA.add([component, text2], 0);
    // console.log("component: ", [component, text2]);
});