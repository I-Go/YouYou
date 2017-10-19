var Inject = (function () {
    // constants ----------------------------------------------------------------
    var ID = {
        CONTAINER: 'x-container',
        IFRAME_PREFIX: 'x-iframe-'
    };

    // variables ----------------------------------------------------------------
    var _this = {},
        _views = {},
        _container = null;

    // initialize ---------------------------------------------------------------
    _this.init = function () {
        // create the widget container
        _container = $('<div />', {
            id: ID.CONTAINER
        });
        _container.appendTo(document.body);

        // default add the "app" iframes append to main window
        _loadApplicationView('app', _container);

        // listen to the iframes/webpages message
        window.addEventListener("message", dom_onMessage, false);

        // listen to the Control Center (background.js) messages
        chrome.extension.onMessage.addListener(background_onMessage);
    };

    //================================================================================//
    //============================= events processor  ================================//
    //================================================================================//
    // send a message to "background.js"
    function tell(message, data) {
        var data = data || {};

        // send a message to "background.js"
        chrome.extension.sendRequest({
            message: message,
            data: data
        });
    };

    //public message processor 
    function processMessage(request) {
        if (!request.message) return;

        switch (request.message) {
            case 'iframe-loaded':
                message_onIframeLoaded(request.data);
                // $('body').addClass('body-scrollbar');
                break;
            case 'start_application':
                message_onStartApp(request.data);
                break;
            case 'stop_application':
                message_onStopApp();
                break;
        }
    };
    // messages coming from iframes and the current webpage
    function dom_onMessage(event) {
        if (!event.data.message) return;

        // tell another iframe a message
        if (event.data.view) {
            tell(event.data);
        } else {
            processMessage(event.data);
        }
    };

    // messages coming from "background.js"
    function background_onMessage(request, sender, sendResponse) {
        if (request.data.view) return;
        processMessage(request);
    };

    //================================================================================//
    //============================= messages processor================================//
    //================================================================================//
    function message_onIframeLoaded(data) {
        var allLoaded = true;
        for (var i in _views) {
            if (_views[i].isLoaded === false) allLoaded = false;
        }

        // tell "background.js" that all the frames are loaded
        if (allLoaded) tell('iframe-loaded');
    };

    function message_onStartApp(data) {
        _showAppView();
        _collectDataFromCurrentPage(); // collect data from current page
    };

    function message_onStopApp(data) {
        _hideAppView();
    };

    //================================================================================//
    //============================= private functions  ===============================//
    //================================================================================//
    function _collectDataFromCurrentPage() {
        var image = $('#spec-n1 img')[0].src;

        // notify channel:  inject->background->frame
        tell('collect-data', {
            view: '*',
            image: image
        });
    }

    function _loadApplicationView(id) {
        // return the view if it's already created
        if (_views[id]) return _views[id];

        // iframe initial details
        var src = chrome.extension.getURL('html/iframe/' + id + '.html?view=' + id + '&_' + (new Date().getTime())),
            iframe = $('<iframe />', {
                id: ID.IFRAME_PREFIX + id,
                src: src,
                scrolling: false
            });

        // view
        _views[id] = {
            isLoaded: false,
            iframe: iframe
        };

        // add to the container
        _container.append(iframe);

        return _views[id];
    };

    // hide app view
    function _hideAppView() {
        $("#x-container #x-iframe-app").css({
            "width": "55px"
        });
    }

    // show app view
    function _showAppView() {
        $("#x-container #x-iframe-app").css({
            "width": function (index, value) {
                return $(document.body).width();
            }
        });
    }

    return _this;
}());
document.addEventListener("DOMContentLoaded", function () {
    Inject.init();
    console.log((new Date()).getTime() + "---------- current page has Inject init Done");
}, false);