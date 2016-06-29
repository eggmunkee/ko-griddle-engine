var EngineVM = function(data) {
    var self = this;

    self.gridComponent = ko.observable('');
    self.frame = ko.observable(0);
    self.frameRate = ko.observable(data.frameRate || 500);
    self.timer = null;
    self.isActive = ko.observable(false);
    self.afterAdvance = data.afterAdvance || function() {};

    self.start = function() {
        if (self.timer == null)
            self.timer = setInterval(self.advance, self.frameRate());
        self.isActive(true);
    };
    self.stop = function() {
        if (self.timer != null) {
            clearInterval(self.timer);
            self.timer = null;
        }
        self.isActive(false);
    };
    self.toggleAdvance = function() {
        if (self.timer == null)
            self.start();
        else
            self.stop();
    };
    // Attach event to frameRate changes
    self.frameRate.subscribe(function() {
        // Restart timer on frame rate change
        self.stop();
        self.frameRate(); // Create a dependency on frame rate to trigger logic
        self.start();
    });
    self.advance = function() {
        self.frame(self.frame() + 1);
        ko.tasks.schedule(self.afterAdvance(self));
    };

    self.seconds = ko.computed(function() {
        var total = self.frame() * self.frameRate();
        var seconds = Math.floor((total / 1000) % 60);
        seconds = '0' + seconds.toString();
        seconds = seconds.substr(seconds.length - 2, 2);
        return seconds;
    }, self);
    self.minutes = ko.computed(function() {
        var total = self.frame() * self.frameRate();
        var min = Math.floor((total / (1000 * 60)) % 60);
        min = '0' + min.toString();
        min = min.substr(min.length - 2, 2);
        return min;
    }, self);

};
