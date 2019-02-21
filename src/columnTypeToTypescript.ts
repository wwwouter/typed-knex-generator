export function columnTypeToTypescript(columnTypeName: string) {
    switch (columnTypeName) {
        case 'date':
            return 'string';
        case 'datetime':
            return 'string';
        case 'text':
            return 'string';
        case 'varchar':
            return 'string';
        case 'char':
            return 'string';
        case 'character varying':
            return 'string';
        case 'timestamp with time zone':
            return 'string';
        case 'timestamp without time zone':
            return 'string';
        case 'timestamp':
            return 'string';
        case 'uuid':
            return 'string';
        case 'float':
            return 'number';
        case 'integer':
            return 'number';
        case 'bigint':
            return 'number';
        case 'numeric':
            return 'number';
        case 'double precision':
            return 'number';
        case 'boolean':
            return 'boolean';
        case 'json':
            return 'any';
        case 'jsonb':
            return 'any';
        case 'USER-DEFINED':
            return 'any';
        default:
            throw new Error(`Unknuwn column type "${columnTypeName}"`);
    }
}
