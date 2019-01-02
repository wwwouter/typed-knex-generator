


import * as fs from 'fs';
import * as getopts from 'getopts';
import * as Knex from 'knex';
import { convertToEntities } from './convertToEntities';
import { converToFiles } from './convertToFiles';
import { getTableMetadata } from './getTableMetadata';



async function run() {
    console.log('Start generating');
    const argv = getopts(process.argv.slice(2));

    const config = require(argv.config);


    let knex = undefined as Knex | undefined;
    try {

        knex = Knex(config.knex);

        const tablesMetadata = await getTableMetadata(knex);
        console.log('tablesMetadata: ', tablesMetadata);

        const entities = convertToEntities(tablesMetadata, config.generator);
        console.log('entities: ', entities);


        const files = converToFiles(entities);
        console.log('files: ', files);

        for (const file of files) {

            fs.writeFileSync(file.path, file.contents);
        }

    } catch (error) {
        console.log(error);

    }
    if (knex !== undefined) {
        knex.destroy();
    }
}

run();


