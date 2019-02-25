const Parameter = require('./parameter.js');

class EXANumber extends Parameter {

    constructor(num) {
        super();
        this.value = num;
    }

    getValue() {
        return this.value;
    }

}
module.exports = EXANumber;
