

// import { Column, Entity } from '@wwwouter/typed-knex';

// @table('assets')
// export class Asset {
//     @column() public id: string;
// }


const imports = "import { Column, Entity } from '@wwwouter/typed-knex';\n";


interface ITableData {
    name: string;

    columns: { name: string, primary: boolean, typescriptType: string, isNullable: boolean }[];
}



export function generateEntity(tableData: ITableData) {

    let result = '';

    result += imports;

    result += `@Entity('${tableData.name}')\n`;
    result += `export class ${tableData.name} {\n`;
    for (const column of tableData.columns) {

        result += `@Column(${column.primary ? '{primary: true}' : ''}) public ${column.name}! : ${column.typescriptType}${column.isNullable ? '|null' : ''};\n`;
    }
    result += '}\n';

    return result;
}
