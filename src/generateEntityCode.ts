import { IEntityMetadata } from './convertToEntities';


// import { Column, Entity } from '@wwwouter/typed-knex';

// @table('assets')
// export class Asset {
//     @column() public id: string;
// }


const imports = "import { Column, Entity } from '@wwwouter/typed-knex';\n";


// interface ITableData {
//     name: string;

//     columns: { name: string, primary: boolean, typescriptType: string, isNullable: boolean }[];
// }

// starts specs? /:UP/some/[:LC]Controller/file.{full}.ts

// const options = {
//     entityNameConversion: {
//         change: 'signulirez',
//         casing: 'pascal',
//         overriddes: [
//             { from: 'Sheeple', to: 'Person' },
//         ],
//     },
// };


export function generateEntityCode(entityMetadata: IEntityMetadata) {

    let result = '';

    result += imports;

    for (const entityImport of entityMetadata.entitiesToImport) {
        result += `import ${entityImport.className} from './${entityImport.classFullFilename}')`;
    }

    result += `@Entity('${entityMetadata.tableName}')\n`;
    result += `export class ${entityMetadata.className} {\n`;
    for (const property of entityMetadata.properties) {

        result += `@Column(${property.source.primary ? '{primary: true}' : ''}) public ${property.propertyName}! : ${property.typescriptType}${property.source.nullable ? '|null' : ''};\n`;
    }
    result += '}\n';

    return result;
}
