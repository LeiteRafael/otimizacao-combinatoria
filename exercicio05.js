const glpkAdapter = require('./glpkAdapter');

class Exercicio05 {
    // Construtor para usar as abstrações do glpkAdapter
    constructor() {
        this._nameOfProblem = "Monstros de bolso";
        this._descriptionOfZ = "Qtd. Max de grupos possiveis de monstros(6 diferentes):";
        this._resolveProblem = glpkAdapter.resolveProblem;
        this._createInputData = glpkAdapter.createInputData;
        this._writeFormulation = glpkAdapter.writeFormulation;
        this._createConstraints = glpkAdapter.createConstraints;
    }

    execute() { // Chamada principal do programa
        const vars = this._createVars();
        const constraints = this._mountConstraints();
        const input = this._createInputData(vars, constraints, this._nameOfProblem, 'MAX', vars);

        this._writeFormulation(input, this.options);
        const computation = this._resolveProblem(input, this.options);
        console.log("Variaveis", computation.result.vars, '\n\n');
        console.log("Qtd maxima de grupos de 6 monstros:", this._findSmallestQtdM(computation.result.vars), "\n\n");

    }

    _createVars() {
        return [
            { name: 'TempoEmA', coef: 1.0 },
            { name: 'TempoEmB', coef: 1.0 },
            { name: 'TempoEmC', coef: 1.0 },
            { name: 'TempoEmD', coef: 1.0 }
        ];
    }

    _mountConstraints() { // Aqui trouxe a restrições da direita para a esquerda e inverti o sinal
        return [
            // As restrições aqui levam em conta o bot permanece em cada etapa e quanto ele consegue capturar.
            this._createConstraints([[6, 'TempoEmA'], [1, 'TempoEmB'], [1, 'TempoEmD'], [-1, 'QtdM1']], '=', 0),
            this._createConstraints([[3, 'TempoEmC'], [1, 'TempoEmD'], [-1, 'QtdM2']], '=', 0),
            this._createConstraints([[4, 'TempoEmB'], [1, 'TempoEmD'], [-1, 'QtdM3']], '=', 0),
            this._createConstraints([[2, 'TempoEmA'], [1, 'TempoEmB'], [1, 'TempoEmD'], [-1, 'QtdM4']], '=', 0),
            this._createConstraints([[2, 'TempoEmB'], [1, 'TempoEmD'], [-1, 'QtdM5']], '=', 0),
            this._createConstraints([[1, 'TempoEmA'], [2, 'TempoEmC'], [1, 'TempoEmD'], [-1, 'QtdM6']], '=', 0),

            // As restrições aqui levam em conta o tempo que posso permanecer em cada lugar capturando, considerando o tempo de abertura e fechamento do lugar
            this._createConstraints([[1, 'TempoEmA']], '<=', 4),
            this._createConstraints([[1, 'TempoEmA'], [1, 'TempoEmB']], '<=', 4),
            this._createConstraints([[1, 'TempoEmB']], '<=', 4),
            this._createConstraints([[1, 'TempoEmB'], [1, 'TempoEmC']], '<=', 4),
            this._createConstraints([[1, 'TempoEmC']], '<=', 4),
            this._createConstraints([[1, 'TempoEmC'], [1, 'TempoEmD']], '<=', 6),
            this._createConstraints([[1, 'TempoEmD']], '<=', 4),
            this._createConstraints([[1, 'TempoEmA'], [1, 'TempoEmB'], [1, 'TempoEmC'], [1, 'TempoEmD']], '<=', 10),

            // No mimino 30 min em cada lugar
            this._createConstraints([[1, 'TempoEmA']], '>=', 0.5),
            this._createConstraints([[1, 'TempoEmB']], '>=', 0.5),
            this._createConstraints([[1, 'TempoEmC']], '>=', 0.5),
            this._createConstraints([[1, 'TempoEmD']], '>=', 0.5),
        ];
    }

    _findSmallestQtdM(variables) {
        let smallestQtdM = Infinity;

        for (const key in variables) {
            if (key.startsWith('QtdM') && variables[key] < smallestQtdM) {
                smallestQtdM = variables[key];
            }
        }

        return smallestQtdM;
    }
}

const exercicio05 = new Exercicio05();
exercicio05.execute();