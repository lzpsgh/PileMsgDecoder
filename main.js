// Copyright (c) 2010 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var contexts = ["page","selection","link","editable","image","video","audio"];
var context = contexts[1];
var isCopyClipboard = true;
var xmlhttp = new XMLHttpRequest();

var title = "Gizwits"
var id1 = chrome.contextMenus.create({"title":title,"contexts":[context],"onclick":onClickEvent});

myurl = get_options();

function onClickEvent(info, tab){
 // 使用window.getSelection().toString()无法获取选中文本,只能改用自带的方法
 var fullText = info.selectionText.toString();
 //非string判断
 if(typeof fullText != "string"){
     console.log("wtf");
 }
 //类型判断
 var fLen = fullText.length;
 if( (fullText.substring(0,2)=="68") && (fullText.substring(fLen-2,fLen)=="16")  ){
     console.log('桩上送报文');
     decode(fullText);
 } else if(fLen < 30){
     console.log("桩运行编码");
     tran2Mac(fullText);
 } else{
     alert("解析异常，该文本非68开头且长度大于30");
 }
}

function tran2Mac(pileID){
  //alert("这个功能我们很快就上了！！！");
  get_options();
}

function decode(pileMsg){
  xmlhttp.onreadystatechange = callHandle;
  xmlhttp.open("POST", myurl, true);
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
        //var fmResp = JSON.stringify(resp, null, 2);
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

function get_options(){
  //var syncRequestURL = "https://lzpsgh.github.io/";
  var url;
  chrome.storage.sync.get(['syncrequestURL'], function(result) {
    if (!chrome.runtime.error) {
      console.log('URL='+result.syncrequestURL);
      url = result.syncrequestURL.toString();
    }
  });
  return url;
}
