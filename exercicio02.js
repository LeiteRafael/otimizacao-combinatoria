const glpkAdapter = require('./glpkAdapter');

class Exercicio02 {
    // Construtor para usar as abstrações do glpkAdapter
    constructor() {
        this._nameOfProblem = "Planejamento de construcao";
        this._descriptionOfZ = "Tempo minimo para entregar as chaves:"
        this._resolveProblem = glpkAdapter.resolveProblem;
        this._createInputData = glpkAdapter.createInputData;
        this._writeFormulation = glpkAdapter.writeFormulation;
        this._createConstraints = glpkAdapter.createConstraints;
    }

    execute() { // Chamada principal do programa
        const vars = this._createVars();
        const constraints = this._mountConstraints();
        const input = this._createInputData(vars, constraints, this._nameOfProblem, 'MIN');

        this._writeFormulation(input, this.options);
        const computation = this._resolveProblem(input, this.options, this._descriptionOfZ);

        console.log("tempo minimo para cada etapa comecar:", computation.result.vars,"\n\n")
        console.log("tempo que cada etapa demora pra ser finalizada considerando os pre-requisitos:",
            this._generateTimeFinalization(computation.result.vars));
    }

    // Cria as variavel Chaves onde o valor representa o tempo em que a etapa inicia
    _createVars() {
        return [
            { name: 'Chaves', coef: 1.0 }
        ];
    }

    // As variaveis representaram o tempo em que a etapa inicia
    _mountConstraints() { // Aqui trouxe a restrições da direita para a esquerda e inverti o sinal
        return [
            this._createConstraints([[1, 'Paredes']], '>=', 0.0),                             // => Paredes >= 0
            this._createConstraints([[1, 'Teto'], [-1, 'Paredes']], '>=', 2.0),               // => Teto >= Paredes +2
            this._createConstraints([[1, 'Revestimentos'], [-1, 'Paredes']], '>=', 2.0),      // => Revistimentos >= Paredes
            this._createConstraints([[1, 'Aberturas'], [-1, 'Revestimentos']], '>=', 3.0),    // => Aberturas >= Revestimentos + 3
            this._createConstraints([[1, 'Instalacoes'], [-1, 'Revestimentos']], '>=', 3.0),  // => Instalacoes >= Revestimentos + 3
            this._createConstraints([[1, 'Eletrica'], [-1, 'Aberturas']], '>=', 2.5),         // => Eletrica >= Aberturas + 2.5
            this._createConstraints([[1, 'Interior'], [-1, 'Eletrica']], '>=', 2.0),          // => Interior >= Eletrica + 2.0 
            this._createConstraints([[1, 'Exterior'], [-1, 'Aberturas']], '>=', 2.5),         // => Exterior >= Aberturas + 2.5
            this._createConstraints([[1, 'Chaves'], [-1, 'Interior']], '>=', 4.0),            // => Chaves >= Interior + 4.0
            this._createConstraints([[1, 'Chaves'], [-1, 'Exterior']], '>=', 3.0),            // => Chaves >= Exterior + 3.0

            // Existe algumas obviedades aqui que ajudam na criação das restrições
            // Eletrica precisa de abertura e teto, sabemos que tempo para fazer abertura é maior que o teto sempre, entao limitamos por abertura
            // Exterior precisa de abertura e teto, sabemos que tempo para fazer abertura é maior que o teto sempre, entao limitamos por abertura
            // Interior precisa de eletrica e instalação, sabemos que tempo para fazer eletrica é maior que instalação sempre, entao limitamos por eletrica

            // Restrições de positividade para variaveis
            this._createConstraints([[1, 'Instalacoes']], '>=', 0.0),
            this._createConstraints([[1, 'Teto']], '>=', 0.0),
            this._createConstraints([[1, 'Revestimentos']], '>=', 0.0),
            this._createConstraints([[1, 'Aberturas']], '>=', 0.0),
            this._createConstraints([[1, 'Interior']], '>=', 0.0),
            this._createConstraints([[1, 'Exterior']], '>=', 0.0),
            this._createConstraints([[1, 'Chaves']], '>=', 0.0),
            this._createConstraints([[1, 'Eletrica']], '>=', 0.0)
        ];
    }

    _generateTimeFinalization(imput) {// tempo que cada etapa demora pra ser finalizada considerando os pre-requisitos 
        const table = {
            Paredes: 2,
            Teto: 2,
            Revestimentos: 3,
            Aberturas: 2.5,
            Instalacoes: 1.5,
            Eletrica: 2,
            Interior: 4,
            Exterior: 3,
            Chaves: 0
        }
        for (const key in imput) {
            if (imput.hasOwnProperty(key) && table.hasOwnProperty(key)) {
                imput[key] = table[key] + imput[key];
            }
        }
        return imput;
    };
}
const exercicio02 = new Exercicio02();
exercicio02.execute();