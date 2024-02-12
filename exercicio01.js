const glpkAdapter = require('./glpkAdapter');

class Exercicio01 {
    // Construtor para usar as abstrações do glpkAdapter
    constructor() {
        this._resolveProblem = glpkAdapter.resolveProblem;
        this._createInputData = glpkAdapter.createInputData;
        this._writeFormulation = glpkAdapter.writeFormulation;
        this._createConstraints = glpkAdapter.createConstraints;
        this._nameOfProblem = "Escoamento de producao";
        this._descriptionOfZ = "Quantidade de toneladas que podem ser escoadas de 'a' ate 'e': "
    }

    execute() {
        const vars = this._createVars();
        const constraints = this._mountConstraints();
        const input = this._createInputData(vars, constraints, this._nameOfProblem);

        this._writeFormulation(input, this.options);
        this._resolveProblem(input, this.options, this._descriptionOfZ);
    }

    // Cria as variavéis para as arrestas que chegam em E
    _createVars() {
        return [
            { name: 'Xce', coef: 1.0 },
            { name: 'Xde', coef: 1.0 }
        ];
    }

    _mountConstraints() {
        return [
            this._createConstraints([[1, 'Xac']], '<=', 3.0),
            this._createConstraints([[1, 'Xab']], '<=', 8.0),
            this._createConstraints([[1, 'Xce']], '<=', 7.0),
            this._createConstraints([[1, 'Xbc']], '<=', 8.0),
            this._createConstraints([[1, 'Xbd']], '<=', 3.0),
            this._createConstraints([[1, 'Xde']], '<=', 8.0),
            // Restrições de conservação de fluxo  - Aqui trouxe a restrições da esquerda para a direita e inverti o sinal
            this._createConstraints([[1, 'Xac'], [1, 'Xbc'], [-1, 'Xce']], '<=', 0.0),
            this._createConstraints([[1, 'Xab'], [-1, 'Xbc'], [-1, 'Xbd']], '<=', 0.0),
            this._createConstraints([[1, 'Xbd'], [-1, 'Xde']], '<=', 0.0),
            // Restrições de positividade para variaveis
            this._createConstraints([[1, 'Xac']], '>=', 0.0),
            this._createConstraints([[1, 'Xab']], '>=', 0.0),
            this._createConstraints([[1, 'Xce']], '>=', 0.0),
            this._createConstraints([[1, 'Xbc']], '>=', 0.0),
            this._createConstraints([[1, 'Xbd']], '>=', 0.0),
            this._createConstraints([[1, 'Xde']], '>=', 0.0)
        ];
    }
}
const exercicio01 = new Exercicio01();
exercicio01.execute();