function addCashFlowJSONs(cf1, cf2) {
    console.log('addCashFlowJSONs/Adding cash flows', cf1, cf2);
    // Check if the columns in both cash flows match
    if (Object.keys(cf1).length === 0) return cf2;
    if (Object.keys(cf2).length === 0) return cf1;

    if (JSON.stringify(cf1.columns) !== JSON.stringify(cf2.columns)) {
        throw new Error('Both cash flows must have matching columns.');
    }

    let timeToCF1Map = {};
    let timeToCF2Map = {};

    cf1.data.forEach(row => {
        timeToCF1Map[parseFloat(row[0])] = {
            payments: row[1],
            interest_to_pay: row[2],
            amort: row[3],
            balance: row[4]
        };
    });

    cf2.data.forEach(row => {
        timeToCF2Map[parseFloat(row[0])] = {
            payments: row[1],
            interest_to_pay: row[2],
            amort: row[3],
            balance: row[4]
        };
    });

    let combinedKeys = Object.keys(timeToCF1Map).concat(Object.keys(timeToCF2Map));
    //remove duplicates
    let uniqueKeys = combinedKeys.filter((value, index, self) => self.indexOf(value) === index);
    uniqueKeys.sort((a, b) => parseFloat(a) - parseFloat(b));
    //console.log("addCashFlowJSONs/uniqueKeys", uniqueKeys);

    let resultData = [];

    let dcts = [timeToCF1Map, timeToCF2Map];
    let ts = [
        Math.min(...Object.keys(timeToCF1Map).map(key => parseFloat(key))),
        Math.min(...Object.keys(timeToCF2Map).map(key => parseFloat(key)))
    ];
    
    //console.log("addCashFlowJSONs/min ts", ts);
    // expand the grid in the missing points
    for (let t = 0; t < uniqueKeys.length; t++){
        let time = uniqueKeys[t];
        let row = [parseFloat(time)];
        for (let i = 0; i < dcts.length; i++) {
            if (!dcts[i][time]) {
                let newRow = {
                    payments: 0,
                    interest_to_pay: 0,
                    amort: 0,
                    balance: ts[i] > time ? 0 : dcts[i][ts[i]].balance
                };
                //console.log(i, time, newRow);
                // Update the object directly, no push method needed
                dcts[i][time] = newRow;
            } else {
                ts[i] = time;
            }
        }
        row.push(dcts[0][time].payments + dcts[1][time].payments);
        row.push(dcts[0][time].interest_to_pay + dcts[1][time].interest_to_pay);
        row.push(dcts[0][time].amort + dcts[1][time].amort);
        row.push(dcts[0][time].balance + dcts[1][time].balance);
        resultData.push(row);
    }

    resultData.sort((a, b) => a[0] - b[0]);

    return {
        columns: cf1.columns,
        data: resultData
    };
}

function renderRaster(_raster, n = 1, translations = {}, curr = '$', sparse = true) {
    let raster;
    
    if (sparse) {
        raster = JSON.parse(JSON.stringify(sparseTable(_raster)));
    } else {
        raster = JSON.parse(JSON.stringify(_raster));
    }

    // cast n to number
    n = Number(n);
    console.log('renderRaster/Rendering raster', raster);
    if (!raster || !raster.data || !Array.isArray(raster.data) || raster.data.length === 0) {
        console.error('Invalid raster data');
        return;
    }

    const dollarColumns = ['interest_to_pay', 'amort', 'payments', 'balance'];
    let columnMapping = {
        "payments": translations["Payments"],
        "interest_to_pay": translations["Interest to Pay"],
        "amort": translations["Amortization"],
        "balance": translations["Outstanding Balance"],
        "amort_rate": translations["Amortization Rate"]
    };

    // Function to format numbers as currency
    function formatCurrency(value) {
        return curr + Number(value).toFixed(2); // Format the value as currency
    }
    

    // Modify column names and add new columns if needed
    let tIndex = raster.columns.indexOf('t');
    console.log('renderRaster/tIndex', tIndex);
    if (tIndex !== -1) {
        if (n === 12) { // Monthly
            raster.columns[tIndex] = translations['Year'];
            raster.columns.splice(tIndex + 1, 0, translations['Month']);
        } else if (n === 4) { // Quarterly
            raster.columns[tIndex] = translations['Year'];
            raster.columns.splice(tIndex + 1, 0, translations['Quarter']);
        } else { // Yearly or other
            raster.columns[tIndex] = translations['Year'];
        }
    }
    let timeUnit;
    // Process each row in raster.data
    console.log('renderRaster/n', n);
    raster.data = raster.data.map(row => {
        let newRow = [...row];
        if (tIndex !== -1) {
            if (newRow[tIndex] === '...') {
                return newRow;
            }
            let year = Math.floor(newRow[tIndex]);
            

            if (n === 1) { // Yearly
                newRow[tIndex] = year.toFixed(0);
            } else {
                let fractionalPart = newRow[tIndex] % 1;
                if (n === 12) { // Monthly
                    timeUnit = Math.round(fractionalPart * 12);
                    console.log('renderRaster/12');
                    console.log('renderRaster/fractionalPart', fractionalPart);
                    console.log('renderRaster/timeUnit', timeUnit);
                } else if (n === 4) { // Quarterly
                    timeUnit = Math.round(fractionalPart * 4);
                }
                
                newRow.splice(tIndex, 1, year.toFixed(0), timeUnit.toFixed(0));
            }
        }

        // Apply formatting to the 'amort_rate' column
        let amortRateIndex = raster.columns.indexOf('amort_rate');
        if (amortRateIndex !== -1) {
            let value = newRow[amortRateIndex];
            newRow[amortRateIndex] = (value !== null && !Number.isNaN(value)) ? (value * 100).toFixed(2) + '%' : '';
        }

        // Format dollar columns
        dollarColumns.forEach(column => {
            let columnIndex = raster.columns.indexOf(column);
            if (columnIndex !== -1 && newRow[columnIndex] !== null) {
                newRow[columnIndex] = formatCurrency(newRow[columnIndex]);
            }
        });

        return newRow;
    });

    // Rename columns based on columnMapping
    raster.columns = raster.columns.map(columnName => columnMapping[columnName] || columnName);

    console.log("renderRaster: raster", raster);
    return raster;
}

