
let records = [];


// `parseAndSave(text)` is a function called with one argument `text`, the content of the babyname CSV file.
// It is invoked only once at the start of application.
// TODO: parse the csv text and save data records into the global variable `records` properly,
// so that the other functions use them with ease. After calling this function, `records` should
// contain the parsed data of every year like below.
//     e.g. records: [{year: 2001, rank: 1, name: "Jacob", gender: "M", rankChange: null},
//                    {year: 2001, rank: 2, name: "Michael", gender: "M", rankChange: null},
//                    ...]
// Note: a CSV text can end with trailing line-break character '\n'. Whether it exists or not, 
// the function should parse `text` correctly. Also, records should be stored in the same order
// in which they appear in a csv text. You can assume that at the first line is always a csv header.
function parseAndSave(text) {
    let re = /(\d{4}),(\d+),(\w+),([FM]),(-*\d*)/g;
    var myArr = [...text.matchAll(re)];
    records = myArr.map(record => {
        return {
            year: parseInt(record[1]), 
            rank: parseInt(record[2]), 
            name: record[3], 
            gender: record[4], 
            rankChange: record[5] == "" ? null : parseInt(record[5])}
        });
}


// `provideYearData(year)` is a function that receives a year and returns an array of data object corresponding to that year.
// Note that male and female record with the same rank should be joined together to form one object.
// TODO: return all data objects of a specific year, that are joined and organized by rank in an ascending order.
// The example of returned array is as follows.
//     e.g. [{rank: 1, male: "Jacob", maleRankChange: 0, female: "Isabella", femaleRankChange: 0},
//           {rank: 2, male: "Ethan", maleRankChange: 0, female: "Sophia", femaleRankChange: -2},    
//           ...,
//           {rank: 1000, male: "Keshawn", maleRankChange: 113, female: "Karley", femaleRankChange: 17}]
function provideYearData(year) {
    let yearRecords = [];
    const yearArr = records.filter( record => record.year === year );
    for(let i = 1; i <= yearArr.length/2; i++) {
        const rankArr = yearArr.filter( record => record.rank === i );
        male = rankArr[0].gender === "M" ? rankArr[0] : rankArr[1];
        female = rankArr[0].gender === "F" ? rankArr[0] : rankArr[1];
        yearRecords.push({
            rank: i,
            male: male.name,
            maleRankChange: male.rankChange,
            female: female.name,
            femaleRankChange: female.rankChange
        });
    }
    return yearRecords.sort((a, b) => a.rank - b.rank); // sort in ascending order of rank
}


// provideChartData(name, gender) is a function called when a user wants
// to see the chart showing the year-on-year change of rank of a specific name.
// TODO: return a list of all objects from 2001 to 2018 in the format of `{year: <year>, rank: <rank>}`
// of a specific name specified by the arguments, name and gender.
// If there are no records with the name and gender for some years,
// either you can set the values of the ranks to `undefined` or not return those records at all.
// The example of return data is as follow.
//     e.g. [{year: 2001, rank: undefined},
//           {year: 2002, rank: 613},
//           ...,
//           {year: 2018, rank: 380}]
// You can also return data excluding `undefined` value as below.
//     e.g. [{year: 2002, rank: 613},
//           ...,
//           {year: 2018, rank: 380}]
function provideChartData(name, gender) {
    let nameArr = records.filter( record => record.name === name & record.gender === gender );
    nameArr.sort((a, b) => a.year - b.year);
    return nameArr.map( record => { 
        return { 
            year: record.year, 
            rank: record.rank 
        }
    });
}


// `handleSignUpFormSubmit(form)` is called when a user submits the sign up form.
// `form` is the target HTML form element (L82~ in index.html).
// TODO: validate the form. (5 points)
function handleSignUpFormSubmit(form) {
    const fields = ['first-name', 'last-name', 'email', 'date-of-birth'];
    const fieldValues = fields.map ( field => form[field].value );

    // const regex = [/^[A-Z][a-z]+$/, /^[A-Z][a-z]+$/, /^[^\s@]+@[^\s\.@]+.[a-z]{2,3}$/, /^(19[0-9][0-9]|20[01][0-9]|2020)-(0[1-9]|[1][0-2])-([0-2][1-9]|[1-3]0|31)$/]; depending on interpretation
    const regex = [/^[A-Z][a-z]+$/, /^[A-Z][a-z]+$/, /^[^\s@]+@[^\s\.@]+.[A-Za-z]{2,3}$/, /^(19[0-9][0-9]|20[01][0-9]|2020)-(0[1-9]|[1][0-2])-([0-2][1-9]|[1-3]0|31)$/];
    const valid = [0, 1, 2, 3].map ( i => RegExp(regex[i]).test(fieldValues[i]) );

    const alertMessage = valid.includes(false) ? `You must correct:\n${valid[0] ? "" : "\nFirst Name"}${valid[1] ? "" : "\nLast Name"}${valid[2] ? "" : "\nEmail"}${valid[3] ? "" : "\nDate of Birth"}`
        : 'Successfully Submitted!';

    return {
        alertMessage: alertMessage, 
        validationResults: [
            {name: fields[0], valid: valid[0], message: valid[0] ? null : "Invalid first name"},
            {name: fields[1], valid: valid[1], message: valid[1] ? null : "Invalid last name"},
            {name: fields[2], valid: valid[2], message: valid[2] ? null : "Invalid email"},
            {name: fields[3], valid: valid[3], message: valid[3] ? null : "Invalid date of birth"}
        ]
    };
}
