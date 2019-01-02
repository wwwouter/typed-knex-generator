
export interface IGeneratorConfig {
    entityNameConversion?: {
        inflections?: string[]
    };
    ignoreTables?: string[];
    classFilePath?: string;

}
