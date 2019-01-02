
export interface IGeneratorConfig {
    entityNameConversion?: {
        inflections?: 'pascalCase' | 'camelCase' | 'singular' | 'plural' | string[]
    };

}
