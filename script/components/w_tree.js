function createTreeHTML(item, data) {
  item.value = createTree(item, data);
}

function createTree(item, listChild) {
  let tree = document.createElement("div");
  $(tree).addClass("w-tree");
  tree.style.setProperty("--indent-space", `${item.JsonItem.IndentSpace}px`);
  tree.style.setProperty("--tree-level", 0);
  tree.style.setProperty("--action-size", `${item.JsonItem.ActionSize}px`);
  let tileItem = document.createElement("div");
  $(tileItem).addClass("tile-item");
  let actionHide = document.createElement("i");
  item.JsonItem.DefaultHide ??= false;
  $(tree).attr("default-hide", `${item.JsonItem.DefaultHide}`);
  actionHide.className = `fa-solid fa-${item.JsonItem.ActionType}-${item.JsonItem.DefaultHide ? "right" : "down"} btn-tree-action`;
  actionHide.style.color = `#${item.JsonItem.ActionColor?.substring(2)}${item.JsonItem.ActionColor?.substring(0, 2)}`;
  actionHide.onclick = function (e) {
    e.stopPropagation();
    let isHideChildren = !this.className.includes("right");
    if (isHideChildren) {
      this.className = this.className.replace("down", "right");
    } else {
      this.className = this.className.replace("right", "down");
    }
  };
  let childrenValue = document.createElement("div");
  childrenValue.className = "children-value";
  for (const property in item.TreeData) {
    listChild
      .filter((e) => e.AttributesItem.NameField === `${property}`)
      .forEach((e) => {
        let fakeItem = JSON.parse(JSON.stringify(e));
        fakeItem.AttributesItem.Content = `${item.TreeData[property]}`;
        fakeItem.value = e.value;
        updateComponentContent(fakeItem);
      });
  }
  childrenValue.replaceChildren(
    ...listChild.map((child) => {
      child.value.style.zIndex = null;
      if (child.value.style.width == "100%") child.value.style.flex = 1;
      return child.value;
    }),
  );
  tileItem.replaceChildren(actionHide, childrenValue);
  if (item.JsonItem.ActionPosition === "left") {
    actionHide.style.order = 0;
  } else {
    actionHide.style.order = 2;
  }
  tree.replaceChildren(tileItem);
  if (item.TreeData.ChildrenItem.length > 0) {
    let childrenBranch = item.TreeData.ChildrenItem.map((branchItem) => createCloneChildren(tree, branchItem, listChild));
    tree = item.value?.id ? item.value : tree;
    tree.replaceChildren(tileItem, ...childrenBranch);
  } else {
    tree = item.value?.id ? item.value : tree;
    tree.replaceChildren(tileItem);
  }
  if (!item.build) {
    tree.querySelectorAll(".w-tree").forEach((wTree) => {
      wTree.querySelectorAll(".wbaseItem-value").forEach((e) => {
        e.removeAttribute("level");
        e.removeAttribute("listid");
      });
    });
  }
  return tree;
}

function createCloneChildren(masterTree, treeItem, listChild) {
  let cloneBranch = masterTree.cloneNode(true);
  cloneBranch.style.removeProperty("--action-size");
  cloneBranch.style.removeProperty("--indent-space");
  cloneBranch.style.setProperty("--tree-level", treeItem.Level);
  let tileItem = cloneBranch.querySelector(":scope > .tile-item");
  for (const property in treeItem) {
    let listDataTag = tileItem.querySelectorAll(`.wbaseItem-value[name-field="${property}"]`);
    listDataTag.forEach((eHTML) => {
      let fakeItem = JSON.parse(JSON.stringify(listChild.find((e) => e.GID === eHTML.id || e.AttributesItem.NameField === property)));
      fakeItem.AttributesItem.Content = `${treeItem[property]}`;
      fakeItem.value = eHTML;
      updateComponentContent(fakeItem);
    });
  }
  if (treeItem.ChildrenItem.length > 0) {
    let childrenBranch = treeItem.ChildrenItem.map((branchItem) => createCloneChildren(masterTree, branchItem, listChild));
    cloneBranch.replaceChildren(tileItem, ...childrenBranch);
  }
  cloneBranch.id = `treeID:${treeItem.ID}`;
  return cloneBranch;
}

function reloadTree(element) {
  let listTree = $(element).parents(".w-tree");
  if (listTree?.length) {
    listTree = [...listTree];
    let listWbaseTree = wbase_list.filter((e) => listTree.some((wTree) => wTree.id === e.GID));
    for (let wTree of listWbaseTree) {
      createTree(
        wTree,
        wbase_list.filter((e) => e.ParentID === wTree.GID),
      );
    }
  }
}
