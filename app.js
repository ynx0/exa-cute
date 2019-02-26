const Parser = require('./parse/index.js').Parser;
const EXA = require('./EXA.js');
const AST = require('./parse/type/types.js');
const autosize = require('autosize');

class EXASIM {
    constructor() {
        this.parser = new Parser();
        this.exaList = [];
    }


    createExa(name, program) {
        this.addExa(new EXA(program));
    }

    addExa(exa) {
        this.exaList.push(exa);
    }

    getExa(id) {
        return this.exaList.filter(exa => exa.id === id)[0];
    }

    removeExa(id) {
        for (let i in this.exaList) {
            if (this.exaList[i].id === id) {
                this.exaList.splice(i, 1);
            }
        }
    }
}

let app_el = document.querySelector("#main");
autosize(document.querySelector("#code-editor"));


window.EXA_ENV = {
  Parser,
  EXA,
  AST,
  EXASIM
};
