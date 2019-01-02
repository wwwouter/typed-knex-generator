
import * as Knex from 'knex';

// https://github.com/tgriesser/knex/issues/360#issuecomment-406483016

export async function listTables(knex: Knex): Promise<string[]> {
    let query: string;
    let bindings = [] as string[];


    switch (knex.client.constructor.name) {
        case 'Client_MSSQL':
            query = 'SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\' AND table_catalog = ?',
                bindings = [knex.client.database()];
            break;
        case 'Client_MySQL':
        case 'Client_MySQL2':
            query = 'SELECT table_name FROM information_schema.tables WHERE table_schema = ?';
            bindings = [knex.client.database()];
            break;
        case 'Client_Oracle':
        case 'Client_Oracledb':
            query = 'SELECT table_name FROM user_tables';
            break;
        case 'Client_PG':
            query = 'SELECT table_name FROM information_schema.tables WHERE table_schema = current_schema() AND table_catalog = ?';
            bindings = [knex.client.database()];
            break;
        case 'Client_SQLite3':
            query = "SELECT name AS table_name FROM sqlite_master WHERE type='table'";
            break;
        default:
            throw new Error(`Clients "${knex.client.constructor.name}" not supported`);
    }

    const results = await knex.raw(query, bindings);
    console.log('results: ', results);

    const rows = results.rows ? results.rows : results;

    return rows.map((row: any) => row.table_name);


}
