// ==UserScript==
// @name         【bjut.tech】统一认证背景图替换
// @namespace    https://github.com/bjut-tech/userscripts
// @version      0.1.1
// @description  是否觉得统一认证的红色背景图片枯燥乏味？这个脚本帮你把图片替换成校园美景！
// @author       JingBh
// @downloadURL  https://github.com/bjut-tech/userscripts/raw/main/cas-bg-replace.user.js
// @supportURL   https://github.com/bjut-tech/userscripts/issues
// @match        *://cas.bjut.edu.cn/cas/login-normal.html
// @match        *://cas-80.webvpn.bjut.edu.cn/cas/login-normal.html
// @match        *://cas-443.webvpn.bjut.edu.cn/cas/login-normal.html
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-body
// ==/UserScript==

const images = [
  // taken from: https://news.bjut.edu.cn/info/1007/3234.htm
  'https://news.bjut.edu.cn/__local/F/7E/6B/E1AE35E1C260D51779DA958C26B_3685570C_1C0E8.jpg',
  'https://news.bjut.edu.cn/__local/D/B4/E3/21016474211615558998AA3B06E_18540AD0_175AA.jpg',
  'https://news.bjut.edu.cn/__local/3/C7/16/9FD74F024CB0B3671CE3AF3FF9B_D0177233_22394.jpg',
  'https://news.bjut.edu.cn/__local/2/58/7D/CDD0246D76175A950413CC21C28_00FC3EB2_17839.jpg',
  'https://news.bjut.edu.cn/__local/2/11/20/EB22D9997901B5D99CC25945CFE_69C2B07F_2C68D.jpg',
  'https://news.bjut.edu.cn/__local/D/1D/15/BD43E8A4DB1D2CF2CCC94EBC3D5_3BA940DC_20051.jpg',
  'https://news.bjut.edu.cn/__local/A/55/EC/507B38E9214D25FA10FF565F369_C34C65BE_1DE10.jpg',
  'https://news.bjut.edu.cn/__local/2/5D/93/8121B24F4175C1367388F4D8269_289ECA19_EE7C.jpg',
  'https://news.bjut.edu.cn/__local/2/29/05/B1F1EBEF0BFB237F29F87EB84AB_5F2D4DFA_1035B.jpg',
  'https://news.bjut.edu.cn/__local/F/20/58/2E17ABED09CA7444F196CC0C202_392F931E_16ED3.jpg',
  'https://news.bjut.edu.cn/__local/9/5D/16/D7C469237BE360E78F53F94E94D_0527881F_3CC43.jpg',
  'https://news.bjut.edu.cn/__local/C/FA/12/B47B14A0BCB9B1095D268C0CEA8_66C0713F_20A36.jpg',
  'https://news.bjut.edu.cn/__local/A/BF/08/6A0229ABCB9192837734F40994D_BFC5D74C_1F1D0.jpg',
  'https://news.bjut.edu.cn/__local/4/D3/FC/BB885505B3E9D87E60F80E9BA77_299E48CB_130F6.jpg',
  'https://news.bjut.edu.cn/__local/5/0F/D9/7A1F53844E2291CD690F65A8D10_057E81FC_1C78C.jpg',
  'https://news.bjut.edu.cn/__local/F/01/B0/8F786449B4EAB70A59CF44F40C9_24AD8AAD_17C14.jpg',
  'https://news.bjut.edu.cn/__local/B/B3/83/5897E171E3132178D7A1117C517_56336D47_ECCF.jpg',
  'https://news.bjut.edu.cn/__local/7/33/E0/7079B40D76258AA1FF79D949663_9614446C_EF82.jpg',
  'https://news.bjut.edu.cn/__local/3/F9/ED/6F8A671A0D8BBE72DD1B7E4EB6E_63A6B009_1853C.jpg',
  'https://news.bjut.edu.cn/__local/B/6C/79/D13D62CBA1118234F1AA284D175_956F7E63_4C961.jpg',
  'https://news.bjut.edu.cn/__local/9/D8/42/E442E5F6AB0B24E82650935B263_BB571CFC_19E6E.jpg',
  'https://news.bjut.edu.cn/__local/B/4D/26/2D15DE3E654E4289E33E6280B89_128BC6C2_2200A.jpg',
  'https://news.bjut.edu.cn/__local/7/00/29/320B0898B2461CDAFF55010EF18_A33EA031_4B11A.jpg',
  'https://news.bjut.edu.cn/__local/3/FA/C4/A3B0828EE96D55E568DB485CC52_291758B9_1EBE0.jpg',
  'https://news.bjut.edu.cn/__local/A/2C/8B/9BE8E319A8D6D0F55FDAA0E68E7_C1C660EB_120CA.jpg',
  'https://news.bjut.edu.cn/__local/F/47/F3/9F25D1E63A33224C19CF9367D63_56D530B3_E527.jpg',
  'https://news.bjut.edu.cn/__local/2/AA/4E/BFB2BB36D1F0A9AEF50DB4DE6A8_29F3ED26_2A53E.jpg',
  'https://news.bjut.edu.cn/__local/3/E9/E5/FD790BD4A46954E132746172C57_FEA517BC_2B75C.jpg',
  'https://news.bjut.edu.cn/__local/D/8F/E9/5453893CE9A3A4F61203D485A61_37E33731_1A99A.jpg',
  'https://news.bjut.edu.cn/__local/A/F1/B8/88D0189ED4D8CCCCA17A0E77901_2222FCEE_19134.jpg',
  'https://news.bjut.edu.cn/__local/0/1D/2A/A1A900B410D75788E24C39F1572_09A523BF_2905A.jpg',
  'https://news.bjut.edu.cn/__local/A/43/A3/6F5E28AA3A1D9CD25F722006685_EB302EAA_39F32.jpg',
  'https://news.bjut.edu.cn/__local/9/02/B7/D1137E7AC4ADE6657D7616EBD5C_C5047D8E_2E55E.jpg',
  'https://news.bjut.edu.cn/__local/7/C3/8F/5FFC7B5866F17DC3D364E7608AC_AD26D244_16F7C.jpg',
  // taken from: https://news.bjut.edu.cn/info/1007/2932.htm
  'https://news.bjut.edu.cn/__local/C/9F/9F/3362AAF12B3C161B0D8DD810D50_A610EA15_1B60A.jpg',
  'https://news.bjut.edu.cn/__local/E/26/7F/C93D26710AD62ADFB98445B0F46_5EBBBED9_1CC99.jpg',
  'https://news.bjut.edu.cn/__local/C/F9/9E/344BC556EB18315DA24044D2CBC_9E2D5A95_1F345.jpg',
  'https://news.bjut.edu.cn/__local/D/E7/20/55A5F31847501583849FBAB30DA_EE91C161_1DA28.jpg',
  'https://news.bjut.edu.cn/__local/E/C5/B2/329CE5387B51BDED694B6E1551A_7BF2F53E_2907B.jpg',
  'https://news.bjut.edu.cn/__local/B/8A/E0/00C651E7D581A3069DA5F6C3146_3325B494_1F06C.jpg',
  'https://news.bjut.edu.cn/__local/7/28/70/A5AF41E1058A61AD0F32F078F5C_FB097CC0_2386A.jpg',
  'https://news.bjut.edu.cn/__local/0/6F/3C/0F23611461CF87DC57E9EF41190_DFCBB792_22DA2.jpg',
  'https://news.bjut.edu.cn/__local/1/FF/87/D2B59942E2E842CD1F39A56090B_CB81D058_288FE.jpg',
  'https://news.bjut.edu.cn/__local/A/B7/85/0B851EB0406F7628DE756AD38EA_8006825C_297DB.jpg',
  'https://news.bjut.edu.cn/__local/B/4F/9E/29132D950D7A862317CAF5E2262_4F26B6D3_1E021.jpg',
  'https://news.bjut.edu.cn/__local/5/0D/48/FDAB2D4937C54AAE9DAEA0E9303_A2571F86_19DEA.jpg',
  'https://news.bjut.edu.cn/__local/A/6B/B8/B9CC4C8DC985E371F7A871B082B_E9AA1655_213F6.jpg',
  'https://news.bjut.edu.cn/__local/F/26/D2/6F6830551CEF93B2A306DDC894B_5AD6ADD6_1CCF2.jpg',
  'https://news.bjut.edu.cn/__local/2/8B/5A/373011F23E3D0CB0E8A0A727C2D_26A55BE1_16494.jpg',
  'https://news.bjut.edu.cn/__local/9/67/E1/21EB8746299DC0A4C424326EEC9_A57099EC_3F4D7.jpg'
];

(function () {
  'use strict'

  // remove original banner
  document.getElementById('banner').remove()

  const div = document.createElement('div')
  div.className = 'banner auto'
  div.style.zIndex = -1

  const ul = document.createElement('ul')
  const li = document.createElement('li')
  const image = images[Math.floor(Math.random() * images.length)]
  li.style.backgroundImage = `url("${image}")`
  li.style.backgroundSize = 'cover'

  ul.append(li)
  div.append(ul)
  document.body.prepend(div)
})();
