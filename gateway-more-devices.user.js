// ==UserScript==
// @name         【bjut.tech】网关多设备
// @namespace    https://github.com/bjut-tech/userscripts
// @version      0.1.0
// @description  增加网关无感知设备数量
// @author       JingBh
// @downloadURL  https://github.com/bjut-tech/userscripts/raw/main/gateway-more-devices.user.js
// @supportURL   https://github.com/bjut-tech/userscripts/issues
// @match        *://jfself.bjut.edu.cn/nav_unBandMacJsp
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-end
// ==/UserScript==

(function () {
  const container = document.getElementsByClassName('tabcontent')[0]
  const macs = []

  function rearrange() {
    container.innerHTML = ''

    for (let i = 1; i <= macs.length; i++) {
      const div = document.createElement('div')
      div.className = 'row'

      const label = document.createElement('label')
      label.innerText = '无感知MAC地址' + i
      div.appendChild(label)

      const input = document.createElement('input')
      input.type = 'text'
      input.name = 'macs'
      input.id = 'mac' + i
      input.value = macs[i - 1]
      input.maxLength = 12
      input.readOnly = true
      div.appendChild(input)

      const remove = document.createElement('a')
      remove.innerText = '删除'
      remove.style.cursor = 'pointer'
      remove.style.marginLeft = '4px'
      remove.onclick = (e) => {
        const input = e.target.parentElement.getElementsByTagName('input')[0]
        const mac = input.value.trim()
        if (mac) {
          if (confirm('你确定要删除此MAC吗？')) {
            const index = macs.indexOf(mac)
            if (index !== -1) {
              macs.splice(index, 1);
            }
            rearrange()
          }
        } else {
          alert('无感知MAC值为空，无需删除绑定。')
        }
      }
      div.appendChild(remove)

      container.appendChild(div)
    }
  }

  // init: get all macs
  for (const row of container.getElementsByClassName('row')) {
    const input = row.getElementsByTagName('input')[0]
    if (input.value) {
      macs.push(input.value)
    }

    const remove = row.getElementsByTagName('a')[0]
    remove.removeAttribute('onclick')
  }

  rearrange()
})();
