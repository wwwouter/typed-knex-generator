import * as Knex from 'knex';
import { convertToEntities } from '../../src/convertToEntities';
import { converToFiles } from '../../src/convertToFiles';
// import { columnTypeToTypescript } from '../../src/columnTypeToTypescript';
import { getTableMetadata } from '../../src/getTableMetadata';
// import { } from '../testEntities';


describe('validateEntitiesTests', () => {

    it('should fail on empty database', async () => {

        const knex = Knex({
            client: 'sqlite3',
            useNullAsDefault: false,
            connection: { filename: ':memory:' },
        });

        await knex.schema.createTable('users', (table) => {
            table.uuid('id')
                .primary()
                .unique()
                .notNullable();
            table.string('name')
                .notNullable();
            table.string('optionalField');

        });

        const tablesMetadata = await getTableMetadata(knex);
        console.log('tablesMetadata: ', tablesMetadata);

        // const tables = await listTables(knex);
        // console.log('tables: ', tables);

        // const columnInfo = await knex(tables[0]).columnInfo();
        // console.log('columnInfo: ', columnInfo);

        // const primaryKeyName = await getPrimaryKeyName(knex, tables[0]);
        // console.log('primaryKeyName: ', primaryKeyName);

        // const columnsData = [];

        // const columnNames = Object.keys(columnInfo);
        // for (const columnName of columnNames) {
        //     columnsData.push({
        //         name: columnName,
        //         primary: columnName === primaryKeyName,
        //         typescriptType: columnTypeToTypescript((columnInfo as any)[columnName].type),
        //         isNullable: (columnInfo as any)[columnName].nullable,
        //     });
        // }

        const entities = convertToEntities(tablesMetadata, { entityNameConversion: { inflections: ['pascalCase', 'singular'] } });
        console.log('entities: ', entities);

        // const code = generateEntityCode(entities[0]);
        // console.log('code: ', code);

        const files = converToFiles(entities);
        console.log('files: ', files);



        // try {

        //     await validateEntities(knex);
        //     assert.isFalse(true);
        //     // tslint:disable-next-line:no-empty
        // } catch (_error) {

        // }

        knex.destroy();

    });
});
