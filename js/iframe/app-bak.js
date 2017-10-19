var Application = (function () {
    // variables ----------------------------------------------------------------
    var _this = {},
        _iframe = null;

    // initialize ---------------------------------------------------------------
    _this.init = function () {
        _iframe = new IframeManager();
        _iframe.setListener(onMessage);

        $('#app-button').on('click', onAppButtonClick);
        $('#close-button').on('click', onCloseButtonClick);

        $("#keyword").focus();
    };

    // private functions --------------------------------------------------------
    function _saveTopOne(data) {
        console.log(data);
    }

    function _readAndShowTopOneInfoToAppView() {

    }

    // events -------------------------------------------------------------------
    function onMessage(request) {
        console.log((new Date()).getTime() + '---------in app ---------' + request.data);
        switch (request.message) {
            case 'open-application':
                message_onOpenApplication(request.data);
                break;
            case 'send-image-to-ifame':
                console.log((new Date()).getTime() + 'App receive image and send to iframe -- ', request.data);
                break;
        }
    };

    // start application
    function onAppButtonClick(event) {
        // var keyword = $('#keyword').val() || '';
        var data = {
            d: '000'
        };

        _saveTopOne(data);

        $('#app-box').hide();

        // hide iframe and delete app-container
        _iframe.tell('app-button-clicked', {});

        // inject Script to Iframe
        // _iframe.tell('inject-script-to-iframe', {});

    };

    // logout app and close  search view
    function onCloseButtonClick(event) {
        //delete app-container
        _iframe.tell('close-app-view', {});
    };

    // messages -----------------------------------------------------------------
    function message_onOpenApplication(data) {
        $('.page-title').html(data.title);
    };


    // public functions ---------------------------------------------------------

    return _this;
}());

document.addEventListener("DOMContentLoaded", function () {
    new Application.init();
}, false);