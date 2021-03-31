var convert = require('convert-units');

/************************************************
 * Test Runner
 ***********************************************/

(function() {
    //testBurnTime();
})();


function trimUnit(str) {
    var arr = str.split(" ");
    return arr[0] * 1;
}

/************************************************
 * Volume
 ***********************************************/

// inputs:
// - "68 liters"
// - "1 liter"
function convertVolumeToL(str) {
    var arr = str.split(" ");
    return arr[0] * 1;
}

/************************************************
 * Mass (g, kg, oz, lb)
 ***********************************************/

// Weight
// 	- "2.5 ounces"
// 	- "4 lbs. 10 oz"
function convertWeightToOz(str) {
	var arr = str.split(" ");
	if (arr.length === 4) {
		var lbs = arr[0] * 1;
		var oz = arr[2] * 1;
		return convert(lbs).from('lb').to('oz') + oz;
	} else if (arr.length === 2) {
		return arr[0] * 1;
	} else {
		 throw new Error("Unable to parse weight str", str);
	}
}


/************************************************
 * Time (s, min, h)
 ***********************************************/

// BOIL TIME
// - "3 min. 30 sec."
function convertBoilTimeToS(str) {
    var arr = str.split(" ");
    var min = arr[0] * 1;
    var sec = arr[2] * 1;
    return convert(min).from('min').to('s') + sec;
}

// BURN TIME
// - "1 hr. 30 min. (8 oz. canister)"
// - "Approximately 60 minutes (8 oz. canister)"
// - "100g canister: 60 minutes"
//
// TODO: take into account canister size
function convertBurnTimeToMin(str) {
    var arr = str.split(" ");
    var timeMin = 0;

    // "100g canister: 60 minutes"
    if (str.includes(":")) {
        timeMin = arr[2] * 1;

    // "Approximately 60 minutes (8 oz. canister)"
    } else if (str.includes("Approximately")) {
        timeMin = arr[1] * 1;

    // "1 hr. 30 min. (8 oz. canister)"
    } else if (str.includes("hr.")) {
        var hr = arr[0] * 1;
        var min = arr[2] * 1;
        timeMin = convert(hr).from('h').to('min') + min;
    }
    return timeMin;
}


function testBurnTime() {
    const tests = [
        { in: "1 hr. 30 min. (8 oz. canister)", out: 90 },
        { in: "Approximately 60 minutes (8 oz. canister)", out: 60 },
        { in: "100g canister: 60 minutes", out: 60 },
    ];
    for (const test of tests) {
        var out = convertBurnTimeToMin(test.in);
        (out == test.out) ?
            console.log("✅", test.in) :
            console.log("❌", test.in);
    }
}


module.exports = {
    convertWeightToOz,
    convertVolumeToL,
    trimUnit,
};

