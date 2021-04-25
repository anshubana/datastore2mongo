import { Datastore } from "@google-cloud/datastore";
import * as fse from 'fs-extra';


var scriptWriter = fse.createWriteStream('script.sh', {
  flags: 'a'
})

export async function exportACollection(dbname: string, collectionName: string) {
  let list: any = [];
  const datastore = new Datastore();
  const query = datastore.createQuery(dbname, collectionName);
  return new Promise<[]>((resolve, reject) => {
    query.run((err, entities, info) => {
      entities.forEach(entity => {
        let mongoPart1 = {
          "name": entity[datastore.KEY].name
        }
        let mongoEntity = Object.assign(mongoPart1, entity);
        list.push(mongoEntity);
      })
      resolve(list);
    });
  }).then(data => {
    let filepath: string = dbname + "/" + collectionName + ".json";
    let jdata = JSON.stringify(data);
    fse.outputFile(filepath, jdata);
    console.log(filepath + " is written to the root folder.");
    scriptWriter.write(' mongoimport --host localhost --port 27017 --jsonArray --db '+dbname+' --collection '+collectionName+' --file '+filepath+ ' && \n' );
  })
}
export async function exportAllCollections(dbname: string) {
  const datastore = new Datastore();
  const query = datastore.createQuery(dbname, '__kind__').select('__key__');
  const [entities] = await datastore.runQuery(query);
  const kinds = entities.map(entity => entity[datastore.KEY].name);
  console.log('Kinds:');
  console.log("Started.....");
  scriptWriter.write('#!/bin/bash');
  scriptWriter.write('\n');
  kinds.forEach( kind => {
    if (!kind.startsWith("__")) {
      exportACollection(dbname, kind);
    }
  });
  
}



