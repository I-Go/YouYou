var Background = (function () {
    // variables ----------------------------------------------------------------
    var _this = {};

    var _requestFilter = {
        urls: ["<all_urls>"]
    };

    var _ua = 'Mozilla/5.0 (iPad; CPU OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1';

    // initialize ---------------------------------------------------------------
    _this.init = function () {

        // receive post messages from "inject.js" and any iframes
        chrome.extension.onRequest.addListener(onPostMessage);

        // manage when a user change tabs
        chrome.tabs.onActivated.addListener(onTabActivated);

        //linstening hotkey press events
        chrome.commands.onCommand.addListener(onHotkeyPressed);

        //Intercept network request
        // chrome.webRequest.onBeforeRequest.addListener(onSendRequest, _requestFilter, ['blocking']);
        // chrome.webRequest.onBeforeSendHeaders.addListener(onSendRequest, _requestFilter, ['blocking', "requestHeaders"]]);

    }

    //================================================================================//
    //============================= private functions  ===============================//
    //================================================================================//
    function _updateCurrentTab() {
        //Notice the current page refresh, reload luck star
        chrome.tabs.getSelected(null, function (tab) {
            // send a message to all the views (with "*" wildcard)
            _this.tell('current-page-refresh', {});
        });
    };

    // process message from inject
    function _processMessageFromInject(request) {
        // process the request
        switch (request.message) {
            case 'iframe-loaded':
                message_iframeLoaded(request.data);
                break;
            case 'product-data':
                console.log((new Date()).getTime() + '--- Background receive image and send to iframe -- ', request.data);
                break;
        }
    };

    // start up Application
    function _startApplication() {
        _this.tell('start_application', {});
    }

    // stop Application
    function _stopApplication() {
        _this.tell('stop_application', {});
    }

    //================================================================================//
    //============================= events processor  ================================//
    //================================================================================//
    function onSendRequest(details) {
        if (details.type == 'image') {
            _this.tell('load-current-page-image', {
                image_url: details.url
            });
            console.log('=========onSendRequest===========' + details.url);
        }

        return {
            cancel: false
        };
    }

    function onPostMessage(request, sender, sendResponse) {
        if (!request.message) return;
        console.log((new Date()).getTime() + '--------------message------------' + request.message);


        // if it has a "view", it resends the message to all the frames in the current tab
        if (request.data.view) {
            console.log((new Date()).getTime() + '--------------request.data.view not empty, send message to all frames------------');
            _this.tell(request.message, request.data);
            return;
        }

        _processMessageFromInject(request);
    };

    function onTabActivated() {
        _updateCurrentTab();
    };

    function onHotkeyPressed(command) {
        switch (command) {
            case 'start_application':
                _startApplication();
                break;
            case 'stop_application':
                _stopApplication();
                break;
            default:
                console.log(command);
                break;
        }

    };

    //================================================================================//
    //============================= messages processor================================//
    //================================================================================//
    function message_iframeLoaded(data) {
        _updateCurrentTab();
    };

    //================================================================================//
    //============================= public functions==================================//
    //================================================================================//
    _this.tell = function (message, data) {
        var data = data || {};

        // find the current tab and send a message to "inject.js" and all the iframes
        chrome.tabs.getSelected(null, function (tab) {
            if (!tab) return;

            chrome.tabs.sendMessage(tab.id, {
                message: message,
                data: data
            });
        });
    };

    return _this;
}());

window.addEventListener("load", function () {
    Background.init();
}, false);