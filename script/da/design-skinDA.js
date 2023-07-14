class StyleDA {
    static list = [];
    static urlCtr = "Style/";
    static skinProjectID;
    static mergeSkins = [];
    static objDefault = {
        ID: 0,
        ColorIDs: [],
        TypoIDs: [],
        BorderIDs: [],
        EffectIDs: [],
    };
    static listCate = [];
    static listColor = [];
    static listTypo = [];
    static listBorder = [];
    static listEffect = [];

    static init(projectItem) {
        if (projectItem) {
            StyleDA.skinProjectID = projectItem.ID;
            CateDA.initCate();
        } else {
            let url = StyleDA.urlCtr + 'ListItem';
            WiniIO.emitGet(null, url, EnumObj.style, EnumEvent.init);
        }
    }

    static getSkinsByListId(listId) {
        let url = StyleDA.urlCtr + `ListByListPid?lid=${listId}`;
        WiniIO.emitGet(null, url, EnumObj.style, EnumEvent.get);
    }

    static copySkin(styleCopyItem) {
        let url = StyleDA.urlCtr + 'CopyStyle';
        WiniIO.emitPort(styleCopyItem, url, EnumObj.style, EnumEvent.copy);
    }

    static getListMergeSkin() {
        let url = StyleDA.urlCtr + "ListMergeItem";
        WiniIO.emitGet(null, url, EnumObj.style, EnumEvent.merge);
    }

    static mergeSkin(styleInitItem) {
        if (styleInitItem.ColorItems?.length > 0) {
            let listMergeColorID = styleInitItem.ColorItems.map(skinItem => skinItem.ListID.split(",")).reduce((a, b) => a.concat(b));
            ColorDA.list = ColorDA.list.filter(skinItem => listMergeColorID.every(id => id != skinItem.GID));
            wbase_list.filter(wbaseItem => listMergeColorID.some(id => wbaseItem.StyleItem.DecorationItem?.ColorID == id)).forEach(wbaseItem => {
                let mergeColorSkin = styleInitItem.ColorItems.find(skinItem => skinItem.ListID.includes(wbaseItem.StyleItem.DecorationItem.ColorID));
                wbaseItem.StyleItem.DecorationItem.ColorID = mergeColorSkin.GID;
                wbaseItem.StyleItem.DecorationItem.ColorValue = mergeColorSkin.Value;
                wbaseItem.value.style.backgroundColor = `#${mergeColorSkin.Value.substring(2)}${mergeColorSkin.Value.substring(0, 2)}`;
            });
        }
        if (styleInitItem.TextStyleItems?.length > 0) {
            let listMergeTypoID = styleInitItem.TextStyleItems.map(skinItem => skinItem.ListID.split(",")).reduce((a, b) => a.concat(b));
            TypoDA.list = TypoDA.list.filter(skinItem => listMergeTypoID.every(id => id != skinItem.GID));
            wbase_list.filter(wbaseItem => listMergeTypoID.some(id => wbaseItem.StyleItem.TextStyleID == id)).forEach(wbaseItem => {
                let mergeTypoSkin = styleInitItem.TextStyleItems.find(skinItem => skinItem.ListID.includes(wbaseItem.StyleItem.TextStyleID));
                wbaseItem.StyleItem.TextStyleID = mergeTypoSkin.GID;
                wbaseItem.StyleItem.TextStyleItem = mergeTypoSkin;
                initWbaseStyle(wbaseItem);
            });
        }
        if (styleInitItem.BorderItems?.length > 0) {
            let listMergeBorderID = styleInitItem.BorderItems.map(skinItem => skinItem.ListID.split(",")).reduce((a, b) => a.concat(b));
            BorderDA.list = BorderDA.list.filter(skinItem => listMergeBorderID.every(id => id != skinItem.GID));
            wbase_list.filter(wbaseItem => listMergeBorderID.some(id => wbaseItem.StyleItem.DecorationItem?.BorderID == id)).forEach(wbaseItem => {
                let mergeBorderSkin = styleInitItem.BorderItems.find(skinItem => skinItem.ListID.includes(wbaseItem.StyleItem.DecorationItem.BorderID));
                wbaseItem.StyleItem.DecorationItem.BorderID = mergeBorderSkin.GID;
                wbaseItem.StyleItem.DecorationItem.BorderItem = mergeBorderSkin;
                initWbaseStyle(wbaseItem);
            });
        }
        if (styleInitItem.EffectItems?.length > 0) {
            let listMergeEffectID = styleInitItem.EffectItems.map(skinItem => skinItem.ListID.split(",")).reduce((a, b) => a.concat(b));
            EffectDA.list = EffectDA.list.filter(skinItem => listMergeEffectID.every(id => id != skinItem.GID));
            wbase_list.filter(wbaseItem => listMergeEffectID.some(id => wbaseItem.StyleItem.DecorationItem?.EffectID == id)).forEach(wbaseItem => {
                let mergeEffectSkin = styleInitItem.EffectItems.find(skinItem => skinItem.ListID.includes(wbaseItem.StyleItem.DecorationItem.EffectID));
                wbaseItem.StyleItem.DecorationItem.EffectID = mergeEffectSkin.GID;
                wbaseItem.StyleItem.DecorationItem.EffectItem = mergeEffectSkin;
                initWbaseStyle(wbaseItem);
            });
        }
        let url = StyleDA.urlCtr + "MergeStyle";
        WiniIO.emitPort(styleInitItem, url, EnumObj.style, EnumEvent.merge);
    }

    static convertInitData(json) {
        StyleDA.listColor = json.ColorItems;
        StyleDA.listTypo = json.TextStyleItems;
        StyleDA.listBorder = json.BorderItems;
        StyleDA.listEffect = json.EffectItems;
    }

    static copySkinToProject(json) {
        let newColor = json.ColorItems;
        ColorDA.list.push(...newColor);
        let newTypo = json.TextStyleItems;
        TypoDA.list.push(...newTypo);
        let newEffect = json.EffectItems;
        EffectDA.list.push(...newEffect);
        let newBorder = json.BorderItems;
        BorderDA.list.push(...newBorder);
        if (newColor.length > 0 || newTypo.length > 0 || newEffect.length > 0 || newBorder.length > 0) CateDA.convertData(CateDA.list);
        if (selected_list.length == 0) {
            updateUISelectionSkins();
        }
    }
}

