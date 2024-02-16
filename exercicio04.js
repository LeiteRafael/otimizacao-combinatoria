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

        const { transportationCost, stock } = generateRandomValues(2, 2);
        const { vars, arrayOfVars } = this._createVars(2, 2, transportationCost);
        const constraints = this._mountConstraints(arrayOfVars, stock);

        const input = this._createInputData(vars, constraints, this._nameOfProblem, 'MIN');

        this._writeFormulation(input, this.options);
        const computation = this._resolveProblem(input, this.options, this._descriptionOfZ);
        console.log("----- ", computation.result.vars, '\n\n');

    }

    // Variaveis que possuem a qtd. de polciais que começam a trabalhar no turno 

    _createVars(numDeposits, numCustomers, transportationCost) {
        const vars = [];
        const arrayOfVars = [];

        for (let i = 1; i <= numDeposits; i++) {
            for (let j = 1; j <= numCustomers; j++) {
                arrayOfVars.push(`qtd_deposito_${i}_cliente_${j}`);
                vars.push({ name: `qtd_deposito_${i}_cliente_${j}`, coef: transportationCost[`deposit_${i}-->customer_${j}`] });
            }
        }

        return { vars, arrayOfVars };
    }


    _mountConstraints(arrayOfVars, stock) { // Aqui trouxe a restrições da direita para a esquerda e inverti o sinal
        const constraints = [];
        console.log('stock', stock);

        arrayOfVars.forEach((element, index) => {
            console.log(`Elemento: ${element}`, stock[`deposit_${index+1}`]);
        });


        return [


            this._createConstraints([[1, 'Turno1'], [1, 'Turno6']], '>=', 22),               // => Turno1 + Turno6 >= 22
            // Restrições de positividade para variaveis
            this._createConstraints([[1, 'Turno1']], '>=', 0),                               // => Turno1 >= 0
        ];
    }
}

const exercicio4 = new Exercicio04();
exercicio4.execute();


function generateRandomValues(numDeposits, numCustomers) {
    const depositArray = Array.from({ length: numDeposits }, (_, i) => "deposit_" + (i + 1));
    const customerArray = Array.from({ length: numCustomers }, (_, i) => "customer_" + (i + 1));

    const stock = {};
    const customerDemands = {};
    const transportationCost = {};

    depositArray.forEach(deposit => {
        stock[deposit] = Math.floor(Math.random() * 50) + 1;
    });

    customerArray.forEach(customer => {
        customerDemands[customer] = Math.floor(Math.random() * 50) + 1;
    });

    depositArray.forEach(deposit => {
        customerArray.forEach(customer => {
            const key = `${deposit}-->${customer}`;
            transportationCost[key] = Math.floor(Math.random() * 10) + 1;
        });
    });

    return {
        stock,
        customerDemands,
        transportationCost
    };
}