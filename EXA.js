const util = require('util');
const AST = require('./parse/type/types.js');


function makeEnum(array) {
    let theEnum = {};
    for (let elem of array) {
        theEnum[elem] = elem;
    }
    return Object.freeze(theEnum);
}

class EXA {
    constructor(program) {
        this.id = 0; // TODO make id (autoincremented thing?)
        this.pc = 0; // program counter. the line number of current executing program
        this.cycleCount = 0; // todo implement and take into account pseudoinstructions (mark)
        this.program = program;
        this.halted = false;
        this.blocked = false;
        this.labelMap = {};
        this.X = new EXARegister();
        this.T = new EXARegister();
        // todo support F and M registers
        // TODO refactor this to be shared in the parser?
        this.Instuctions = makeEnum([
            "NOOP",
            "MARK",
            "COPY",
            "SWIZ",
            "ADDI",
            "SUBI",
            "MULI",
            "DIVI",
            "JUMP",
            "TJMP",
            "FJMP"
        ]);
        this.setupLabels();
        this.setupCoreDump();
    }


    setupCoreDump() {
        process.on('uncaughtException', err => {
                console.error(err);
                console.error("==========================CORE DUMP==========================");
                this.coreDump();
        });

    }

    coreDump() {
        console.error(`
        EXA#${this.id}
        PC: ${this.pc}
        HALTED: ${this.halted}
        BLOCKED: ${this.blocked}
        LABELS: ${util.inspect(this.labelMap)}
        REGISTERS: [
            X: ${this.X.toString()}
            T: ${this.T}
        ]
        `);
    }

    setupLabels() {
        // Structure of labelMap: { <loop_name> : <line_num> }
        for (let lineNum in this.program.body) {
            let instr = this.program.body[lineNum];
            if (instr.name === this.Instuctions.MARK) {
                this.labelMap[instr.args[0]] = parseInt(lineNum);
            }
        }
    }
    getValueFromParam(param) {
        if (param instanceof AST.Register) {
            // console.log("reee");
            // console.log(param.name);
            return this[param.name].getValue();
        } else if (param instanceof AST.EXANumber) {
            return param.getValue();
        }
    }

    getRegisterFromParam(param) {
        return this[param];
    }

    processInstruction(instr) {
        let Instructions = this.Instuctions;
        console.log(instr);
        let args = instr.args;


        // todo handle overflow
        // noinspection JSUnresolvedVariable
        switch (instr.name) {

            case Instructions.MARK:
                // need preincrement otherwise this doesn't work...
                this.cycleCount = Math.max(0, --this.cycleCount); // do not add to cycle-count for markInstructions
                break;
            case Instructions.NOOP:
                break;
            case Instructions.COPY:
                (() => {
                    let newValue = this.getValueFromParam(args[0]);
                    let dest = this.getRegisterFromParam(args[1]);
                    dest.setValue(newValue);
                })();
                break;
            case Instructions.JUMP:
                let label = args[0];
                let labelLineNum = this.labelMap[label];
                console.log(`Current pc = ${this.pc}`);
                this.pc = labelLineNum;
                console.log(`After pc = ${this.pc}`);
                break;
            case Instructions.ADDI:
            case Instructions.SUBI:
            case Instructions.MULI:
            case Instructions.DIVI:
                (() => {
                    let a = this.getValueFromParam(args[0]);
                    let b = this.getValueFromParam(args[1]);
                    let dest = this.getRegisterFromParam(args[2]);
                    // console.log(`${a} ${instr.name} ${b} -> ${dest}`);
                    if (instr.name === Instructions.ADDI) {
                        dest.setValue(a + b);
                    } else if (instr.name === Instructions.SUBI) {
                        dest.setValue(a - b);
                    } else if (instr.name === Instructions.MULI) {
                        dest.setValue(a * b);
                    } else if (instr.name === Instructions.DIVI) {
                        // enforce integer division
                        dest.setValue(parseInt(a / b));
                    }
                })();
                break;
            default:
                console.log("Unimplemented instruction: " + instr.name);
        }
    }

    runStep() {
        // this.validateState();
        // console.log(`pc: ${this.pc}, prl: ${this.program.body.length}`);
        if (this.pc >= this.program.body.length) {
            this.halted = true;
            return;
        }
        let currentInstr = this.program.body[this.pc];
        this.processInstruction(currentInstr);
        this.pc++;
        this.cycleCount++;
    }

    runUntil(lineNum) {
        while (this.pc <= lineNum - 1) {
            this.runStep();
        }
    }

    runUntilCycle(cycleNum) {
        while (!this.halted && this.cycleCount < cycleNum) {
            this.runStep();
        }
    }

    run() {
        while (!this.halted) {
            if (!this.blocked) {
                this.runStep();
            } else {
                // wait for environment to unblock?
            }
        }
    }


    validateState() {
        let stateChecks = [
            this.pc > 0,

        ];
        stateChecks.forEach(check => {
            if (!check) {
                throw new Error(`
                FATAL: Invalid state encountered.
                ============CORE DUMP============
                ${this.toString()}
                `)
            }
        });
    }
}

class EXARegister {
    constructor(value = 0) {
        this.value = value;
        this.maxStringLength = 500; // todo change to real maxlen
    }

    isValid(value) {
        if (typeof value === "number") {
            return -9999 < value && value < 9999;
        } else if (typeof value === "string") {
            return value.length < this.maxStringLength;
        }
    }

    setValue(newVal) {
        if (this.isValid(newVal)) {
            this.value = newVal;
        } else {
            throw new Error("Invalid value " + newVal);
        }
    }


    getValue() {
        if (typeof this.value === "number") {
            return parseInt(this.value);
        } else {
            return this.value;
        }
    }
    toString() {
        return `EXARegister {${this.value}}`
    }

}

module.exports = EXA;
