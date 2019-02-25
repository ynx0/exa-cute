

class Instruction {
    constructor(info) {
        this.name = info[0];
        this.args = [info[1] || null, info[2] || null, info[3] || null];
    }
}

module.exports = Instruction;
