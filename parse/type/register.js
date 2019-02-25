const Parameter = require('./parameter.js');



class Register extends Parameter {
    constructor(name) {
        super();
        this.registerList = Object.freeze({
            X: "X",
            T: "T",
            F: "F",
            M: "M",
        });
        this.name = this.registerList[name];
    }

    getValue() {
        return this.name;
    }
    toString() {
        return this.name;
    }
}

module.exports = Register;
