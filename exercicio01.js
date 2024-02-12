const glpkAdapter = require('./glpkAdapter');

class Exercicio01 {
    // Construtor para usar as abstrações do glpkAdapter
    constructor() {
        this._resolveProblem = glpkAdapter.resolveProblem;
        this._createInputData = glpkAdapter.createInputData;
        this._writeFormulation = glpkAdapter.writeFormulation;
        this._createBnds = glpkAdapter.createBnds;
        this._nameOfProblem = "Escoamento de producao";
        this._descriptionOfZ = "Quantidade de toneladas que podem ser escoadas de 'a' ate 'e': "
    }

    execute() {
        const vars = this._createVars();
        const constraints = this._createConstraints();
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

    _createConstraints() {
        return [
            // Restrições das arrestas
            {
                vars: [{ name: 'Xac', coef: 1.0 }], bnds: this._createBnds('<=', 3.0)
            },
            {
                vars: [{ name: 'Xab', coef: 1.0 }], bnds: this._createBnds('<=', 8.0)
            },
            {
                vars: [{ name: 'Xce', coef: 1.0 }], bnds: this._createBnds('<=', 7.0)
            },
            {
                vars: [{ name: 'Xbc', coef: 1.0 }], bnds: this._createBnds('<=', 8.0)
            },
            {
                vars: [{ name: 'Xbd', coef: 1.0 }], bnds: this._createBnds('<=', 3.0)
            },
            {
                vars: [{ name: 'Xde', coef: 1.0 }], bnds: this._createBnds('<=', 8.0)
            },
            // Restrições de conservação de fluxo
            {
                vars: [
                    { name: 'Xac', coef: 1.0 },
                    { name: 'Xbc', coef: 1.0 },
                    { name: 'Xce', coef: -1.0 }
                ],
                bnds: this._createBnds('>=', 0.0)
            },
            {
                vars: [
                    { name: 'Xab', coef: 1.0 },
                    { name: 'Xbc', coef: -1.0 },
                    { name: 'Xbd', coef: -1.0 }
                ],
                bnds: this._createBnds('>=', 0.0)
            },
            {
                vars: [
                    { name: 'Xbd', coef: 1.0 },
                    { name: 'Xde', coef: -1.0 }
                ],
                bnds: this._createBnds('>=', 0.0)
            },
            // Restrições de positividade para variaveis
            {
                vars: [{ name: 'Xac', coef: 1.0 }], bnds: this._createBnds('>=', 0.0)
            },
            {
                vars: [{ name: 'Xab', coef: 1.0 }], bnds: this._createBnds('>=', 0.0)
            },
            {
                vars: [{ name: 'Xce', coef: 1.0 }], bnds: this._createBnds('>=', 0.0)
            },
            {
                vars: [{ name: 'Xbc', coef: 1.0 }], bnds: this._createBnds('>=', 0.0)
            },
            {
                vars: [{ name: 'Xbd', coef: 1.0 }], bnds: this._createBnds('>=', 0.0)
            },
            {
                vars: [{ name: 'Xde', coef: 1.0 }], bnds: this._createBnds('>=', 0.0)
            },
        ];
    }
}
const exercicio01 = new Exercicio01();
exercicio01.execute();