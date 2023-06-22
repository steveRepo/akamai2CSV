// Akamai JSON export tool 1.0
// Stephen Moylan
// This is a work in Progress.
//
// This script generates a list of files based on the Akamai JSON export which make for easy reading.
// 
// The long term goal is parse Akamai JSON config and map to Terraform where possible.  
// Plan is to start with redirects.
//
// There are a few npm dependencies 
// jmespath https://www.npmjs.com/package/jmespath
// jsonexport https://www.npmjs.com/package/jsonexport
//
//
// Instructions: Ensure node is installed and run:
// npm i jsonexport
// npm i jmespath
// 
// To use run: use the command below in a new folder with your Akamai JSON export file saved in it as akamai.json

// $ node akamai-takeout.js

// You'll also get individual exports of each config file.
//

// TODO: 
// output redirects/caching and other site config to terraform file for upload.



// Import Constants
var jmespath = require('jmespath');
const jsonexport = require('jsonexport');
const { devNull } = require('os');
const fs = require('fs');

// Input Files
let rawdata = fs.readFileSync('akamai.json');
let akamai = JSON.parse(rawdata);

// Show Running
console.log("Akamai JSON converter 1.0 - Stephen Moylan.");

// Get array lengths
let arrayChildrenLength = Object.keys(akamai.rules.children).length;
let arrayBehaviorLength = Object.keys(akamai.rules.behaviors).length;
let arrayVariablesLength = Object.keys(akamai.rules.variables).length;

// Set Counters
let fileCounter = 0;

// Set Array Variables
let arrayChildrenVar = "rules.children[" ;
let arrayBehaviorsVar = "rules.behaviors[" ;
let arrayVariablesVar = "rules.variables[" ;

// Run array exports
runArray(arrayChildrenLength, arrayChildrenVar);
runArray(arrayBehaviorLength, arrayBehaviorsVar);
runArray(arrayVariablesLength, arrayVariablesVar);

// Finally, once al the exports are complete, call to Combine CSV's
combineCsv();

// Main function to step through the exported array ------------------------------------------>)
function runArray(arrayLength, arrayVariable){
  for (step = 0 ; step <= arrayLength ; step ++) {
    let exportThisArray = jmespath.search(akamai, arrayVariable + step + ']' );
    var akNewArray = [];
    akNewArray.push(exportThisArray);
    exportItem(akNewArray);
  }
}

// Export ------------------------------------------>

// Write to CSV file and export
function exportItem(exportArray){
  const { writeFile } = require('fs/promises');
  async function writeToFile(fileName, data) {
    try {
      await writeFile(fileName, data);
      console.log(`Wrote data to ${fileName}`);
    } catch (error) {
      console.error(`Got an error trying to write the file: ${error.message}`);
    }
  }

  // Export Item
  jsonexport(exportArray, {fillGaps:'true'}, function(err, csv){
    if (err) return console.error(err);
    let fileOutput = "akamai-config-export-" + fileCounter + ".csv";
    fileCounter +=1
    writeToFile(fileOutput, csv);
  });

}

// Combine CSV ------------------------------------------>s

// Check file if akamai combined output CSV file is present and message. If not, output to CSV 
function combineCsv(){
  const akafile = 'akamai-output.csv';
  if (fs.existsSync(akafile)) {
    console.log('An akamai-output.csv already file exists. Please remove before conversion.');
  } else {
      const { exec } = require('child_process');
      exec('cat *.csv > akamai-output.csv', (err, stdout, stderr) => {
        console.log("Akamai export successful.\nYou can find the merged file in this directory: akamai-output.csv");
        if (err) {
          //some err occurred
          console.error(err)
        }
      });
  }
}


