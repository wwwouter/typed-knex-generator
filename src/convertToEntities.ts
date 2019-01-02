import * as changeCase from 'change-case';
import * as path from 'path';
import * as pluralize from 'pluralize';
import { columnTypeToTypescript } from './columnTypeToTypescript';
import { IColumnMetadata, ITableMetadata } from './getTableMetadata';
import { IGeneratorConfig } from './IGeneratorConfig';
import { template } from 'lodash';

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


function inflect(text: string, inflections: string[]) {
    let result = text;
    for (const inflection of inflections) {

        if ((changeCase as any)[inflection]) {
            result = (changeCase as any)[inflection](result);
        } else if ((pluralize as any)[inflection]) {
            result = (pluralize as any)[inflection](result);
        } else {
            throw new Error(`Unknown inflection "${inflection}"`);
        }
    }
    return result;
}


export function convertToEntities(tables: ITableMetadata[], config: IGeneratorConfig) {

    const result = [] as IEntityMetadata[];

    let classFilePathTemplate;

    if (config && config.classFilePath) {
        classFilePathTemplate = template(config.classFilePath, { 'imports': { 'inflect': inflect } });
    }

    for (const table of tables) {

        if (config.ignoreTables) {
            if (config.ignoreTables.includes(table.name)) {
                continue;
            }
        }

        let className = table.name;

        if (config && config.entityNameConversion && config.entityNameConversion.inflections) {
            // for (const inflection of config.entityNameConversion.inflections) {

            //     if ((changeCase as any)[inflection]) {
            //         className = (changeCase as any)[inflection](className);
            //     } else if ((pluralize as any)[inflection]) {
            //         className = (pluralize as any)[inflection](className);
            //     } else {
            //         throw new Error(`Unknown inflection "${inflection}"`);
            //     }
            // }
            className = inflect(className, config.entityNameConversion.inflections);
        }

        const classFilename = className + '.ts';
        let classFilePath = './';

        if (classFilePathTemplate) {
            classFilePath = classFilePathTemplate({ tableName: table.name, className });
        }


        const entity = {
            source: table,
            properties: [],
            tableName: table.name,
            className: className,
            classFilename: classFilename,
            classFilePath: classFilePath,
            classFullFilename: path.join(classFilePath, classFilename),
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
