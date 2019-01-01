import { assert } from 'chai';
import * as Knex from 'knex';
import { getPrimaryKeyName } from '../../src/getPrimaryKeyName';
import { listTables } from '../../src/listTables';
import { validateEntities } from '../../src/validateEntities';
import { } from '../testEntities';
import { generateEntity } from '../../src/generateEntity';
import { columnTypeToTypescript } from '../../src/columnTypeToTypescript';


describe('validateEntitiesTests', () => {

    it('should fail on empty database', async () => {

        const knex = Knex({
            client: 'sqlite3',
            useNullAsDefault: false,
            connection: { filename: ':memory:' },
        });

        await knex.schema.createTable('User', (table) => {
            table.uuid('id')
                .primary()
                .unique()
                .notNullable();
            table.string('name')
                .notNullable();
            table.string('optionalField');

        });

        const tables = await listTables(knex);
        console.log('tables: ', tables);

        const columnInfo = await knex(tables[0]).columnInfo();
        console.log('columnInfo: ', columnInfo);

        const primaryKeyName = await getPrimaryKeyName(knex, tables[0]);
        console.log('primaryKeyName: ', primaryKeyName);

        const columnsData = [];

        const columnNames = Object.keys(columnInfo);
        for (const columnName of columnNames) {
            columnsData.push({
                name: columnName,
                primary: columnName === primaryKeyName,
                typescriptType: columnTypeToTypescript((columnInfo as any)[columnName].type),
                isNullable: (columnInfo as any)[columnName].nullable,
            });
        }

        const code = generateEntity({ name: tables[0], columns: columnsData });
        console.log('code: ', code);



        try {

            await validateEntities(knex);
            assert.isFalse(true);
            // tslint:disable-next-line:no-empty
        } catch (_error) {

        }

        knex.destroy();

    });
});
