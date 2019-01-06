
export interface IGeneratorConfig {
    entityNameConversion?: {
        inflections?: string[];
        overrides?: {
            tableName: string;
            override: string;
        }[];
    };
    ignoreTables?: string[];
    classFilePath?: string;



}
