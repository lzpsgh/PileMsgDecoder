// Copyright (c) 2010 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var contexts = ["page","selection","link","editable","image","video","audio"];
var context = contexts[1];
var isCopyClipboard = true;
var xmlhttp = new XMLHttpRequest();
var testPpileMsg1 = "681c3932333430353335373035443746463332141209190e010b00000916";
var testPileMsg2 = "6888373234353134383330333132303838313300000000000000000b0231343437303530333534303332343931000000000000000000000000000000000300000003000000090000000900000000000000000000000c0000000c000000000000000000000000000000000000000000000000000000141209040f2f17141209040f300700003101011116";

var decodePileMsg = "桩报文解码"
var id1 = chrome.contextMenus.create({"title":decodePileMsg,"contexts":[context],"onclick":decodeOnClick});
var showDeviceLog = "查看设备日志"
var id2 = chrome.contextMenus.create({"title":showDeviceLog,"contexts":[context],"onclick":showOnClick});

/*
// Create one test item for each context type.
var contexts = ["page","selection","link","editable","image","video",
                "audio"];
for (var i = 0; i < contexts.length; i++) {
  var context = contexts[i];
  var title = "Test '" + context + "' menu item";
  var id = chrome.contextMenus.create({"title": title, "contexts":[context],
                                       "onclick": genericOnClick});
  console.log("'" + context + "' item:" + id);
}

// Create a parent item and two children.
var parent = chrome.contextMenus.create({"title": "Test parent item"});
var child1 = chrome.contextMenus.create(
  {"title": "Child 1", "parentId": parent, "onclick": genericOnClick});
var child2 = chrome.contextMenus.create(
  {"title": "Child 2", "parentId": parent, "onclick": genericOnClick});
console.log("parent:" + parent + " child1:" + child1 + " child2:" + child2);
*/


function decodeOnClick(info, tab){
  // 使用window.getSelection().toString()无法获取选中文本,只能改用自带的方法
  sendRequest(info.selectionText);
}

function showOnClick(info, tab) {
  // console.log("item " + info.menuItemId + " was clicked");
  // console.log("info: " + JSON.stringify(info));
  // console.log("tab: " + JSON.stringify(tab));
  alert('慢慢开发中');
}


function sendRequest(pileMsg){
  xmlhttp.onreadystatechange = callHandle;
  xmlhttp.open("POST", "http://111.207.235.55/m2m/data/resolve?tdsourcetag=s_pctim_aiomsg", true);
  xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");
  // xmlhttp.setRequestHeader("Host","111.207.235.55");
  // xmlhttp.setRequestHeader("Connection","keep-alive");
  // xmlhttp.setRequestHeader("Content-Length","76");
  xmlhttp.setRequestHeader("Cache-Control","max-age=0");
  // xmlhttp.setRequestHeader("Origin","http://111.207.235.55");
  xmlhttp.setRequestHeader("Upgrade-Insecure-Requests","1");
  // xmlhttp.setRequestHeader("DNT","1");
  xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
  // xmlhttp.setRequestHeader("User-Agent","Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.81 Safari/537.36");
  xmlhttp.setRequestHeader("Accept","text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8");
  // xmlhttp.setRequestHeader("Referer","http://111.207.235.55/m2m/data/resolve?tdsourcetag=s_pctim_aiomsg");
  // xmlhttp.setRequestHeader("Accept-Encoding","gzip, deflate");
  xmlhttp.setRequestHeader("Accept-Language","zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7");
  //xmlhttp.setRequestHeader("Cookie","JSESSIONID=6229BDE9314F0A19D6A6FCB80903FF6E");
  xmlhttp.send("protocol=0&data=" + pileMsg);  
}

function callHandle(){
  if (xmlhttp.readyState==4){
      if(xmlhttp.status == 200){
        var responseText =  xmlhttp.responseText;
        var patt = /\{[\s\S]*?\}/m; //贪婪模式非全局匹配
        var patt2 = /(?<=break-word;\"\>)[\s\S]*?(?=\<\/div\>)/m; //备用，正向反向零宽断言
        var resp = responseText.match(patt);
        if(isCopyClipboard){
          if(window.clipboardData){
            window.clipboardData.setData("Text", resp);
          }
        }
        alert(resp);
      }else{
          alert('StatusCode: '+ xmlhttp.status);
      }
  }
}
