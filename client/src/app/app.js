(function (document, window, $) {
    var $body = $('body');
    var $slyFrame = $('#frame');
    var $scrollBar = $slyFrame.parent().find('.scrollbar');
    var $list = $('ul.slidee', $slyFrame);
    var $listItems = $('li.page', $list);
    var $window = $(window);

    var sly;

    var slyOptions = {
        horizontal: 1,
        itemNav: 'forceCentered',
        smart: 1,
        activateOn: 'click',
        activateMiddle: 1,
        mouseDragging: 1,
        touchDragging: 1,
        releaseSwing: 1,
        startAt: 0,
        scrollBy: 1,
        scrollBar: $scrollBar,
        activatePageOn: 'click',
        speed: 500,
        elasticBounds: 1,
        dragHandle: 1,
        dynamicHandle: 1,
        clickBar: 1,
        keyboardNavBy: 'items'
    };

    var pageOptions = [
        {bg: '#3498db', body: '#fff', hash: ''},
        {bg: '#FF4445', body: '#fff', hash: 'works'},
        {bg: '#27ae60', body: '#fff', hash: 'tools'},
        {bg: '#FF573B', body: '#fff', hash: 'hobbies'},
        {bg: '#D6B444', body: '#fff', hash: 'contact'}
    ];

    var getCurrentPageIndex = function () {
        var hash = window.location.hash;
        hash = hash.length > 1 ? hash.substr(1) : null;

        for (var i = 0; i < pageOptions.length; ++i) {
            if (pageOptions[i].hash === hash) { return i; }
        }
        return 0;
    };

    var setItemSize = function () {
        var itemWidth = Math.min(1200, $window.width());
        $list.css('width', itemWidth * $listItems.length);
        $listItems.css('width', itemWidth);
    };

    var goToCurrentPage = function (immediate) {
        var pageIndex = getCurrentPageIndex();
        sly.activate(pageIndex, immediate);
        if (sly.rel.activeItem === pageIndex) { onActiveItemChanged('active', pageIndex); }
    };

    var onActiveItemChanged = function (eventName, pageIndex) {
        var options = pageOptions[pageIndex];
        $body.css('background', options.bg);
        $body.css('color', options.body + ' !important');
        window.location.hash = options.hash;
    };

    var timeout;
    var onResize = function () {
        if (timeout) { window.clearTimeout(timeout); }

        timeout = window.setTimeout(function () {
            setItemSize();
            sly.reload();
        }, 100);
    };

    var onHashChanged = function () {
        goToCurrentPage();
    };

    var init = function() {
        setItemSize();
        sly = new Sly($slyFrame, slyOptions).init();
        sly.on('active', onActiveItemChanged);

        goToCurrentPage(true);
        $window.on('hashchange', onHashChanged);

        $body.addClass(("ontouchstart" in document.documentElement) ? ' touch' : ' no-touch');
    };

    $window.resize(onResize);
    $(document).ready(init);
})(document, window, $);