


import * as Knex from 'knex';
import { convertToEntities } from './convertToEntities';
import { converToFiles } from './convertToFiles';
import { getTableMetadata } from './getTableMetadata';


async function run() {
    console.log('Start generating');

    console.log('process.argv[2]: ', process.argv[2]);
    const a = require(process.argv[2]);
    console.log('a: ', a.knex);


    let knex = undefined as Knex | undefined;
    try {

        knex = Knex(a.knex);

        const tablesMetadata = await getTableMetadata(knex);
        console.log('tablesMetadata: ', tablesMetadata);

        const entities = convertToEntities(tablesMetadata, a.generator);
        console.log('entities: ', entities);


        const files = converToFiles(entities);
        console.log('files: ', files);

    } catch (error) {
        console.log(error);

    }
    if (knex !== undefined) {
        knex.destroy();
    }
}

run();