class ColorDA {
    static list = [];
    static listAssets = [];
    static newColor;

    static add(colorItem, cateItem) {
        if (cateItem) {
            CateDA.add(cateItem);
        } else {
            WiniIO.emitColor(colorItem, EnumEvent.add);
        }
    }

    static edit(colorItem) {
        WiniIO.emitColor(colorItem, EnumEvent.edit);
    }

    static unDelete(colorItem) {
        ColorDA.list.push(colorItem);
        WiniIO.emitColor(colorItem, EnumEvent.unDelete);
    }

    static delete(colorItem) {
        document.documentElement.style.removeProperty(`--background-color-${colorItem.GID}`);
        WiniIO.emitColor(colorItem, EnumEvent.delete);
    }
}
class TypoDA {
    static list = [];
    static listAssets = [];
    static newTypo;

    static add(textStyleItem, cateItem) {
        if (cateItem) {
            CateDA.add(cateItem);
        } else {
            WiniIO.emitTypo(textStyleItem, EnumEvent.add);
        }
    }

    static edit(textStyleItem) {
        WiniIO.emitTypo(textStyleItem, EnumEvent.edit);
    }

    static unDelete(textStyleItem) {
        TypoDA.list.push(textStyleItem);
        WiniIO.emitTypo(textStyleItem, EnumEvent.unDelete);
    }

