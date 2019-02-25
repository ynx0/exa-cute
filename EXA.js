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
        this.pc = 0; // program counter. the line number of current executing program
        this.program = program;
        this.halted = false;
        this.blocked = false;
        this.X = new EXARegister();
        this.T = new EXARegister();
        this.Instuctions = makeEnum([
            "NOOP",
            "ADDI",
            "SUBI",
            "MULI",
            "DIVI"
        ])
        // todo support F and M registers
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
        let args = instr.args;


        // todo handle overflow
        switch (instr.name) {
            case Instructions.ADDI:
            case Instructions.SUBI:
            case Instructions.MULI:
            case Instructions.DIVI:
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

                break;

            case Instructions.NOOP:
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
        // console.log(currentInstr.args);
        this.processInstruction(currentInstr);
        this.pc++;
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
        } else if (typeof value === "string"){
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

}

module.exports = EXA;
