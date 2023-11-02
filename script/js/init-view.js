import {initComponents, initPositionStyle } from '../components/handleData.js'
import ProjectDA from '../da/ProjectDA.js'
import PageDA from '../da/design-PageDA.js'
import {
  BorderDA,
  CateDA,
  ColorDA,
  EffectDA,
  StyleDA,
  TypoDA
} from '../da/design-skinDA.js'
import {
  EnumCate,
  WBaseDA,
  assets_list,
  selected_list,
  wbase_list
} from '../da/design-wbaseDA.js'
import WiniIO from '../socket/SocketWini.js'
import { setupRightView } from './module-design-view/design-tab.js'

export const divSection = document.getElementById('divSection')

export default async function initData () {
  WiniIO.emitInit()
  console.log('init: ', Date.now())
  console.log('get server: ', Date.now())
  listShowName = []
  action_list = []
  action_index = -1
  divSection.replaceChildren()
  let skinResponse = await $.get(WBaseDA.skin_url + `?pid=${ProjectDA.obj.ID}`)
  let wbaseResponse = await WBaseDA.apiGetInitWbase()
  ColorDA.list = skinResponse.Data.ColorItems
  ColorDA.list.forEach(colorSkin => {
    document.documentElement.style.setProperty(
      `--background-color-${colorSkin.GID}`,
      `#${colorSkin.Value}`
    )
  })
  TypoDA.list = skinResponse.Data.TextStyleItems
  TypoDA.list.forEach(typoSkin => {
    document.documentElement.style.setProperty(
      `--font-style-${typoSkin.GID}`,
      `${typoSkin.FontWeight} ${typoSkin.FontSize}px/${
        typoSkin.Height != undefined ? typoSkin.Height + 'px' : 'normal'
      } ${typoSkin.FontFamily}`
    )
    document.documentElement.style.setProperty(
      `--font-color-${typoSkin.GID}`,
      `#${typoSkin.ColorValue}`
    )
  })
  BorderDA.list = skinResponse.Data.BorderItems
  BorderDA.list.forEach(borderSkin => {
    let listWidth = borderSkin.Width.split(' ')
    document.documentElement.style.setProperty(
      `--border-width-${borderSkin.GID}`,
      `${listWidth[0]}px ${listWidth[1]}px ${listWidth[2]}px ${listWidth[3]}px`
    )
    document.documentElement.style.setProperty(
      `--border-style-${borderSkin.GID}`,
      borderSkin.BorderStyle
    )
    document.documentElement.style.setProperty(
      `--border-color-${borderSkin.GID}`,
      `#${borderSkin.ColorValue}`
    )
  })
  EffectDA.list = skinResponse.Data.EffectItems
  EffectDA.list.forEach(effectSkin => {
    if (effectSkin.Type == ShadowType.layer_blur) {
      document.documentElement.style.setProperty(
        `--effect-blur-${effectSkin.GID}`,
        `blur(${effectSkin.BlurRadius}px)`
      )
    } else {
      document.documentElement.style.setProperty(
        `--effect-shadow-${effectSkin.GID}`,
        `${effectSkin.OffsetX}px ${effectSkin.OffsetY}px ${
          effectSkin.BlurRadius
        }px ${effectSkin.SpreadRadius}px #${effectSkin.ColorValue} ${
          effectSkin.Type == ShadowType.inner ? 'inset' : ''
        }`
      )
    }
  })
  //   PropertyDA.list = skinResponse.Data.WPropertyItems
  CateDA.initCate()
  console.log('get server done: ', Date.now())
  wbase_list = []
  wbase_list = initDOM(wbaseResponse)
  //   parent = divSection
  selected_list = []
//   updateHoverWbase()
  WBaseDA.arrange()
  assets_list = wbase_list.filter(wbaseItem => wbaseItem.IsWini)
  assets_list.push(
    ...wbase_list.filter(wb =>
      assets_list.some(wbComp => wb.ListID.includes(wbComp.GID))
    )
  )
  $.get(WBaseDA.base_item_url, function (baseComponentResponse) {
    base_component_list = baseComponentResponse.Data
    console.log('base component:', base_component_list)
    base_component_list = initDOM(base_component_list)
  })
  console.log('in handle data: ', Date.now())
  let fragment = document.createDocumentFragment()
  for (let item of wbase_list) {
    item.value = null
    let children = []
    if (
      [EnumCate.variant, ...EnumCate.parent_cate].some(ct => ct == item.CateID)
    )
      children = wbase_list.filter(e => e.ParentID === item.GID)
    await initComponents(item, children, false)
    item.value.id = item.GID
    if (item.ParentID === wbase_parentID) {
      initPositionStyle(item)
      fragment.appendChild(item.value)
    }
  }
  divSection.replaceChildren(fragment)
  StyleDA.docStyleSheets.forEach(cssRuleItem => {
    if (cssRuleItem.style.length > 0) {
      divSection.querySelectorAll(cssRuleItem.selectorText).forEach(wbHTML => {
        for (let stProp of cssRuleItem.style) {
          switch (stProp) {
            case 'width':
              switch (cssRuleItem.style[stProp]) {
                case '100%':
                  wbHTML.setAttribute('width-type', 'fill')
                  break
                case 'fit-content':
                  wbHTML.setAttribute('width-type', 'fit')
                  break
                case 'max-content':
                  wbHTML.setAttribute('width-type', 'fit')
                  break
                default:
                  wbHTML.removeAttribute('width-type')
                  break
              }
              break
            case 'height':
              switch (cssRuleItem.style[stProp]) {
                case '100%':
                  wbHTML.setAttribute('height-type', 'fill')
                  break
                case 'fit-content':
                  wbHTML.setAttribute('height-type', 'fit')
                  break
                default:
                  wbHTML.removeAttribute('height-type')
                  break
              }
              break
            case 'left':
              if (cssRuleItem.style[stProp].includes('calc')) {
                wbHTML.setAttribute('constX', Constraints.center)
              } else if (cssRuleItem.style[stProp].includes('%')) {
                wbHTML.setAttribute('constX', Constraints.scale)
              } else if (cssRuleItem.style['right']) {
                wbHTML.setAttribute('constX', Constraints.left_right)
              } else {
                wbHTML.setAttribute('constX', Constraints.left)
              }
              break
            case 'right':
              if (!cssRuleItem.style['left']) {
                wbHTML.setAttribute('constX', Constraints.right)
              }
              break
            case 'top':
              if (cssRuleItem.style[stProp].includes('calc')) {
                wbHTML.setAttribute('constY', Constraints.center)
              } else if (cssRuleItem.style[stProp].includes('%')) {
                wbHTML.setAttribute('constY', Constraints.scale)
              } else if (cssRuleItem.style['bottom']) {
                wbHTML.setAttribute('constY', Constraints.top_bottom)
              } else {
                wbHTML.setAttribute('constY', Constraints.top)
              }
              break
            case 'bottom':
              if (!cssRuleItem.style['top']) {
                wbHTML.setAttribute('constY', Constraints.bottom)
              }
              break
            default:
              break
          }
        }
      })
    }
  })
  console.log('out handle data: ', Date.now())
//   centerViewInitListener()
//   if (PageDA.obj.scale !== undefined) {
//     topx = PageDA.obj.topx
//     leftx = PageDA.obj.leftx
//     scale = PageDA.obj.scale
//     divSection.style.top = topx + 'px'
//     divSection.style.left = leftx + 'px'
//     divSection.style.transform = `scale(${scale}, ${scale})`
//     input_scale_set(scale * 100)
//     positionScrollLeft()
//     positionScrollTop()
//   } else {
//     initScroll(
//       wbase_list
//         .filter(m => m.ParentID === wbase_parentID)
//         .map(m => m.StyleItem)
//     )
//   }
  document.getElementById('body').querySelector('.loading-view').remove()
  setupRightView()
//   setupLeftView()
  document
    .getElementById('btn_select_page')
    .querySelector(':scope > p').innerHTML = PageDA.obj.Name
  console.log('show done: ', Date.now())
  setTimeout(function () {
    toolStateChange(ToolState.move)
  }, 80)
}

