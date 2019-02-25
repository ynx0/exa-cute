const Parser = require('./parse/index.js').Parser;
const EXA = require('./EXA.js');

let parser = new Parser();
let programString = 'ADDI 1 1 T' // 1 + 1 = 2 -> T
                  + 'MULI T T T' // T * T => 2 * 2 = 4 -> T
                  + 'SUBI T 200 T' // T - 200 => 4 - 200 = 196 -> T
                  ;

// (((34 / 2) + 55) - 13) * 12


let program2 = `
ADDI 0 34 X
DIVI X 2 X
ADDI X 5 X
SUBI X 3 X
MULI X 12 X
`;

let program = parser.getProgramAST(program2);

let XA = new EXA(program);
XA.run();


console.log(XA);




