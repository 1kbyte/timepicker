$.fn.timepicker = function(options){
    var $this = $(this);
    var data = $this.data('timepicker');
    if (!data) {
        data = new TimePicker(this, options);
    }
    $this.data('timepicker', data);
    return data;
}
var TimePicker = function(element, options) {
    this.element = $(element);
    this.options = options;

    this.startTime = "00:00"
    this.endTime = "24:00";
    this.interval = "15";

    this.startVal = "";
    this.endVal = "";

    this._initElement();
    this._generateItems(this.options);

    this._events = [];

    this._buildEvents();
    this._attachEvents();
}

TimePicker.prototype = {
    _initElement:function() {
        this.startTimeElement = $(TPGlobal.timepickerTemplate);
        this.endTimeElement = $(TPGlobal.timepickerTemplate);
        this.startPickerElement = this.startTimeElement.find(".timepicker-picker-contentview").first();
        this.endPickerElement = this.endTimeElement.find(".timepicker-picker-contentview").first();
        // this.endPickerTemplate = $(TPGlobal.pickerTemplate);

        this.element.append(this.startTimeElement);
        this.element.append($(" <span> - </span>"));
        this.element.append(this.endTimeElement);
    },
    _generateItems:function(options) {
        this.endPickerElement.empty();
        this.startPickerElement.empty();
        if (options && options.startTime) {
            this.startTime = options.startTime;
        }
        if (options && options.endTime) {
            this.endTime = options.endTime;
        }
        if (options && options.interval) {
            this.interval = options.interval;
        }

        var array = this.startTime.split(':');
        var start = parseInt(array[0]) * 60 + parseInt(array[1]);

        array = this.endTime.split(':');
        var end = parseInt(array[0]) * 60 + parseInt(array[1]);

        var interval = parseInt(this.interval);

        var selectStartIntVal = -1;
        var selectEndIntVal = -1;
        if (this.startVal.length > 0) {
            array = this.startVal.split(':');
            selectStartIntVal = parseInt(array[0]) * 60 + parseInt(array[1]);
        }
        if (this.endVal.length > 0) {
            array = this.endVal.split(':');
            selectEndIntVal = parseInt(array[0]) * 60 + parseInt(array[1]);
        }

        for(var i=start; i<=end; i=i+interval) {
            var hour = ('0' + parseInt(i/60)).slice(-2);
            var min = ('0' + i%60).slice(-2);
            var endItem = '<div class="picker-item">' + hour + ':' + min + '</div>';
            var startItem = '<div class="picker-item">' + hour + ':' + min + '</div>';
            if (selectStartIntVal >= 0) {
                if (i <= selectStartIntVal) {
                    endItem = '<div class="picker-item disabled">' + hour + ':' + min + '</div>';
                }
            }
            if (selectEndIntVal >= 0) {
                if (i >= selectEndIntVal) {
                    startItem = '<div class="picker-item disabled">' + hour + ':' + min + '</div>';
                }
            }
            this.startPickerElement.append($(startItem));
            this.endPickerElement.append($(endItem));
        }

    },
    _buildEvents: function() {
        this._events.push(
            [this.startTimeElement.find(".timepicker-input"), {click: $.proxy(this.clickStart, this)}],
            [this.endTimeElement.find(".timepicker-input"), {click: $.proxy(this.clickEnd, this)}],
            [this.startTimeElement.find(".picker-item"), {click: $.proxy(this.selectStart, this)}],
            [this.endTimeElement.find(".picker-item"), {click: $.proxy(this.selectEnd, this)}],
            [$(document), {click: $.proxy(this.tapSpace, this)}],
        );
    },
    tapSpace:function(e) {
        if (!this.element.is(e.target) && this.element.has(e.target).length === 0) {
            this.startTimeElement.find(".timepicker-picker").addClass("hidden");
            this.endTimeElement.find(".timepicker-picker").addClass("hidden");
        }
    },
    selectStart:function(e) {
        if ($(e.target).hasClass("disabled")) {
            return;
        }
        this.startVal = $(e.target).text();
        this.startTimeElement.find(".timepicker-input").val(this.startVal);
        this.startTimeElement.find(".timepicker-picker").addClass("hidden");
        this._generateItems(this.options);
        this._detachEvents();
        this._events = [];
        this._buildEvents();
        this._attachEvents();
    },
    selectEnd:function(e) {
        if ($(e.target).hasClass("disabled")) {
            return;
        }
        this.endVal = $(e.target).text();
        this.endTimeElement.find(".timepicker-input").val(this.endVal);
        this.endTimeElement.find(".timepicker-picker").addClass("hidden");
        this._generateItems(this.options);
        this._detachEvents();
        this._events = [];
        this._buildEvents();
        this._attachEvents();
    },
    clickStart: function() {
        if (this.startTimeElement.find(".timepicker-picker").hasClass("hidden")) {
            this.startTimeElement.find(".timepicker-picker").removeClass("hidden");
        }else{
            this.startTimeElement.find(".timepicker-picker").addClass("hidden");
        }
        if (!this.endTimeElement.find(".timepicker-picker").hasClass("hidden")) {
            this.endTimeElement.find(".timepicker-picker").addClass("hidden");
        }
    },
    clickEnd: function() {
        if (this.endTimeElement.find(".timepicker-picker").hasClass("hidden")) {
            this.endTimeElement.find(".timepicker-picker").removeClass("hidden");
        }else{
            this.endTimeElement.find(".timepicker-picker").addClass("hidden");
        }
        if (!this.startTimeElement.find(".timepicker-picker").hasClass("hidden")) {
            this.startTimeElement.find(".timepicker-picker").addClass("hidden");
        }
    },
    _attachEvents: function() {
        this._detachEvents();
        this._applyEvents(this._events);
    },
    _detachEvents: function(){
        this._unapplyEvents(this._events);
    },
    _applyEvents: function(evs) {
        for (var i=0, el, ch, ev; i < evs.length; i++){
            el = evs[i][0];
            if (evs[i].length === 2){
                ch = undefined;
                ev = evs[i][1];
            } else if (evs[i].length === 3){
                ch = evs[i][1];
                ev = evs[i][2];
            }
            el.on(ev, ch);
        }
    },
    _unapplyEvents: function(evs){
        for (var i=0, el, ev, ch; i < evs.length; i++){
            el = evs[i][0];
            if (evs[i].length === 2){
                ch = undefined;
                ev = evs[i][1];
            } else if (evs[i].length === 3){
                ch = evs[i][1];
                ev = evs[i][2];
            }
            el.off(ev, ch);
        }
    }
}

TPGlobal = {
    timepickerTemplate: '<div class="timcpicker-item"><input class="timepicker-input" readonly type="text"><span class="timepicker-input-prefix"><i class="fa fa-clock-o"></i></span><div class="selection-container"><div class="timepicker-picker hidden"><div class="timepicker-picker-scrollbar"><div class="timepicker-picker-panel"><div class="timepicker-picker-contentview"></div></div></div></div></div></div>',
    itemTemplate:'<div class="picker-item"></div>',
}
$.fn.timepicker.TPGlobal = TPGlobal;

