const { fprime, find_root, addCashFlowJSONs, EAPR, translateData, NPV} = require('../static/js/cf');

test('finds the root of a quadratic function correctly', () => {
    function f(x) { return x * x - 4; } // A simple quadratic function, root at x = 2

    expect(find_root(f, 3, fprime)).toBeCloseTo(2, 5); // Starting guess is 3, should converge to 2
});

test('finds the root of a simple quadratic function', () => {
    // Define a simple quadratic function with roots at x = ±2
    function f(x) { return x * x - 4; }

    // Assuming fprime is defined and accessible in the scope of find_root
    // Test with a starting guess near one of the roots
    expect(find_root(f, 3)).toBeCloseTo(2, 5); // Expect to be close to 2
});

test('test the sum of 2 CFs', () => {
    // Define a simple quadratic function with roots at x = ±2
    let cf1 = {columns: ["t", "payments", "interest_to_pay", "amort", "balance"], index: [0, 1], data: [[0, -1000, 0, 0, 1000], [1, 1100, 100, 1000, 0]]};
    let cf2 = {columns: ["t", "payments", "interest_to_pay", "amort", "balance"], index: [0, 1], data: [[0, -1000, 0, 0, 1000], [1, 1100, 100, 1000, 0]]};
    let cf12_sum = addCashFlowJSONs(cf1, cf2);
    let c12_sum_expected = {columns: ["t", "payments", "interest_to_pay", "amort", "balance"], index: [0, 1], data: [[0, -2000, 0, 0, 2000], [1, 2200, 200, 2000, 0]]};
    // Assuming fprime is defined and accessible in the scope of find_root
    // Test with a starting guess near one of the roots
    //expect(find_root(f, 3)).toBeCloseTo(2, 5); // Expect to be close to 2
    expect(cf12_sum.data).toEqual(c12_sum_expected.data);
    let cf3 = {columns: ["t", "payments", "interest_to_pay", "amort", "balance"], index: [0, 1], data: [[0, -1000, 0, 0, 1000], [2, 1100, 100, 1000, 0]]};
    let cf13_sum = addCashFlowJSONs(cf1, cf3);
    let c13_sum_expected = {columns: ["t", "payments", "interest_to_pay", "amort", "balance"], index: [0, 1]
                            , data: [[0, -2000, 0, 0, 2000], [1, 1100, 100, 1000, 1000], [2, 1100, 100, 1000, 0]]
                        };
    expect(cf13_sum.data).toEqual(c13_sum_expected.data);
    let cf31_sum = addCashFlowJSONs(cf3, cf1);
    expect(cf31_sum.data).toEqual(c13_sum_expected.data);
});

// write the test for `translateData` function
test('test `translateData` function', () => {
    let cf = {columns: ["t", "payments", "interest_to_pay", "amort", "balance"], index: [0, 1], data: [[0, -1000, 0, 0, 1000], [1, 1100, 100, 1000, 100]]};
    let tcf = translateData(cf);
    expect(tcf[1]['t']).toEqual(1);
    expect(tcf[1]['payments']).toEqual(1100);
    tcf = translateData(cf, 'balance');
    expect(tcf[1]['t']).toEqual(1);
    expect(tcf[1]['balance']).toEqual(100);

    }
);

test('test EAPR function with non-zero outstanding Balance', () => {
    // Define a simple quadratic function with roots at x = ±2
    let cf = {columns: ["t", "payments", "interest_to_pay", "amort", "balance"], index: [0, 1], data: [[0, -1000, 0, 0, 1000], [1, 1100, 100, 1000, 100]]};
    let tcf = translateData(cf);
    let ob = 
    //let ob = outstandingBalanceAsCF(translateData(cf, 'balance'));
    expect(ob).toEqual(100);
    //let ecf = addCashFlowJSONs(tcf, ob);
    //let eapr = EAPR(ecf);
    //expect(eapr).toBeCloseTo(0.1); // Expect to be close to 2

});

test('test NPV function', () => {
    let cf = {columns: ["t", "payments", "interest_to_pay", "amort", "balance"], data: [[0, -1000, 0, 0, 1000], [1, 1100, 100, 1000, 0]]};
    let npv = NPV(translateData(cf), .1);
    expect(npv).toBeCloseTo(0); // Expect to be close to 2
});