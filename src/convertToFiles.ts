import { IEntityMetadata } from './convertToEntities';
import { generateEntityCode } from './generateEntityCode';


interface IEntityFile {
    path: string;
    contents: string;
}

export function converToFiles(entities: IEntityMetadata[]): IEntityFile[] {

    const result = [] as IEntityFile[];

    for (const entity of entities) {
        const code = generateEntityCode(entity);
        result.push({ path: entity.classFullFilename, contents: code });
    }


    return result;
}
