const Parser = require('./parser');
//
//
// let parser = new Parser();
// let program = parser.getProgramAST(`
// GRAB 300
// LINK 800
// DROP
// MARK LOOP
// GRAB 300
// SEEK X
// COPY X T
// COPY F X
// DROP
// GRAB 200
// SEEK 9999
// COPY X F
// COPY T X
// DROP
// TEST X = 4
// ADDI X 1 X
// FJMP LOOP
// GRAB 300
// WIPE
// `);
//
// /*
//
//  */
// console.log(program.body);


module.exports = {
    Parser,
};
