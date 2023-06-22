
This script generates a CSV file with config from a JSON Akamai export for easy reading. 
It also includes a breakout of separate CSV files for each config item.

There are a few npm dependencies 
jmespath https://www.npmjs.com/package/jmespath
jsonexport https://www.npmjs.com/package/jsonexport

Instructions: 
Ensure node is installed - the package should work as is, but if not you may need to npm install the below.

npm i jsonexport
npm i jmespath

To use run: 
use the command below in a new folder with your Akamai JSON export file saved in it as akamai.json

$ node akamai-takeout.js

The combined output file is akamai-output.csv.
You'll also get individual exports of each config file and a combined CSV file with config from the source JSON file.

At this point I've included Children and Behaviors which are the two main config items. 

TODO: 
Output redirects/caching and other site config to terraform file for upload.
The long term goal here is to output Terraform files with CF mapped config where possible.

* This is very much a Version 1.0 :)