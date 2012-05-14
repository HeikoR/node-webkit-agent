var DebuggerClient = require('debugger-client');

function DebuggerAgent(sendEvent) {
    this.sendEvent = sendEvent;
    this.enabled = false;
    this.client = new DebuggerClient();
}

(function(){
    this.causesRecompilation = function(params, sendResult) {
        sendResult({result: false});
    };

    this.supportsNativeBreakpoints = function(params, sendResult) {
        sendResult({result: false});
    };

    this.canSetScriptSource = function(params, sendResult) {
        sendResult({result: true});
    };

    this.enable = function(params, sendResult) {
        if (this.enabled) {
            return;
        }

        this.client.connect(function() {
            sendResult({});

        });
    };

    this.disable = function(params, sendResult) {
        var self = this;
        this.client.disconnect(function() {
            self.enabled = false;
            sendResult({});
        });
    };

    this.setBreakpointByUrl = function(params, sendResult) {
        var self = this;
        this.client.setBreakpoint(params, function(breakId) {
            sendResult();
        });
        /*var breakId = this.Debug.setScriptBreakPointByName( params.url,
                                                            params.lineNumber,
                                                            params.columnNumber,
                                                            params.condition,
                                                            1);
        */
        var locations = this.Debug.findBreakPointActualLocations(breakId);
        if (!locations.length) {
            console.log('Unable to set breakpoint by URL');
            return;
        }

        sendResult({
            breakpointId: breakId.toString(),
            locations: [{
                lineNumber: locations[0].line,
                columnNumber: locations[0].column,
                scriptId: locations[0].script_id.toString()
            }]
        });
    };


}).call(DebuggerAgent.prototype);