
class Operation {
    constructor(operationStr) {
        // todo refactor

        this.opmap = Object.freeze({
            EQUALS: "=",
            GREATER_THAN: ">",
            LESS_THAN: "<",
            INVALID: "?",
        });

        this.operation = this.getOperation(operationStr);
    }

    getOperation(opStr) {
        let opmap = this.opmap;
        switch (opStr) {
            case "=":
                return opmap.EQUALS;
            case ">":
                return opmap.GREATER_THAN;
            case "<":
                return opmap.LESS_THAN;
            default:
                throw new Error(`Invalid Operation: ${operationStr}`);
        }
    }
}

module.exports = Operation;