    static delete(textStyleItem) {
        wbase_list.filter(e => e.StyleItem.TextStyleID === textStyleItem.GID).forEach(wb => {
            let defaultTypo = {
                GID: 0,
                FontSize: 14,
                FontWeight: "400",
                CateID: EnumCate.typography,
                IsStyle: false,
                ColorValue: "FF000000",
                LetterSpacing: 0,
                FontFamily: "Roboto",
            };
            wb.StyleItem.TextStyleItem = defaultTypo;
            wb.StyleItem.TextStyleID = 0;
            wb.value.style.fontFamily = defaultTypo.FontFamily;
            wb.value.style.fontSize = `${defaultTypo.FontSize}px`;
            wb.value.style.fontWeight = defaultTypo.FontWeight;
            if (defaultTypo.LetterSpacing)
                wb.value.style.letterSpacing = `${defaultTypo.LetterSpacing}px`;
            wb.value.style.color = `#${defaultTypo.ColorValue.substring(2)}${defaultTypo.ColorValue.substring(0, 2)}`;
            if (defaultTypo.Height != undefined) {
                wb.value.style.lineHeight = `${defaultTypo.Height}px`;
            }
        });
        document.documentElement.style.removeProperty(`--font-style-${textStyleItem.GID}`);
        document.documentElement.style.removeProperty(`--font-color-${textStyleItem.GID}`);
        WiniIO.emitTypo(textStyleItem, EnumEvent.delete);
    }
}
class EffectDA {
    static list = [];
    static listAssets = [];
    static newEffect;

    static add(effectItem, cateItem) {
        if (cateItem) {
            CateDA.add(cateItem);
        } else {
            WiniIO.emitEffect(effectItem, EnumEvent.add);
        }
    }

    static edit(effectItem) {
        WiniIO.emitEffect(effectItem, EnumEvent.edit);
    }

    static unDelete(effectItem) {
        EffectDA.list.push(effectItem);
        WiniIO.emitEffect(effectItem, EnumEvent.unDelete);
    }

    static delete(effectItem) {
        wbase_list.filter(e => e.StyleItem.DecorationItem.EffectID === effectItem.GID).forEach(e => {
            e.StyleItem.DecorationItem.EffectID = null;
            e.StyleItem.DecorationItem.EffectItem = null;
            e.value.style.boxShadow = null;
            e.value.style.filter = null;
        });
        if (effectItem.Type == ShadowType.layer_blur) {
            document.documentElement.style.removeProperty(`--effect-blur-${effectSkin.GID}`);
        } else {
            document.documentElement.style.removeProperty(`--effect-shadow-${effectSkin.GID}`);
        }
        WiniIO.emitEffect(effectItem, EnumEvent.delete);
    }
}
class BorderDA {
    static list = [];
    static listAssets = [];
    static newBorder;

    static add(borderItem, cateItem) {
        if (cateItem) {
            CateDA.add(cateItem);
        } else {
            WiniIO.emitBorder(borderItem, EnumEvent.add);
        }
    }

    static edit(borderItem) {
        WiniIO.emitBorder(borderItem, EnumEvent.edit);
    }

    static unDelete(borderItem) {
        BorderDA.list.push(borderItem);
        WiniIO.emitBorder(borderItem, EnumEvent.unDelete);
    }

    static delete(borderItem) {
        wbase_list.filter(e => e.StyleItem.DecorationItem.BorderID === borderItem.GID).forEach(e => {
            e.StyleItem.DecorationItem.BorderID = null;
            e.StyleItem.DecorationItem.BorderItem = null;
            e.value.style.border = null;
            e.value.style.borderWidth = null;
            e.value.style.borderStyle = null;
            e.value.style.borderColor = null;
        });
        document.documentElement.style.removeProperty(`--border-width-${borderItem.GID}`);
        document.documentElement.style.removeProperty(`--border-style-${borderItem.GID}`);
        document.documentElement.style.removeProperty(`--border-color-${borderItem.GID}`);
        WiniIO.emitBorder(borderItem, EnumEvent.delete);
    }
}
class PropertyDA {
    static list = [];
    static newProperty = {
        GID: null,
        Name: "new property",
        BasePropertyItems: null,
        BaseID: null,
    };

    static add(propertyItem) {
        if (propertyItem) {
            this.list.push(propertyItem);
            assets_list.find(e => e.GID == propertyItem.BaseID).PropertyItems.push(propertyItem);
            WiniIO.emitProperty(propertyItem, EnumEvent.add);
        }
    }

