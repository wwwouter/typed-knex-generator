


import * as Knex from 'knex';
import { IForeignKey } from './IForeignKey';

export async function getForeignKeys(knex: Knex, tableName: string): Promise<IForeignKey[]> {
    let query: string;
    let bindings = [] as string[];
    // let findResult = ((result: any) => result[0]) as ((result: any) => string | undefined);
    let transform = ((result: any) => result[0]) as ((result: any) => IForeignKey);

    switch (knex.client.constructor.name) {
        case 'Client_MSSQL':
            query = 'SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\' AND table_catalog = ?',
                bindings = [tableName];
            break;
        case 'Client_MySQL':
        case 'Client_MySQL2':
            query = 'SELECT table_name FROM information_schema.tables WHERE table_schema = ?';
            bindings = [tableName];
            break;
        case 'Client_Oracle':
        case 'Client_Oracledb':
            query = 'SELECT table_name FROM user_tables';
            break;
        case 'Client_PG':
            // tslint:disable-next-line:no-multiline-string
            query = `
                SELECT
                c.column_name, c.data_type
                FROM
                information_schema.table_constraints tc
                JOIN information_schema.constraint_column_usage AS ccu USING (constraint_schema, constraint_name)
                JOIN information_schema.columns AS c ON c.table_schema = tc.constraint_schema AND tc.table_name = c.table_name AND ccu.column_name = c.column_name
                where constraint_type = 'PRIMARY KEY' and tc.table_name = ?;
            `;
            bindings = [tableName];
            break;
        case 'Client_SQLite3':
            query = `PRAGMA foreign_key_list('${tableName}')`;

            // query = 'PRAGMA table_info(\'User\')';

            // bindings = [tableName];
            // tslint:disable-next-line:no-reserved-keywords
            transform = (input: { table: string, from: string, to: string }) => { return { tableName: input.table, fromColumn: input.from, toColumn: input.to } as IForeignKey; };
            break;
        default:
            throw new Error(`Clients "${knex.client.constructor.name}" not supported`);
    }

    const results = await knex.raw(query, bindings);
    // console.log('resultsFKKKKK: ', results);

    // const rows = results.rows ? results.rows : results;



    return results.map(transform); //  findResult(results);


}