function applyToData(dataObject, lambda) {
    return dataObject.data.reduce((acc, row) => lambda(acc, row), lambda.initialValue);
}

// Define lambda functions for sum and min operations
const sumLambda = (acc, row) => acc + row[1];
sumLambda.initialValue = 0;

const minLambda = (acc, row) => Math.min(acc, row[1]);
minLambda.initialValue = Infinity;



// Now calculate the payback per buck
function paybackPerBuckLambda(dataObject){
    let totalPayments = applyToData(dataObject, sumLambda);
    let minimumPayment = applyToData(dataObject, minLambda);
    let paybackPerBuck = totalPayments !== 0 ? -(totalPayments - minimumPayment) / minimumPayment : 0;
    return paybackPerBuck;
}

function findMaxT(dataObject) {
    // Assuming dataObject.data is not empty and is sorted by 't'
    if(dataObject.data.length === 0) {
        return null; // or some other appropriate value to indicate empty data
    }
    let lastRow = dataObject.data[dataObject.data.length - 1];
    return lastRow[0]; // 't' is the first element in each row
}

function translateData(dataObject, column = "payments") {
    const columnIndex = dataObject.columns.indexOf(column);

    return dataObject.data.map(row => {
        return {
            t: row[dataObject.columns.indexOf("t")],
            [column]: row[columnIndex] // Dynamically set the key to the column name
        };
    });
}

function CF2dt(cf) {
    var datatable = [['t', 'V(t)', { role: "style" }]];
    cf.forEach(row => {
        var t = row['t'], val = row['payments'];
        var color = val < 0 ? "color:red;" : "color:green;";
        datatable.push([t, val, color]);
    });
    return datatable;
}

function NPV(cf, r) {
    var result = 0;
    cf.forEach(row => {
        var t = row['t'], val = row['payments'];
        result += val * Math.pow(1 + r, -t);
    });
    return result;
}

function EAPR(cf) {
    var fn = function(x) { return NPV(cf, x); }
    return find_root(fn, 0);
}

function fprime(f,x)
{
	h = 0.001;
	return (-f(x+2*h) + 8*f(x+h) - 8*f(x-h) +f(x-2*h))/(12*h);
	//return (f(x+h)-f(x-h))/(2*h);
}

function find_root(f,x0)
{
	eps=0.00001;
	var x = x0;
	var max_iter = 20;
	var counter = 0;
	while(Math.abs(f(x))>eps)
	{
		x=x - f(x)/fprime(f,x);
		counter+=1;
		if (counter>max_iter) return null;
	}	
	return x;
}

function addOutstandingBalance(cashFlowArray, outstandingBalance) {
    // Find the last element in the array
    let lastIndex = cashFlowArray.length - 1;

    // Add the outstanding balance to the last payment
    cashFlowArray[lastIndex].payments += outstandingBalance;

    return cashFlowArray;
}

function generatePFkpiTable(data) {
    let translatedData = translateData(data);
    let translatedBalanceData = translateData(data, 'balance');
    let lastIndex = translatedBalanceData.length - 1;

    // Extract the last balance value from the array
    let outstandingBalance = translatedBalanceData[lastIndex].balance;
    // Add the outstanding balance to the last payment
    translatedData[lastIndex].payments += outstandingBalance;

    //let ob = outstandingBalanceAsCF(data);
    //let translatedData = translateData(addCashFlowJSONs(data, ob));
    console.log('generatePFkpiTable/translatedData', translatedData);
      // Assuming the functions and data are already defined and calculated
    let eapr = EAPR(translatedData);
    //let eapr = EAPR(addCashFlowJSONs(translatedData, ob));
    let maxT = findMaxT(data);
    let paybackPerBuck = paybackPerBuckLambda(data);
    let interestToPay = applyToData(data, sumLambda);
    
    let dataForTable = {
        'EAPR:': `${(eapr * 100).toFixed(2)}%`,
        'Period:': `${maxT.toFixed(2)} years`,
        'Payback per $1': `\$${paybackPerBuck.toFixed(2)}`,
        'Interest to pay:': `\$${interestToPay.toFixed(2)}`
    };

    let table = '<table class="table table-sm table-hover">';
  
    for (let key in dataForTable) {
      table += `
        <tr>
          <td>${key}</td>
          <td>${dataForTable[key]}</td>
        </tr>
      `;
    }
  
    table += '</table>';
    return table;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { fprime, find_root, EAPR, addCashFlowJSONs, translateData, NPV, outstandingBalanceAsCF };
}