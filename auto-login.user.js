// ==UserScript==
// @name         【bjut.tech】自动登录
// @namespace    https://github.com/bjut-tech/userscripts
// @version      0.2.0
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
  // * VPN - vpn.bjut.edu.cn
  // * 邮箱 - mail.bjut.edu.cn
  // * 日新学堂（校外登录） - bjut1.fanya.chaoxing.com
  // * 教学管理系统 - jwglxt.bjut.edu.cn
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

  function doMail() {
    if (!checkConfig(['email', 'password'])) { return }

    const email = GM_config.get('email')
    const [username, domain] = email.split('@')
    const password = GM_config.get('password')

    // wait a second for the template to load
    setTimeout(() => {
      // set values
      document.getElementById('uid').value = username

      document.getElementsByClassName('domainTxt')[0].innerText = domain
      document.getElementById('domain').value = domain

      document.getElementById('fakePassword').value = password
      document.getElementById('password').value = password

      document.getElementsByTagName('form')[0].submit()
    }, 1000)
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

    // set values
    document.getElementById('yhm').value = sid
    document.getElementById('mm').value = password

    document.getElementById('dl').click()
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

    switch (domain) {
      case 'cas.bjut.edu.cn':
        if (path === 'login') { doCas() }
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

      case 'jfself.bjut.edu.cn':
        if (path === 'nav_login') { doJfself() }
    }
  }

  main()
})();
