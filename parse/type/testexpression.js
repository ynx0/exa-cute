const Operation = require("./operation.js");


class TestExpression {
    constructor(param1, operationString, param2) {
        this.param1 = param1;
        this.operation = new Operation(operationString);
        this.param2 = param2;
    }

}

module.exports = TestExpression;
