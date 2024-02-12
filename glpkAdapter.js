const glpk = require('glpk.js')();

function options() {
    return {
        msglev: glpk.GLP_MSG_OFF,
        presol: true,
        meth: glpk.GLP_SIMPLEX,
        par_mip: true,
        tol_bnd: 1e-9,
        cb: {
            call: progress => console.log(progress),
            each: 1
        }
    };
}

function createInputData(vars, constraints, name) {
    return {
        name,
        objective: {
            direction: glpk.GLP_MAX,
            name: 'obj',
            vars
        },
        subjectTo: constraints
    };
};

function writeFormulation(input, options) {
    const formulation = glpk.write(input, options);

    console.log(formulation);
    console.log("\n");
};

function resolveProblem(input, options, descriptionOfZ = 'Z') {
    const computation = glpk.solve(input, options);

    console.log(descriptionOfZ, computation.result.z);
    console.log("\n");
};

function createConstraints(arr, operator, value) {
    const vars = [];
    arr.forEach(element => {
        vars.push(_createVars(element[1], element[0]))
    });

    return { vars, bnds: _createBnds(operator, value) }
};

function _createBnds(operator, value) {
    const type = operator == '<=' ? glpk.GLP_UP : glpk.GLP_LO;
    return { type, ub: value, lb: 0.0 }
};

function _createVars(name, value) {
    return { name, coef: value }
};

module.exports = {
    glpk,
    options,
    createInputData,
    writeFormulation,
    resolveProblem,
    createConstraints
}