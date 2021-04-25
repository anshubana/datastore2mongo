#!/usr/bin/env node

import { Command } from 'commander';
import * as api from './migration';

const program = new Command();
program.version("0.0.1")
      .on('--help', function () {
            console.log('');
            console.log('  Info: This tool converts the data from GCP Datastore format to Mongodb format. ');
            console.log('');
            console.log('   1. Enviorment variable "GOOGLE_APPLICATION_CREDENTIALS" must be set with the path to the service account.');
            console.log('   2. If database name(Namespace) is only passed , then it will create a JSON file for each table(Kind) in database.');
            console.log('   3. If database name and collection name are both passed , then it will create a JSON file for the table in the database.');
            console.log('   4. Use mongoimport cli tool to import the data to Mongodb. Ref: https://docs.mongodb.com/database-tools/mongoimport/ ');
            console.log('');

            console.log('  Examples:');
            console.log('');
            console.log('    $ npm run app -- -d vm-service');
            console.log('    $ npm run app -- -d vm-service -c Projects');
            console.log('    $ npm run app -- --help');
            console.log('    $ mongoimport --host "localhost" --port "27017" --jsonArray --db "vm-service" --collection "Projects"  --file "Projects.json" ');
            console.log('');
      })
      .option('-d, --db <db>', 'database name')
      .option('-c, --collection <collection>', 'collection name')
      .action((options) => {
            if (options.db != null && options.collection != null) {
                  api.exportACollection(options.db, options.collection);
                  console.log()
            } else if (options.db != null) {
                  api.exportAllCollections(options.db);
                  
            } else {
                  console.log("<db> is the manditory arg. missing! 'npm run app -- --help' for more info/examples ")
            }
      })
program.parse(process.argv);


