

export function columnTypeToTypescript(columnTypeName: string) {
    switch (columnTypeName) {
        case 'varchar': return 'string';
        case 'char': return 'string';
        default: throw new Error(`Unknuwn column type "${columnTypeName}"`);
    }
}