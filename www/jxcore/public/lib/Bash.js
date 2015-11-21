function EventTarget() {
    var self = this;
    self._listeners = {};
};

EventTarget.prototype.on = function (type, listener) {
    if (typeof this._listeners[type] == "undefined") {
        this._listeners[type] = [];
    }

    this._listeners[type].push(listener);
};

EventTarget.prototype.trigger = function (type, data) {
    if (this._listeners[type] instanceof Array) {
        var listeners = this._listeners[type];
        for (var i = 0, len = listeners.length; i < len; i++) {
            if (data instanceof Array) {
                listeners[i].apply(this, data);
            } else {
                listeners[i].call(this, data);
            }
        }
    }
};

EventTarget.prototype.removeListener = function (type, listener) {
    if (this._listeners[type] instanceof Array) {
        var listeners = this._listeners[type];
        for (var i = 0, len = listeners.length; i < len; i++) {
            if (listeners[i] === listener) {
                listeners.splice(i, 1);
                break;
            }
        }
    }
};

function Bash(container) {
    var self = this;
    self.container = container;
    EventTarget.call(self);

    // add class
    container.className = 'bash';

    // focus input on click anywhere
    container.addEventListener('click', function () {
        cmdInput.focus();
    });

    // add commmands container
    var cmdsContainer = self.cmdsContainer = document.createElement('div');
    cmdsContainer.className = 'bash-commands';
    container.appendChild(cmdsContainer);

    // add command input
    var cmdInputContainer = self.cmdInputContainer = document.createElement('div');
    cmdInputContainer.className = 'bash-input';
    cmdsContainer.appendChild(cmdInputContainer);
    var cmdInput = self.cmdInput = document.createElement('input');
    cmdInput.type = 'text';
    cmdInput.autofocus = true;
    cmdInput.spellcheck = false;
    cmdInputContainer.appendChild(cmdInput);

    // listen for command
    cmdInput.addEventListener('keypress', function (e) {
        if (e.which === 13) {
            switch (this.value) {
                case '.clear':
                self.clear();
                break;
                default:
                self.trigger('stdin', this.value);
                cmdsContainer.removeChild(cmdsContainer.childNodes[cmdsContainer.childNodes.length - 2]);
                self.write('> ' + this.value);
                break;
            }
            this.value = null;
        }
    });
}

// inherit from EventTarget
Bash.prototype.__proto__ = EventTarget.prototype;

// methods
Bash.prototype.write = function (command) {
    var self = this,
        cmdInputContainer = self.cmdInputContainer,
        cmdsContainer = self.cmdsContainer;

    var commandContainer = document.createElement('div');
    commandContainer.className = 'bash-command';
    commandContainer.textContent = command;
    cmdsContainer.insertBefore(commandContainer, cmdInputContainer);
    window.scrollTo(0, document.body.scrollHeight);
};

Bash.prototype.clear = function () {
    var self = this,
        cmdsContainer = self.cmdsContainer,
        commandContainers = cmdsContainer.childNodes;

    while (commandContainers.length > 1) {
        cmdsContainer.removeChild(commandContainers[0]);
    }
};