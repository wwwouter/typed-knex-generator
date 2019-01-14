// https://github.com/tgriesser/knex/issues/360#issuecomment-406483016
export interface IForeignKey {
    tableName: string;
    fromColumn: string;
    toColumn: string;
}
