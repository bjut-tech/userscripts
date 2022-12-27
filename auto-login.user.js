// ==UserScript==
// @name         【bjut.tech】自动登录
// @namespace    https://github.com/bjut-tech/userscripts
// @version      0.3.1
// @description  自动登录学校部分系统，免去输入用户名密码的繁杂。
// @author       JingBh
// @downloadURL  https://github.com/bjut-tech/userscripts/raw/main/auto-login.user.js
// @supportURL   https://github.com/bjut-tech/userscripts/issues
// @match        *://*.bjut.edu.cn/*
// @match        *://bjut1.fanya.chaoxing.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// ==/UserScript==

(function () {
  'use strict'

  // Supported websites for now:
  // * 统一认证 - cas.bjut.edu.cn
  // * 图书馆资源访问系统 - libziyuan.bjut.edu.cn
  // * VPN - vpn.bjut.edu.cn
  // * 日新学堂（校外登录） - bjut1.fanya.chaoxing.com
  // * 教学管理系统 - jwglxt.bjut.edu.cn
  // * 上网登录 - lgn.bjut.edu.cn
  // * 计费系统自服务 - jfself.bjut.edu.cn

  let checked = false

  GM_config.init({
    id: 'config',
    title: '自动登录设置',
    fields: {
      sid: {
        label: '学号',
        type: 'text',
        title: '将用作用户名'
      },
      email: {
        label: '学校邮箱',
        type: 'email',
        title: '登录邮箱系统时使用'
      },
      password: {
        label: '密码',
        type: 'password'
      }
    },
    events: {
      close() {
        main()
      }
    }
  })

  function checkConfig(fields) {
    for (const field of fields || []) {
      if (!GM_config.get(field)) {
        if (!checked) {
          GM_config.open()
        }

        checked = true
        return false
      }
    }

    return true
  }

  function resolveWebvpnDomain(domain) {
    let result = domain

    // ip proxy
    const ipRegex = /^(\d)-(\d)-(\d)-(\d)(?:-\d{1,5})?\.webvpn\.bjut\.edu\.cn$/
    result = result.replace(ipRegex, '$1.$2.$3.$4')

    // subdomain proxy
    const subdomainRegex = /^([a-zA-Z\d-]{1,}?)(?:-\d{1,5})?\.webvpn\.bjut\.edu\.cn$/
    result = result.replace(subdomainRegex, '$1.bjut.edu.cn')

    return result
  }

  function resolvePath() {
    let path = window.location.pathname.toLowerCase()
    while (path.substring(0, 1) === '/') {
      path = path.substring(1)
    }
    return path
  }

  function resolveFragment() {
    let fragment = window.location.hash.toLowerCase()
    while (fragment.substring(0, 1) === '#') {
      fragment = fragment.substring(1)
    }
    return fragment
  }

  function doCas() {
    if (!checkConfig(['sid', 'password'])) { return }

    const sid = GM_config.get('sid')
    const password = GM_config.get('password')

    // set values
    const iframe = document.getElementById('loginIframe')
    iframe.addEventListener('load', () => {
      const document = iframe.contentDocument

      const sidInput = document.getElementById('unPassword')
      sidInput.value = sid

      const passwordInput = document.getElementById('pwPassword')
      passwordInput.value = password
    })

    if (!unsafeWindow.config.captcha) {
      // no captcha, submit immediately
      unsafeWindow.doLogin(sid, password, 'username_password')
    }
  }

  function doLibziyuan() {
    if (!checkConfig(['sid', 'password'])) { return }

    const sid = GM_config.get('sid')
    const password = GM_config.get('password')

    // wait for the form to load
    window.setTimeout(() => {
      const form = document.getElementById('Calc')

      const sidInput = document.evaluate(
        '//*[@id="Calc"]/div[1]/div[1]/div/div[1]/input',
        document, null, XPathResult.FIRST_ORDERED_NODE_TYPE).singleNodeValue
      sidInput.value = sid

      const passwordInput = document.getElementById('loginPwd')
      passwordInput.value = password

      const agreementInput = document.evaluate(
        '//*[@id="Calc"]/div[3]/span/input[1]',
        document, null, XPathResult.FIRST_ORDERED_NODE_TYPE).singleNodeValue

      if (!agreementInput.checked) {
        document.evaluate(
          '//*[@id="Calc"]/div[3]/span/div[1]',
          document, null, XPathResult.FIRST_ORDERED_NODE_TYPE)
          .singleNodeValue.click()
      }

      window.setTimeout(() => {
        // submit button
        document.evaluate(
          '//*[@id="Calc"]/div[4]/button',
          document, null, XPathResult.FIRST_ORDERED_NODE_TYPE)
          .singleNodeValue.click()
      }, 1000)
    }, 3000)
  }

  function doVpn() {
    if (!checkConfig(['sid', 'password'])) { return }

    const sid = GM_config.get('sid')
    const password = GM_config.get('password')

    // set values
    const form = document.getElementById('loginForm')
    form.uname.value = sid
    form.pwd.value = password

    form.submit()
  }

  function doChaoxing() {
    if (!checkConfig(['sid', 'password'])) { return }

    const sid = GM_config.get('sid')
    const password = GM_config.get('password')

    // set values
    document.getElementById('uname').value = sid
    document.getElementById('password').value = password

    // has captcha, manual submit needed
  }

  function doJw() {
    if (!checkConfig(['sid', 'password'])) { return }

    const sid = GM_config.get('sid')
    const password = GM_config.get('password')

    setTimeout(() => {
      // set values
      document.getElementById('yhm').value = sid
      document.getElementById('mm').value = password

      document.getElementById('dl').click()
    }, 1000)
  }

  function doLgn() {
    if (!checkConfig(['sid', 'password'])) { return }

    const sid = GM_config.get('sid')
    const password = GM_config.get('password')

    // set values
    const form = document.getElementsByTagName('form')[0]
    form['DDDDD'].value = sid
    form.upass.value = password
    form.v46s.value = '0'

    unsafeWindow.mysubmit()
    form.submit()
  }

  function doJfself() {
    if (!checkConfig(['sid', 'password'])) { return }

    const sid = GM_config.get('sid')
    const password = GM_config.get('password')

    // set values
    const form = document.getElementById('loginform')
    form.account.value = sid
    form.password.value = password

    form.submit()
  }

  function main() {
    const domain = resolveWebvpnDomain(window.location.hostname)
    const path = resolvePath()
    const fragment = resolveFragment()

    switch (domain) {
      case 'cas.bjut.edu.cn':
        if (path === 'login') { doCas() }
        break

      case 'libziyuan.bjut.edu.cn':
        if (fragment === '!/login') { doLibziyuan() }
        break

      case 'vpn.bjut.edu.cn':
        if (path.indexOf('login') !== -1) { doVpn() }
        break

      case 'mail.bjut.edu.cn':
        if (path === 'coremail/index.jsp') { doMail() }
        break

      case 'bjut1.fanya.chaoxing.com':
        if (path === 'login') { doChaoxing() }
        break

      case 'jwglxt.bjut.edu.cn':
        if (path.indexOf('login') !== -1) { doJw() }
        break

      case 'lgn.bjut.edu.cn':
      case 'lgn6.bjut.edu.cn':
        if (!path) { doLgn() }
        break

      case 'jfself.bjut.edu.cn':
        if (path === 'nav_login') { doJfself() }
        break
    }
  }

  main()
})();