    static edit(propertyItem) {
        if (propertyItem) { WiniIO.emitProperty(propertyItem, EnumEvent.edit); }
    }

    static delete(propertyItem) {
        if (propertyItem) {
            this.list = this.list.filter(e => e.GID != propertyItem.GID);
            let thisComponent = assets_list.find(e => e.GID == propertyItem.BaseID);
            thisComponent.PropertyItems = thisComponent.PropertyItems.filter(e => e.GID != propertyItem.GID);
            WiniIO.emitProperty(propertyItem.GID, EnumEvent.delete);
        }
    }
}

class CateDA {
    static list = [];
    static parentCateID;
    static urlCtr = "WCategory/";
    static list_color_cate = [];
    static list_typo_cate = [];
    static list_border_cate = [];
    static list_effect_cate = [];
    static needInit = false;

    static initCate() {
        let url = this.urlCtr + 'ListItem';
        WiniIO.emitGet(null, url, EnumObj.cate, EnumEvent.init);
    }

    static updateUISkin(enumCate, skinID) {
        if (selected_list.length > 0) {
            updateTableSkinBody(enumCate, skinID);
        } else {
            updateUIDesignView();
        }
    }

    static convertData(jsonData) {
        if (jsonData != null) {
            this.list = jsonData;
            //
            this.list_color_cate = ColorDA.list.filter(e => e.CateID != EnumCate.color).filterAndMap(e => e.CateID);
            this.list_color_cate = this.list.filter((e) => this.list_color_cate.some((id) => {
                if (e.ID == id) {
                    e.ParentID = EnumCate.color;
                    return true;
                }
                return false;
            }));
            //
            this.list_typo_cate = TypoDA.list.filter(e => e.CateID != EnumCate.typography).filterAndMap(e => e.CateID);
            this.list_typo_cate = this.list.filter((e) => this.list_typo_cate.some((id) => {
                if (e.ID == id) {
                    e.ParentID = EnumCate.typography;
                    return true;
                }
                return false;
            }));
            //
            this.list_border_cate = BorderDA.list.filter(e => e.CateID != EnumCate.border).filterAndMap(e => e.CateID);
            this.list_border_cate = this.list.filter((e) => this.list_border_cate.some((id) => {
                if (e.ID == id) {
                    e.ParentID = EnumCate.border;
                    return true;
                }
                return false;
            }));
            //
            this.list_effect_cate = EffectDA.list.filter(e => e.CateID != EnumCate.effect).filterAndMap(e => e.CateID);
            this.list_effect_cate = this.list.filter((e) => this.list_effect_cate.some((id) => {
                if (e.ID == id) {
                    e.ParentID = EnumCate.effect;
                    return true;
                }
                return false;
            }));
        }
    }

