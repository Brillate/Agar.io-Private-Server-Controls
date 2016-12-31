// ==UserScript==
// @name         E, R, and T Keys + Custom Skins
// @namespace    http://github.com/theonlymonster
// @version      0.1
// @description  E, R, and T Keys + Custom Skins for Agar.io Private Servers!
// @author       Monster - Agario
// @match        *.agar.io/*
// @grant        none
// ==/UserScript==

setTimeout(function() {
    window.__WebSocket = window.WebSocket;
    window.fakeWebSocket = function() {
        return {
            readyState: 0
        };
    };
    window._WebSocket = window.WebSocket = function(ip) {
        return new window.fakeWebSocket(ip);
    };
    window.key = {
        e: false,
        r: false,
        t: false
    };
    window.addEventListener("load", function() {
        // код инжектинга
        if (!window.OldSocket)
        OldSocket = window.__WebSocket;
        window._WebSocket = window.WebSocket = window.fakeWebSocket = function(ip) {
            var ws = new OldSocket(ip);
            ws.binaryType = "arraybuffer";
            var fakeWS = {};
            for (var i in ws) {
                fakeWS[i] = ws[i];
            }
            fakeWS.send = function() {
                if (arguments[0][0] == 16) {
                    if (window.key.e){
                        arguments[0] = new Int8Array(1);
                        arguments[0][0] = 22;
                    }
                    if (window.key.r){
                        arguments[0] = new Int8Array(1);
                        arguments[0][0] = 23;
                    }
                    if (window.key.t){
                        arguments[0] = new Int8Array(1);
                        arguments[0][0] = 24;
                    }
                window.key.e = window.key.r = window.key.t = false;
                }
            return ws.send.apply(ws, arguments);
            };
            ws.onmessage = function() {
                fakeWS.onmessage && fakeWS.onmessage.apply(ws, arguments);
            };
            ws.onopen = function() {
                fakeWS.readyState = 1;
                fakeWS.onopen.apply(ws, arguments);
            };
            ws.onclose = function(){
                fakeWS.onclose.apply(ws, arguments);
            };
        return fakeWS;
        };
    });
    document.addEventListener('keydown', function(e) {
        var key = e.keyCode || e.which;
        switch (key) {
            case 69:
                window.key.e = true;
                break;
            case 82:
                window.key.r = true;
                break;
            case 84:
                window.key.t = true;
                break;
        }
    });
}, 200);

function setSkin() {
    if (document.getElementById('skin').value.match(/^http(s)?:\/\/(.*?)/)) {
        localStorage.setItem("skin", document.getElementById('skin').value);
    }
    document.getElementsByClassName('circle bordered')[0].src = document.getElementById('skin').value;
    if (document.getElementById("h").checked === true) {
        localStorage.setItem("h", "3");
        document.getElementById('hh').click();
        clearInterval(i);
    } else {
        localStorage.setItem("h", "2");
        document.getElementById('ss').click();
    }
}

function init() {
    if (document.getElementsByClassName('circle bordered')[0] && document.getElementById('skin').value.match(/^http(s)?:\/\/(.*?)/)) {
        document.getElementById('skinLabel').style.display = "none";
        document.getElementById('skinButton').className = "";
        document.getElementsByClassName('circle bordered')[0].style.display = 'block';
        document.getElementsByClassName('circle bordered')[0].src = document.getElementById('skin').value;
    }
}
document.getElementsByClassName('form-group clearfix')[1].innerHTML += '<input placeholder="Paste your image link here" id="skin" class="form-control" style="width:320px" <div id="h2u"><font size="2" color="#FF0000"><center style="margin-top: 6px; margin-bottom: -15px;">You must enter a nickname to see your skin.</center></font> <br><center style="margin-bottom: -5px;"><input type="checkbox" name="h" id="h"> Hide your nickname</center><a href="javascript:window.core.registerSkin(document.getElementById(\'nick\').value, null, document.getElementById(\'skin\').value, 2,null);" id="ss"></a><a href="javascript:window.core.registerSkin(document.getElementById(\'nick\').value, null, document.getElementById(\'skin\').value, 3, null);" id="hh"></div>';

if (localStorage.getItem("h") && localStorage.getItem("h") == 3) {
    document.getElementById("h").checked = true;
}
if (localStorage.getItem("skin") && localStorage.getItem("skin").match(/(http(s?):)|([/|.|\w|\s])*\.(?:jpg|jpeg|gif|png|bmp)/)) {
    document.getElementById('skin').value = localStorage.getItem("skin");
}
if(document.getElementById('statsContinue')){
    document.getElementById('statsContinue').addEventListener("click", function(){i=setInterval(function(){init();},500);}, false);
}
if (document.getElementsByClassName('btn btn-play-guest btn-success btn-needs-server')[0]) {
    document.getElementsByClassName('btn btn-play-guest btn-success btn-needs-server')[0].addEventListener("click", setSkin, false);
}
if (document.getElementsByClassName('btn btn-play btn-primary btn-needs-server')[0]) {
    document.getElementsByClassName('btn btn-play btn-primary btn-needs-server')[0].addEventListener("click", setSkin, false);
}