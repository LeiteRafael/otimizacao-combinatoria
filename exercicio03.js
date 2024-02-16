const glpkAdapter = require('./glpkAdapter');

class Exercicio03 {
    // Construtor para usar as abstrações do glpkAdapter
    constructor() {
        this._nameOfProblem = "Policiamento de rua";
        this._descriptionOfZ = "Efetivo minimo de policias para suprir a demanda:"
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
        console.log("Qtd. de policias que comecam nos turnos: ", computation.result.vars, '\n\n');

    }

    // Variaveis que possuem a qtd. de polciais que começam a trabalhar no turno 
    _createVars() {
        return [
            { name: 'Turno1', coef: 1.0 },
            { name: 'Turno2', coef: 1.0 },
            { name: 'Turno3', coef: 1.0 },
            { name: 'Turno4', coef: 1.0 },
            { name: 'Turno5', coef: 1.0 },
            { name: 'Turno6', coef: 1.0 }
        ];
    }

    // Restrições onde o turno anterior sempre compartilha policias com o seguinte.
    // Porque cada turno possui 4 horas e os policias trabalham 8 horas.

    _mountConstraints() { // Aqui trouxe a restrições da direita para a esquerda e inverti o sinal
        return [
            this._createConstraints([[1, 'Turno1'], [1, 'Turno6']], '>=', 22),               // => Turno1 + Turno6 >= 22
            this._createConstraints([[1, 'Turno2'], [1, 'Turno1']], '>=', 55),               // => Turno2 + Turno1 >= 55
            this._createConstraints([[1, 'Turno3'], [1, 'Turno2']], '>=', 88),               // => Turno3 + Turno2 >= 88
            this._createConstraints([[1, 'Turno4'], [1, 'Turno3']], '>=', 110),              // => Turno4 + Turno3 >= 110
            this._createConstraints([[1, 'Turno5'], [1, 'Turno4']], '>=', 44),               // => Turno5 + Turno4 >= 44
            this._createConstraints([[1, 'Turno6'], [1, 'Turno5']], '>=', 33),               // => Turno6 + Turno5 >= 33
            // Restrições de positividade para variaveis
            this._createConstraints([[1, 'Turno1']], '>=', 0),                               // => Turno1 >= 0
            this._createConstraints([[1, 'Turno2']], '>=', 0),                               // => Turno2 >= 0
            this._createConstraints([[1, 'Turno3']], '>=', 0),                               // => Turno3 >= 0
            this._createConstraints([[1, 'Turno4']], '>=', 0),                               // => Turno4 >= 0
            this._createConstraints([[1, 'Turno5']], '>=', 0),                               // => Turno5 >= 0
            this._createConstraints([[1, 'Turno6']], '>=', 0),                               // => Turno6 >= 0

        ];
    }
}

const exercicio03 = new Exercicio03();
exercicio03.execute();