    static createSkin(jsonSkin, listName, enumCate) {
        switch (enumCate) {
            case EnumCate.color:
                ColorDA.newColor = jsonSkin;
                if (listName.length <= 1) {
                    if (listName.length == 1 && listName[0].trim() != "") {
                        ColorDA.newColor.Name = listName[0];
                    } else {
                        ColorDA.newColor.Name = `#${ColorDA.newColor.Value}`;
                    }
                    ColorDA.newColor.CateID = EnumCate.color;
                    ColorDA.add(ColorDA.newColor);
                } else {
                    ColorDA.newColor.Name = listName.pop();
                    let nameCate = listName.join(" ");
                    let cateItem = this.list_color_cate.find((e) => e.Name.toLowerCase() == nameCate.toLowerCase());
                    if (cateItem) {
                        ColorDA.newColor.CateID = cateItem.ID;
                        ColorDA.add(ColorDA.newColor);
                    } else {
                        let newCate = {
                            ID: 0,
                            Name: nameCate,
                            ParentID: EnumCate.color,
                        };
                        ColorDA.add(ColorDA.newColor, newCate);
                    }
                }
                break;
            case EnumCate.typography:
                TypoDA.newTypo = jsonSkin;
                if (listName.length <= 1) {
                    if (listName.length == 1 && listName[0].trim() != "") {
                        TypoDA.newTypo.Name = listName[0];
                    } else {
                        TypoDA.newTypo.Name = `${jsonSkin.FontSize}/${jsonSkin.Height ?? "auto"}`;
                    }
                    TypoDA.newTypo.CateID = EnumCate.typography;
                    TypoDA.add(TypoDA.newTypo);
                } else {
                    TypoDA.newTypo.Name = listName.pop();
                    let nameCate = listName.join(" ");
                    let cateItem = this.list_typo_cate.find((e) => e.Name.toLowerCase() == nameCate.toLowerCase());
                    if (cateItem) {
                        TypoDA.newTypo.CateID = cateItem.ID;
                        TypoDA.add(TypoDA.newTypo);
                    } else {
                        let newCate = {
                            ID: 0,
                            Name: nameCate,
                            ParentID: EnumCate.typography,
                        };
                        TypoDA.add(TypoDA.newTypo, newCate);
                    }
                }
                break;
            case EnumCate.border:
                BorderDA.newBorder = jsonSkin;
                if (listName.length <= 1) {
                    if (listName.length == 1 && listName[0].trim() != "") {
                        BorderDA.newBorder.Name = listName[0];
                    } else {
                        BorderDA.newBorder.Name = `#${BorderDA.newBorder.ColorValue} - ${BorderDA.newBorder.BorderStyle}`;
                    }
                    BorderDA.newBorder.CateID = EnumCate.border;
                    BorderDA.add(BorderDA.newBorder);
                } else {
                    BorderDA.newBorder.Name = listName.pop();
                    let nameCate = listName.join(" ");
                    let cateItem = this.list_border_cate.find((e) => e.Name.toLowerCase() == nameCate.toLowerCase());
                    if (cateItem) {
                        BorderDA.newBorder.CateID = cateItem.ID;
                        BorderDA.add(BorderDA.newBorder);
                    } else {
                        let newCate = {
                            ID: 0,
                            Name: nameCate,
                            ParentID: EnumCate.border,
                        };
                        BorderDA.add(BorderDA.newBorder, newCate);
                    }
                }
                break;
            case EnumCate.effect:
                EffectDA.newEffect = jsonSkin;
                if (listName.length <= 1) {
                    if (listName.length == 1 && listName[0].trim() != "") {
                        EffectDA.newEffect.Name = listName[0];
                    } else {
                        EffectDA.newEffect.Name = `#${EffectDA.newEffect.ColorValue}`;
                    }
                    EffectDA.newEffect.CateID = EnumCate.effect;
                    EffectDA.add(EffectDA.newEffect);
                } else {
                    EffectDA.newEffect.Name = listName.pop();
                    let nameCate = listName.join(" ");
                    let cateItem = this.list_effect_cate.find((e) => e.Name.toLowerCase() == nameCate.toLowerCase());
                    if (cateItem) {
                        EffectDA.newEffect.CateID = cateItem.ID;
                        EffectDA.add(EffectDA.newEffect);
                    } else {
                        let newCate = {
                            ID: 0,
                            Name: nameCate,
                            ParentID: EnumCate.effect,
                        };
                        EffectDA.add(EffectDA.newEffect, newCate);
                    }
                }
                break;
            default:
                break;
        }
    }

    static add(cateItem) {
        CateDA.parentCateID = cateItem.ParentID;
        CateDA.list.push(cateItem);
        let url = this.urlCtr + 'Add';
        WiniIO.emitPort(cateItem, url, EnumObj.cate, EnumEvent.add);
    }

    static edit(cateItem) {
        let url = this.urlCtr + 'Edit';
        WiniIO.emitPort(cateItem, url, EnumObj.cate, EnumEvent.edit);
    }

    static delete(cateItem) {
        let url = this.urlCtr + 'Delete';
        WiniIO.emitPort(cateItem, url, EnumObj.project, EnumEvent.delete);
    }
}