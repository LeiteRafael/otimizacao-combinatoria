const glpkAdapter = require('./glpkAdapter');

class Exercicio04 {
    // Construtor para usar as abstrações do glpkAdapter
    constructor() {
        this._nameOfProblem = "Um problema de estoque";
        this._descriptionOfZ = "-----"
        this._resolveProblem = glpkAdapter.resolveProblem;
        this._createInputData = glpkAdapter.createInputData;
        this._writeFormulation = glpkAdapter.writeFormulation;
        this._createConstraints = glpkAdapter.createConstraints;
    }

    execute() { // Chamada principal do programa

        const numOfCustormers = 4;
        const numOfDeposits = 2;

        const { transportationCost, stock, customerDemands } = generateRandomValues(numOfDeposits, numOfCustormers);

        const vars = this._createVars(numOfDeposits, numOfCustormers, transportationCost);

        console.log(stock);
        const constraints = this._mountConstraints(vars, stock, customerDemands);

        console.log(constraints);

        const input = this._createInputData(vars, constraints, this._nameOfProblem, 'MIN');

        this._writeFormulation(input, this.options);
        const computation = this._resolveProblem(input, this.options, this._descriptionOfZ);
        console.log("----- ", computation.result.vars, '\n\n');

    }

    // 

    _createVars(numOfDeposits, numOfCustormers, transportationCost,) {
        const vars = [];
        for (let i = 0; i < numOfDeposits; i++) {
            for (let j = 0; j < numOfCustormers; j++) {
                console.log(transportationCost[i][j]);
                vars.push({ name: `qtd_deposito_${i + 1}_cliente_${j + 1}`, coef: transportationCost[i][j] });
            }
        }

        return vars;
    }

    _mountConstraints(vars, stock, customerDemands) { // Aqui trouxe a restrições da direita para a esquerda e inverti o sinal
        const constraints = [];
        const numOfCustormers = 4;
        const numOfDeposits = 2;

        console.log(customerDemands);

        let count = 0;
        let limit = 0;
        for (let i = 1; i <= numOfDeposits; i++) {
            let varsDeposito = [];

            for (let j = 0; j < numOfCustormers; j++) {
                console.log("aquiiiii", vars[count].name);
                varsDeposito.push([1, vars[count].name]);
                count++;
            }

            constraints[i] = this._createConstraints(varsDeposito, '<=', stock["deposit_" + i]);
            limit = i;
        }



        count = 0;
        for (let i = 1; i <= numOfCustormers; i++) {
            let varsDeposito = [];

            for (let j = 0; j < numOfDeposits; j++) {

                vars.forEach(element => {
                    if (element.name.endsWith('cliente_' + j)) {
                        varsDeposito.push([1, element.name]);
                    }
                });
                count++;
            }

            constraints[limit + i] = this._createConstraints(varsDeposito, '=', customerDemands["customer_" + i]);
        }

        return constraints;
    }
}

const exercicio4 = new Exercicio04();
exercicio4.execute();


function generateRandomValues(numOfDeposits, numOfCustormers) {
    const depositArray = Array.from({ length: numOfDeposits }, (_, i) => "deposit_" + (i + 1));
    const customerArray = Array.from({ length: numOfCustormers }, (_, i) => "customer_" + (i + 1));

    const stock = {};
    const customerDemands = {};
    const transportationCost = [];

    depositArray.forEach(deposit => {
        stock[deposit] = Math.floor(Math.random() * 50) + 1;
    });

    customerArray.forEach(customer => {
        customerDemands[customer] = Math.floor(Math.random() * 50) + 1;
    });

    for (let i = 0; i < depositArray.length; i++) {
        transportationCost[i] = [];
        for (let j = 0; j < customerArray.length; j++) {
            transportationCost[i][j] = Math.floor(Math.random() * 10) + 1;
        }
    }

    return {
        stock,
        customerDemands,
        transportationCost
    };
}