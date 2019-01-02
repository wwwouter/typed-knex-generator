import * as changeCase from 'change-case';
import * as path from 'path';
import * as pluralize from 'pluralize';
import { columnTypeToTypescript } from './columnTypeToTypescript';
import { IColumnMetadata, ITableMetadata } from './getTableMetadata';
import { IGeneratorConfig } from './IGeneratorConfig';

export interface IPropertyMetadata {
    source: IColumnMetadata;
    typescriptType: string;
    propertyName: string;
}

export interface IEntityMetadata {
    properties: IPropertyMetadata[];
    source: ITableMetadata;
    tableName: string;
    className: string;
    classFilename: string;
    classFilePath: string;
    classFullFilename: string;
}



export function convertToEntities(tables: ITableMetadata[], config: IGeneratorConfig) {

    const result = [] as IEntityMetadata[];

    for (const table of tables) {

        if (config.ignoreTables) {
            if (config.ignoreTables.includes(table.name)) {
                continue;
            }
        }

        let className = table.name;

        if (config && config.entityNameConversion && config.entityNameConversion.inflections) {
            for (const inflection of config.entityNameConversion.inflections) {

                if ((changeCase as any)[inflection]) {
                    className = (changeCase as any)[inflection](className);
                } else if ((pluralize as any)[inflection]) {
                    className = (pluralize as any)[inflection](className);
                } else {
                    throw new Error(`Unknown inflection "${inflection}"`);
                }
            }
        }
        const entity = {
            source: table,
            properties: [],
            tableName: table.name,
            className: className,
            classFilename: className + '.ts',
            classFilePath: './',
            classFullFilename: path.join('./', className + '.ts'),
        } as IEntityMetadata;
        result.push(entity);

        for (const column of table.columns) {

            try {
                columnTypeToTypescript(column.type);
            } catch (_error) {
                console.log('config.ignoreTables: ', config.ignoreTables);
                console.log('table.name: ', table.name);
                if (config.ignoreTables) {
                    // if (config.ignoreTables.includes(table.name)) {
                    console.log('config.ignoreTables.includes(table.name): ', config.ignoreTables.includes(table.name));
                }
                throw new Error(`Cannot convert column type "${column.type}" of column ${table.name}.${column.name}`);
            }

            entity.properties.push({
                source: column,
                typescriptType: columnTypeToTypescript(column.type),
                propertyName: column.name,
            });
        }
    }

    return result;
}
