var AdaptivePlayer = function($el, options){
    this.$el = $el;
    this.cover = options.cover;
    this.file = options.file;
    console.log(this.file);
    this.track = {
        title: this.file
    };

    this.size = 600;

    this.initialize();
    return this;
};

AdaptivePlayer.prototype.initialize = function(){
    if(this.initialized) return;
    this.initialized = true;

    this.$el.html(_.template($('#amp-tpl').html(), this));

    //Cover
    this.$cover = this.$el.find('.cover');
    this.$overlay = this.$el.find('.overlay');

    //Audio
    this.$audio = new Audio(this.file);
    this.$audio.controls = false;
    this.$audio.volume = 0;
    this.$el.find('.amp').append(this.$audio);

    //Controls
    this.$controls = this.$el.find('.control.main');

    this.bindEvents();
};

AdaptivePlayer.prototype.bindEvents = function(){
    var that = this;

    this.$cover
        .on('mousedown', function(e){
            that._isDragging = true;
            that.$overlay.addClass('dragging');

            var position = (e.pageX - $(e.target).offset().left) / that.size;
            that.setOverlay(position);
        })
        .on('mouseup', function(e){
            that._isDragging = false;
            that.$overlay.removeClass('dragging');

            var position = (e.pageX - $(e.target).offset().left) / that.size;
            that.setTime(position);
        })
        .on('mousemove', function(e){
            if(!that._isDragging) return;

            var position = (e.pageX - $(e.target).offset().left) / that.size;
            that.setOverlay(position);
        });
    this.$controls
        .on('click', 'li', function(){
            var action = $(this).data('action');
            if(typeof that[action] === "function"){
                that[action]();
            }
        });
};

AdaptivePlayer.prototype.setTime = function(position){
    this.$audio.currentTime = position * this.$audio.duration;
    this.setOverlay(position);
};

AdaptivePlayer.prototype.setOverlay = function(position){
    this.$overlay.width(Math.round(position * this.size));
};

AdaptivePlayer.prototype.play = function(){
    this.$audio.play();
    this.$controls.find('li[data-action="play"]').data('action','pause')
    var that = this;
    this.interval = setInterval(function(){
        if(that._isDragging) return;
        that.checkPosition();
    }, 100);
};

AdaptivePlayer.prototype.pause = function(){
    this.$audio.pause();
    clearInterval(this.interval);
};

AdaptivePlayer.prototype.checkPosition = function(){
    var position = this.$audio.currentTime / this.$audio.duration;
    this.setOverlay(position);
};
