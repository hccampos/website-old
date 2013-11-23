(function (document, window, $) {
    var $body = $('body');
    var $slyFrame = $('#frame');
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
        activatePageOn: 'click',
        speed: 1000,
        swingSpeed: 0.05,
        elasticBounds: 1,
        dragHandle: 1,
        dynamicHandle: 1,
        clickBar: 1
    };

    var backgroundColors = [
        {bg: '#3498db', body: '#fff'},
        {bg: '#FF4445', body: '#fff'},
        {bg: '#27ae60', body: '#fff'},
        {bg: '#FF573B', body: '#fff'},
        {bg: '#FFA898', body: '#fff'}
    ];

    var setItemSize = function () {
        var itemWidth = Math.min(1200, $window.width());
        $list.css('width', itemWidth * $list.length);
        $listItems.css('width', itemWidth);
    };

    var onActiveItemChanged = function (eventName, itemIndex) {
        var colors = backgroundColors[itemIndex];
        $body.css('background', colors.bg);
        $body.css('color', colors.body + ' !important');
    };

    var onResize = _.debounce(function () {
        setItemSize();
        _.delay(function () { sly.reload(); }, 20);
    }, 100);

    var init = function() {
        setItemSize();
        sly = new Sly($slyFrame, slyOptions).init();
        sly.on('active', onActiveItemChanged);

        onActiveItemChanged('active', 0);
    };

    $window.resize(onResize);
    $(document).ready(init);
})(document, window, $);