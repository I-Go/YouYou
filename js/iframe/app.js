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
        _appData.data = [];
        $('#content-box').hide();
    }

    function _loadProductData2App() {
        // var image = _appData.data.image;
        // var img = $('<img />', {
        //     id: 'product-img',
        //     src: image
        // });
        // $('#img-box').append(img);
        $("#product-img").attr("src", _appData.data.image);
        $('#product-name').val(_appData.data.name);
        $('#product-price').val(_appData.data.price);

        $('#product-cate').cxSelect({
            url: '../../js/resource/product.cate.json',
            selects: ['product-cate1', 'product-cate2', 'product-cate3'], // 数组，请注意顺序
            emptyStyle: 'none'
            // jsonName: 'n',
            // jsonValue: 'v'
        });

    }

    function _loadVideoData2App() {

    }

    // events -------------------------------------------------------------------
    function onMessage(request) {
        switch (request.message) {
            case 'product-data':
                _appData = request.data;
                _loadProductData2App();
                break;
            case 'video-data':
                _appData = request.data;
                _loadVideoData2App();
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