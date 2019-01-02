
import * as Knex from 'knex';
import { getPrimaryKeyName } from './getPrimaryKeyName';
import { listTables } from './listTables';

export interface IColumnMetadata {
    name: string;
    primary: boolean;
    nullable: boolean;
    // tslint:disable-next-line:no-reserved-keywords
    type: string;
}

export interface ITableMetadata {
    name: string;
    columns: IColumnMetadata[];
}


export async function getTableMetadata(knex: Knex): Promise<ITableMetadata[]> {

    const result = [] as ITableMetadata[];


    const tables = await listTables(knex);
    for (const table of tables) {

        const tableMetadata = { name: table, columns: [] } as ITableMetadata;
        result.push(tableMetadata);

        const primaryKeyName = await getPrimaryKeyName(knex, table);

        const tableColumnInfo = await knex(table).columnInfo();
        const columnNames = Object.keys(tableColumnInfo);

        for (const columnName of columnNames) {
            tableMetadata.columns.push({
                name: columnName,
                primary: columnName === primaryKeyName,
                nullable: (tableColumnInfo as any)[columnName].nullable,
                type: (tableColumnInfo as any)[columnName].type,
            });
        }
    }
    // console.log('tables: ', tables);

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



    return result;
}
