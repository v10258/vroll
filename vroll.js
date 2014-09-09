/**
 * jquery.vroll.js
 * @author  :  chenjinghui@m3guo.com
 * @created :  2014/08/29
 * @version :  0.0.1
 * @desc    :  数据滚动展示
 * @e.g.    :  方法用例：
 *             $("#J_Roll").vroll({
 *                  showRow: 4,
 *                  moveRow: 2
 *             });
 */

(function($) {

    var defaults = {
            rollWrap: "ul",
            selector: "ul > li",
            showRow: 1,
            showCol: 1,
            moveRow: 1,             //Integer: Select the sliding direction, "horizontal" or "vertical"
            direction: "vertical",  //String: Select the sliding direction, "horizontal" or "vertical"
            animDuration: 300,      //Integer: Set the speed of animations, in milliseconds
            animSpeed: 3000         //Integer: Set the speed of the slideshow cycling, in milliseconds
        },
        containerCSS = {
            "position": "relative",
            "overflow": "hidden"
        },

        Roll = function(elem, option) {
            this.$container = $(elem);
            this.cfg = $.extend({}, defaults, option);
            this.init();
        };

        Roll.prototype = {
            init: function() {
                var self = this,
                    cfg = self.cfg;
                    
                self.frameIndex = 0;
                self.moveTotal = Math.ceil(self.$container.find(cfg.selector).length / (cfg.moveRow * cfg.showCol));

                self.rander();
                self.bindEvent();
                self.start();
            },

            rander: function() {
                var self = this,
                    cfg = self.cfg,
                    $container = this.$container;
                    $rollWrap = $container.find("ul"),
                    $rollTtems = $container.find(cfg.selector),
                    itemLength = $rollTtems.length,
                    cloneNum = cfg.showRow * cfg.showCol;

                if (itemLength > cfg.showRow * cfg.showCol) {
                    $rollTtems.slice(0, cloneNum).clone().appendTo($rollWrap);
                }

                containerCSS = $.extend({}, containerCSS, {});
                $container.css(containerCSS);
                $rollWrap.css("position", "absolute");
            },

            bindEvent: function() {
                var self = this,
                    $container = this.$container;

                $container.on("mouseenter", function(){
                    self.stop();
                }).on("mouseleave", function(){
                    self.start();
                });

            },

            start: function() {
                var self = this,
                    cfg = self.cfg,
                    $container = this.$container,
                    $rollTtems = $container.find(cfg.selector);

                if ($rollTtems.length > cfg.showRow * cfg.showCol) {
                    self.autoPlayInterval = window.setInterval(function() {
                        self.move();
                    }, cfg.animSpeed);
                }
            },

            move: function() {
                var self = this,
                    cfg = self.cfg,
                    $container = this.$container,
                    $rollWrap = $container.find("ul"),
                    $itemFirst = $container.find(cfg.selector).first(),
                    distance = cfg.direction === "horizontal" ?  cfg.moveRow * $itemFirst.outerWidth() : cfg.moveRow * $itemFirst.outerHeight(),
                    moveStyle = cfg.direction === "horizontal" ? "left" : "top",
                    animParam;

                    if (self.frameIndex === self.moveTotal) {
                        self.frameIndex = 1;
                        $rollWrap.css(moveStyle, 0);
                    } else {
                        self.frameIndex++;
                    }

                    animParam = cfg.direction === "horizontal" ? {
                        "left": -(self.frameIndex * distance)
                    } : {
                        "top": -(self.frameIndex * distance)
                    };

                    $rollWrap.animate(animParam, cfg.animDuration);
                
            },

            stop: function() {
                window.clearInterval(this.autoPlayInterval);
            }
        };

    // bridging
    $.fn.vroll = function(option) {
        return this.each(function() {
            var $elem = $(this),
                data = $elem.data('vroll');

            if (!data) $elem.data('vroll', (data = new Roll(this, option)));
            if (typeof option == 'string') data[option]();
        });
    };

})(jQuery);
