var App = (function () {
    // variables ----------------------------------------------------------------
    var _this = {};
    var _appData = {};
    var _iframe = null;

    // initialize ---------------------------------------------------------------
    _this.init = function () {
        _iframe = new IframeManager();
        _iframe.setListener(onMessage);

        $('.widget').on('click', widget_onClick);
    };

    // private functions --------------------------------------------------------
    function _openApplication() {
        _iframe.tell('start_application');
        $('#app-box').css('backgroundColor', 'rgba(0, 0, 0, 0.9)');

        $('#widget').addClass('widget-animation');
        $('#app-box').attr("is-open", 'on');
        $('#content-box').css('display', 'block')

    }

    function _closeApplication() {
        _iframe.tell('stop_application');
        $('#app-box').css('backgroundColor', 'rgba(0, 0, 0, 0)');

        $('#widget').removeClass('widget-animation');
        $('#app-box').attr("is-open", 'off');
        // $('#img-box').empty();
        _appData.image = [];
        $('#content-box').hide();
    }

    function _loadCurrentPageData2App() {
        var image = _appData.image; // $('#spec-n1 img')[0].src;

        var img = $('<img />', {
            id: 'product-img',
            src: image
        });
        // $('#img-box').append(img);
    }

    // events -------------------------------------------------------------------
    function onMessage(request) {
        switch (request.message) {
            case 'collect-data':
                _appData = request.data;
                _loadCurrentPageData2App();
                break;
        }
    };

    function widget_onClick(event) {
        var appIsOpen = $('#app-box').attr("is-open") || 'off';
        if (appIsOpen == 'off') {
            _openApplication();
        } else {
            _closeApplication();
        }
    };

    // messages -----------------------------------------------------------------

    // public functions ---------------------------------------------------------

    return _this;
}());

document.addEventListener("DOMContentLoaded", function () {
    new App.init();
}, false);