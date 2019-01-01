


import * as Knex from 'knex';

// https://github.com/tgriesser/knex/issues/360#issuecomment-406483016

export async function getPrimaryKeyName(knex: Knex, tableName: string) {
    let query: string;
    let bindings = [] as string[];
    let findResult = ((result: any) => result[0]) as ((result: any) => string | undefined);

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
                where constraint_type = 'PRIMARY KEY' and tc.table_name = ?;'
            `;
            bindings = [tableName];
            break;
        case 'Client_SQLite3':
            query = `PRAGMA table_info('${tableName}')`;

            // query = 'PRAGMA table_info(\'User\')';

            // bindings = [tableName];
            findResult = (result: { name: string, pk: number }[]) => result.filter(i => i.pk === 1).map(i => i.name).find(() => true);
            break;
        default:
            throw new Error(`Clients "${knex.client.constructor.name}" not supported`);
    }

    const results = await knex.raw(query, bindings);
    console.log('results: ', results);

    // const rows = results.rows ? results.rows : results;

    return findResult(results);


}