function initDOM (list) {
  list.forEach(e => {
    e.value = document.createElement('div')
    e.value.id = e.GID
    if (e.IsWini && !e.CopyID) e.value.setAttribute('iswini', 'true')
  })
  let sortItems = []
  let newList = []
  list.forEach(e => {
    if (e.ParentID === wbase_parentID) {
      e.Level = 1
      e.ListID = wbase_parentID
    } else {
      let parent = list.find(eP => eP.GID === e.ParentID)
      if (parent) {
        sortItems.push(e)
        parent.value.appendChild(e.value)
        e.Sort = parent.ListChildID.indexOf(e.GID)
      } else {
        if (wbase_list.length > 0) {
          parent = document.getElementById(e.ParentID)
          if (parent) {
            e.ListID = parent.getAttribute('listid') + `,${e.ParentID}`
            e.Level = e.ListID.split(',').length
            let m = e.value
            e.ListID.split(',')
              .filter(id => id !== wbase_parentID)
              .reverse()
              .forEach(id => {
                let tmp = document.createElement('div')
                tmp.id = id
                tmp.appendChild(m)
                m = tmp
              })
          }
        }
        if (!parent) {
          e.ParentID = wbase_parentID
          e.Level = 1
          e.ListID = wbase_parentID
        }
      }
    }
    newList.push(e)
  })
  sortItems.forEach(e => {
    e.ListID = [...$(e.value).parents('div')]
      .map(eP => {
        if (eP.getAttribute('iswini') && !e.IsWini) {
          delete e.CopyID
          delete e.ChildID
        }
        return eP.id
      })
      .reverse()
    e.ListID.unshift(wbase_parentID)
    e.Level = e.ListID.length
    e.ListID = e.ListID.join(',')
  })
  return newList
}
