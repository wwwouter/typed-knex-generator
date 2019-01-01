// tslint:disable:use-named-parameter
import * as flat from 'flat';
import * as Knex from 'knex';
import { getColumnInformation, getColumnProperties, getPrimaryKeyColumn, getTableMetadata } from './decorators';

export function unflatten(o: any): any {
    if (o instanceof Array) {
        return o.map((i) => unflatten(i));
    }
    return flat.unflatten(o);
}

export class TypedKnex {

    constructor(private knex: Knex) { }

    public query<T>(tableClass: new () => T): ITypedQueryBuilder<T, T> {
        return new TypedQueryBuilder<T, T>(tableClass, this.knex);
    }
}


let beforeInsertTransform = undefined as undefined | ((item: any, typedQueryBuilder: TypedQueryBuilder<{}, {}>) => any);

export function registerBeforeInsertTransform<T>(f: (item: T, typedQueryBuilder: TypedQueryBuilder<{}, {}>) => T) {
    beforeInsertTransform = f;
}


let beforeUpdateTransform = undefined as undefined | ((item: any, typedQueryBuilder: TypedQueryBuilder<{}, {}>) => any);

export function registerBeforeUpdateTransform<T>(f: (item: T, typedQueryBuilder: TypedQueryBuilder<{}, {}>) => T) {
    beforeUpdateTransform = f;
}


class NotImplementedError extends Error {
    constructor() {
        super('Not implemented');
    }


}

export interface ITypedQueryBuilder<Model, Row> {
    where: IWhere<Model, Row>;
    andWhere: IWhere<Model, Row>;
    orWhere: IWhere<Model, Row>;
    whereNot: IWhere<Model, Row>;
    selectColumn: ISelectWithFunctionColumn<Model, Row extends Model ? {} : Row>;
    selectColumns: ISelectWithFunctionColumns<Model, Row extends Model ? {} : Row>;

    orderBy: IOrderBy<Model, Row>;
    innerJoinColumn: IKeyFunctionAsParametersReturnQueryBuider<Model, Row>;
    leftOuterJoinColumn: IKeysAsParametersReturnQueryBuider<Model, Row>;

    whereColumn: IWhereCompareTwoColumns<Model, Row>;

    whereNull: IKeysAsParametersReturnQueryBuider<Model, Row>;
    whereNotNull: IKeysAsParametersReturnQueryBuider<Model, Row>;

    innerJoinTable: IJoinTable<Model, Row>;
    leftOuterJoinTable: IJoinTable<Model, Row>;

    leftOuterJoinTableOnFunction: IJoinTableMultipleOnClauses<Model, Row>;


    selectRaw: ISelectRaw<Model, Row extends Model ? {} : Row>;

    // findById: IFindById<ModelType, Row>;
    findByColumn: IFindByColumn<Model, Row extends Model ? {} : Row>;

    whereIn: IWhereIn<Model, Row>;
    whereNotIn: IWhereIn<Model, Row>;

    orWhereIn: IWhereIn<Model, Row>;
    orWhereNotIn: IWhereIn<Model, Row>;


    whereBetween: IWhereBetween<Model, Row>;
    whereNotBetween: IWhereBetween<Model, Row>;
    orWhereBetween: IWhereBetween<Model, Row>;
    orWhereNotBetween: IWhereBetween<Model, Row>;

    whereExists: IWhereExists<Model, Row>;

    orWhereExists: IWhereExists<Model, Row>;
    whereNotExists: IWhereExists<Model, Row>;
    orWhereNotExists: IWhereExists<Model, Row>;


    whereParentheses: IWhereParentheses<Model, Row>;

    groupBy: IKeyFunctionAsParametersReturnQueryBuider<Model, Row>;


    having: IHaving<Model, Row>;



    havingNull: IKeyFunctionAsParametersReturnQueryBuider<Model, Row>;
    havingNotNull: IKeyFunctionAsParametersReturnQueryBuider<Model, Row>;

    havingIn: IWhereIn<Model, Row>;
    havingNotIn: IWhereIn<Model, Row>;

    havingExists: IWhereExists<Model, Row>;
    havingNotExists: IWhereExists<Model, Row>;


    havingBetween: IWhereBetween<Model, Row>;
    havingNotBetween: IWhereBetween<Model, Row>;

    union: IUnion<Model, Row>;
    unionAll: IUnion<Model, Row>;

    min: IDbFunctionWithAlias<Model, Row extends Model ? {} : Row>;

    count: IDbFunctionWithAlias<Model, Row extends Model ? {} : Row>;
    countDistinct: IDbFunctionWithAlias<Model, Row extends Model ? {} : Row>;
    max: IDbFunctionWithAlias<Model, Row extends Model ? {} : Row>;
    sum: IDbFunctionWithAlias<Model, Row extends Model ? {} : Row>;
    sumDistinct: IDbFunctionWithAlias<Model, Row extends Model ? {} : Row>;
    avg: IDbFunctionWithAlias<Model, Row extends Model ? {} : Row>;
    avgDistinct: IDbFunctionWithAlias<Model, Row extends Model ? {} : Row>;

    clearSelect(): ITypedQueryBuilder<Model, Model>;
    clearWhere(): ITypedQueryBuilder<Model, Row>;
    clearOrder(): ITypedQueryBuilder<Model, Row>;


    limit(value: number): ITypedQueryBuilder<Model, Row>;
    offset(value: number): ITypedQueryBuilder<Model, Row>;

    firstItemOrNull(): Promise<Row | null>;
    firstItem(): Promise<Row>;
    list(): Promise<Row[]>;
    useKnexQueryBuilder(f: (query: Knex.QueryBuilder) => void): void;
    toQuery(): string;

    insert(newObject: Partial<Model>): Promise<void>;
    countResult(): Promise<number>;
    delByPrimaryKey(primaryKeyValue: any): Promise<void>;
    update(primaryKeyValue: any, item: Partial<Model>): Promise<void>;
    updateItems(items: { primaryKeyValue: any, data: Partial<Model> }[]): Promise<void>;

    insertItems(items: Partial<Model>[]): Promise<void>;



    whereRaw(sql: string, ...bindings: string[]): ITypedQueryBuilder<Model, Row>;
    havingRaw(sql: string, ...bindings: string[]): ITypedQueryBuilder<Model, Row>;


    transacting(trx: Knex.Transaction): void;


    truncate(): Promise<void>;
    distinct(): ITypedQueryBuilder<Model, Row>;


    clone(): ITypedQueryBuilder<Model, Row>;

    beginTransaction(): Promise<Knex.Transaction>;
    groupByRaw(sql: string, ...bindings: string[]): ITypedQueryBuilder<Model, Row>;

    // TBD
    // returningColumn(): void;
    // returningColumns(): void;
    // increment(): void;
    // decrement(): void;

}

export type TransformAll<T, IT> = {
    [Key in keyof T]: IT
};

export type FilterObjectsOnly<T> = { [K in keyof T]: T[K] extends object ? K : never }[keyof T];
export type FilterNonObjects<T> = { [K in keyof T]: T[K] extends object ? never : K }[keyof T];

export type ObjectToPrimitive<T> =
    T extends String ? string :
    T extends Number ? number :
    T extends Boolean ? boolean : never;

export type Operator = '=' | '!=' | '>' | '<' | string;



interface IConstructor<T> {
    new(...args: any[]): T;
}




export type AddPropertyWithType<Original, NewKey extends keyof TypeWithIndexerOf<NewKeyType>, NewKeyType> = Original & Pick<TypeWithIndexerOf<NewKeyType>, NewKey>;

interface IKeysAsArguments<Model, Return> {

    <K1 extends keyof Model, K2 extends keyof Model[K1], K3 extends keyof Model[K1][K2]>(key1: K1, key2: K2, key3: K3, ...keys: string[]): Return;
    <K1 extends keyof Model, K2 extends keyof Model[K1], K3 extends keyof Model[K1][K2]>(key1: K1, key2: K2, key3: K3): Return;
    <K1 extends keyof Model, K2 extends keyof Model[K1]>(key1: K1, key2: K2): Return;
    <K extends keyof Model>(key1: K): Return;

}

// tslint:disable-next-line:no-empty-interfaces
interface IKeysAsParametersReturnQueryBuider<Model, Row> extends IKeysAsArguments<Model, ITypedQueryBuilder<Model, Row>> {
}

// interface IJoinColumn<Model, Row> extends IKeysAsArguments<Model, ITypedQueryBuilder<Model, Row>> {

// }
// interface IJoinColumn<Model, Row> {
//     <K1 extends FilterObjectsOnly<Model>, K2 extends FilterObjectsOnly<Model[K1]>>(key1: K1, key2: K2, ...keys: string[]): ITypedQueryBuilder<Model, Row>;
//     <K1 extends FilterObjectsOnly<Model>, K2 extends FilterObjectsOnly<Model[K1]>>(key1: K1, key2: K2): ITypedQueryBuilder<Model, Row>;
//     <K extends FilterObjectsOnly<Model>>(key1: K): ITypedQueryBuilder<Model, Row>;

// }

export type TypeWithIndexerOf<T> = { [key: string]: T };

interface IJoinTable<Model, Row> {
    <NewPropertyType, NewPropertyKey extends keyof TypeWithIndexerOf<NewPropertyType>, L1K1 extends keyof AddPropertyWithType<Model, NewPropertyKey, NewPropertyType>, L2K1 extends keyof AddPropertyWithType<Model, NewPropertyKey, NewPropertyType>, L2K2 extends keyof AddPropertyWithType<Model, NewPropertyKey, NewPropertyType>[L2K1]>(newPropertyKey: NewPropertyKey, newPropertyClass: new () => NewPropertyType, column1: [L1K1] | [L2K1, L2K2], operator: Operator, column2: [L1K1] | [L2K1, L2K2]): ITypedQueryBuilder<AddPropertyWithType<Model, NewPropertyKey, NewPropertyType>, Row>;
}



interface IJoinOnClause<Model> {
    // <L1K1 extends keyof Model, L2K1 extends keyof Model, L2K2 extends keyof Model[L2K1]>(column1: [L1K1] | [L2K1, L2K2], operator: Operator, column2: [L1K1] | [L2K1, L2K2]): IJoinOnClause<Model>;
    // <L1K1 extends keyof Model, L2K1 extends keyof Model, L2K2 extends keyof Model[L2K1]>(column1: [L1K1] | [L2K1, L2K2], operator: Operator, column2: [L1K1] | [L2K1, L2K2]): IJoinOnClause<Model>;
    onColumns: <L1K1 extends keyof Model, L2K1 extends keyof Model, L2K2 extends keyof Model[L2K1]>(column1: [L1K1] | [L2K1, L2K2], operator: Operator, column2: [L1K1] | [L2K1, L2K2]) => IJoinOnClause<Model>;
    onNull: IKeysAsParametersReturnQueryBuider<Model, IJoinOnClause<Model>>;
}

// interface


// // tslint:disable-next-line:no-empty-interfaces
// interface IReferencedColumn {


// }
interface IJoinTableMultipleOnClauses<Model, Row> {
    // <NewPropertyType, NewPropertyKey extends keyof TypeWithIndexerOf<NewPropertyType>, L1K1 extends keyof AddPropertyWithType<Model, NewPropertyKey, NewPropertyType>, L2K1 extends keyof AddPropertyWithType<Model, NewPropertyKey, NewPropertyType>, L2K2 extends keyof AddPropertyWithType<Model, NewPropertyKey, NewPropertyType>[L2K1]>(newPropertyKey: NewPropertyKey, newPropertyClass: new () => NewPropertyType, column1: [L1K1] | [L2K1, L2K2], operator: Operator, column2: [L1K1] | [L2K1, L2K2]): ITypedQueryBuilder<AddPropertyWithType<Model, NewPropertyKey, NewPropertyType>, Row>;
    <NewPropertyType, NewPropertyKey extends keyof TypeWithIndexerOf<NewPropertyType>>(newPropertyKey: NewPropertyKey, newPropertyClass: new () => NewPropertyType, on: (join: IJoinOnClause<AddPropertyWithType<Model, NewPropertyKey, NewPropertyType>>) => void): ITypedQueryBuilder<AddPropertyWithType<Model, NewPropertyKey, NewPropertyType>, Row>;
}

// interface IWhereCompareTwoColumns<Model, Row> {

//     // (): { Left: () : { RIght: IKeysAsArguments<Model, ITypedQueryBuilder<Model, Row>> } };

//     // (): { left: IKeysAsArguments<Model, { right: IKeysAsArguments<Model, ITypedQueryBuilder<Model, Row>> }> };


//     <L1K1 extends keyof Model, L2K1 extends keyof Model, L2K2 extends keyof Model[L2K1]>(column1: [L1K1] | [L2K1, L2K2], operator: Operator, column2: [L1K1] | [L2K1, L2K2] | IReferencedColumn): ITypedQueryBuilder<Model, Row>;


// }



// NM extends AddPropertyWithType<Model, NewPropertyKey, NewPropertyType> werkt dat?

// function pluck2<T, K extends keyof IndexType<T>, TO>(names: K, newClass: new () => T, oldClass: new () => TO): Pick<IndexType<T>, K> & TO {
//     return {} as any;
// }

// interface IGroupBy<Model, Row> {
//     <K1 extends keyof Model, K2 extends keyof Model[K1], K3 extends keyof Model[K1][K2]>(key1: K1, key2: K2, key3: K3, ...keys: string[]): ITypedQueryBuilder<Model, Row>;
//     <K1 extends keyof Model, K2 extends keyof Model[K1], K3 extends keyof Model[K1][K2]>(key1: K1, key2: K2, key3: K3): ITypedQueryBuilder<Model, Row>;
//     <K1 extends keyof Model, K2 extends keyof Model[K1]>(key1: K1, key2: K2): ITypedQueryBuilder<Model, Row>;
//     <K extends keyof Model>(key1: K): ITypedQueryBuilder<Model, Row>;
// }


interface ISelectRaw<Model, Row> {
    <TReturn extends Boolean | String | Number, TName extends keyof TypeWithIndexerOf<TReturn>>(name: TName, returnType: IConstructor<TReturn>, query: string): ITypedQueryBuilder<Model, Pick<TypeWithIndexerOf<ObjectToPrimitive<TReturn>>, TName> & Row>;
}





// interface ISelectColumn<Model, Row> {
//     <K1 extends keyof Model, K2 extends keyof Model[K1], K3 extends keyof Model[K1][K2]>(key1: K1, key2: K2, key3: K3, ...keys: string[]): ITypedQueryBuilder<Model, TransformAll<Pick<Model, K1>, TransformAll<Pick<Model[K1], K2>, TransformAll<Pick<Model[K1][K2], K3>, any>>> & Row>;
//     <K1 extends keyof Model, K2 extends keyof Model[K1], K3 extends keyof Model[K1][K2]>(key1: K1, key2: K2, key3: K3): ITypedQueryBuilder<Model, TransformAll<Pick<Model, K1>, TransformAll<Pick<Model[K1], K2>, Pick<Model[K1][K2], K3>>> & Row>;
//     <K1 extends keyof Model, K2 extends keyof Model[K1]>(key1: K1, key2: K2): ITypedQueryBuilder<Model, TransformAll<Pick<Model, K1>, Pick<Model[K1], K2>> & Row>;
//     <K extends keyof Model>(key1: K): ITypedQueryBuilder<Model, Pick<Model, K> & Row>;
// }


interface IColumnFunctionReturnNewRow<Model> {
    <K1 extends keyof Model, K2 extends keyof Model[K1], K3 extends keyof Model[K1][K2]>(key1: K1, key2: K2, key3: K3, ...keys: string[]): TransformAll<Pick<Model, K1>, TransformAll<Pick<Model[K1], K2>, TransformAll<Pick<Model[K1][K2], K3>, any>>>;
    <K1 extends keyof Model, K2 extends keyof Model[K1], K3 extends keyof Model[K1][K2]>(key1: K1, key2: K2, key3: K3): TransformAll<Pick<Model, K1>, TransformAll<Pick<Model[K1], K2>, Pick<Model[K1][K2], K3>>>;
    <K1 extends keyof Model, K2 extends keyof Model[K1]>(key1: K1, key2: K2): TransformAll<Pick<Model, K1>, Pick<Model[K1], K2>>;
    <K extends keyof Model>(key1: K): Pick<Model, K>;
}

export type Lit = string | number | boolean | undefined | null | void | {};
export const tuple = <T extends Lit[]>(...args: T) => args;


export type ListOfFunc<Model> = IColumnFunctionReturnNewRow<Model> | IColumnFunctionReturnNewRow<Model>;

export function a(i: [string, string?]) {
    return i;
}


interface IColumnFunctionReturnPropertyType<Model> {
    <K1 extends keyof Model, K2 extends keyof Model[K1], K3 extends keyof Model[K1][K2]>(key1: K1, key2: K2, key3: K3, ...keys: string[]): any;
    <K1 extends keyof Model, K2 extends keyof Model[K1], K3 extends keyof Model[K1][K2]>(key1: K1, key2: K2, key3: K3): Model[K1][K2][K3];
    <K1 extends keyof Model, K2 extends keyof Model[K1]>(key1: K1, key2: K2): Model[K1][K2];
    <K extends keyof Model>(key1: K): Model[K];
}



interface IColumnFunctionReturnColumnName<Model> {
    <K1 extends keyof Model, K2 extends keyof Model[K1], K3 extends keyof Model[K1][K2]>(key1: K1, key2: K2, key3: K3, ...keys: string[]): string;
    <K1 extends keyof Model, K2 extends keyof Model[K1], K3 extends keyof Model[K1][K2]>(key1: K1, key2: K2, key3: K3): string;
    <K1 extends keyof Model, K2 extends keyof Model[K1]>(key1: K1, key2: K2): string;
    <K extends keyof Model>(key1: K): string;
}

interface ISelectWithFunctionColumn<Model, Row> {
    <NewRow>(selectColumnFunction: (c: IColumnFunctionReturnNewRow<Model>) => NewRow): ITypedQueryBuilder<Model, Row & NewRow>;
}

interface IOrderBy<Model, Row> {
    <NewRow>(selectColumnFunction: (c: IColumnFunctionReturnNewRow<Model>) => NewRow, direction?: 'asc' | 'desc'): ITypedQueryBuilder<Model, Row>;
}


interface IDbFunctionWithAlias<Model, Row> {
    <NewPropertyType, TName extends keyof TypeWithIndexerOf<NewPropertyType>>(selectColumnFunction: (c: IColumnFunctionReturnPropertyType<Model>) => NewPropertyType, name: TName): ITypedQueryBuilder<Model, Pick<TypeWithIndexerOf<ObjectToPrimitive<NewPropertyType>>, TName> & Row>;
}




interface ISelectWithFunctionColumns<Model, Row> {
    <R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R11, R12, R13, R14, R15, R16, R17, R18, R19>(selectColumnFunction: [
        ((c: IColumnFunctionReturnNewRow<Model>) => R1),
        ((c: IColumnFunctionReturnNewRow<Model>) => R2)?,
        ((c: IColumnFunctionReturnNewRow<Model>) => R3)?,
        ((c: IColumnFunctionReturnNewRow<Model>) => R4)?,
        ((c: IColumnFunctionReturnNewRow<Model>) => R5)?,
        ((c: IColumnFunctionReturnNewRow<Model>) => R6)?,
        ((c: IColumnFunctionReturnNewRow<Model>) => R7)?,
        ((c: IColumnFunctionReturnNewRow<Model>) => R8)?,
        ((c: IColumnFunctionReturnNewRow<Model>) => R9)?,
        ((c: IColumnFunctionReturnNewRow<Model>) => R10)?,
        ((c: IColumnFunctionReturnNewRow<Model>) => R11)?,
        ((c: IColumnFunctionReturnNewRow<Model>) => R12)?,
        ((c: IColumnFunctionReturnNewRow<Model>) => R13)?,
        ((c: IColumnFunctionReturnNewRow<Model>) => R14)?,
        ((c: IColumnFunctionReturnNewRow<Model>) => R15)?,
        ((c: IColumnFunctionReturnNewRow<Model>) => R16)?,
        ((c: IColumnFunctionReturnNewRow<Model>) => R17)?,
        ((c: IColumnFunctionReturnNewRow<Model>) => R18)?,
        ((c: IColumnFunctionReturnNewRow<Model>) => R19)?
    ]): ITypedQueryBuilder<Model, Row & R1 & R2 & R3 & R4 & R5 & R6 & R7 & R8 & R8 & R9 & R10 & R11 & R12 & R13 & R14 & R15 & R16 & R17 & R18 & R18 & R19>;
    // <NewRow>(selectColumnFunction: [((c: IColumnFunctionReturnNewRow<Model>) => NewRow)]): ITypedQueryBuilder<Model, Row & NewRow>;
}



interface IFindByColumn<Model, Row> {
    <PropertyType, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R11, R12, R13, R14, R15, R16, R17, R18, R19>(
        whereColumnFunction: (c: IColumnFunctionReturnPropertyType<Model>) => PropertyType,
        value: PropertyType,
        selectColumnFunctions: [
            ((c: IColumnFunctionReturnNewRow<Model>) => R1),
            ((c: IColumnFunctionReturnNewRow<Model>) => R2)?,
            ((c: IColumnFunctionReturnNewRow<Model>) => R3)?,
            ((c: IColumnFunctionReturnNewRow<Model>) => R4)?,
            ((c: IColumnFunctionReturnNewRow<Model>) => R5)?,
            ((c: IColumnFunctionReturnNewRow<Model>) => R6)?,
            ((c: IColumnFunctionReturnNewRow<Model>) => R7)?,
            ((c: IColumnFunctionReturnNewRow<Model>) => R8)?,
            ((c: IColumnFunctionReturnNewRow<Model>) => R9)?,
            ((c: IColumnFunctionReturnNewRow<Model>) => R10)?,
            ((c: IColumnFunctionReturnNewRow<Model>) => R11)?,
            ((c: IColumnFunctionReturnNewRow<Model>) => R12)?,
            ((c: IColumnFunctionReturnNewRow<Model>) => R13)?,
            ((c: IColumnFunctionReturnNewRow<Model>) => R14)?,
            ((c: IColumnFunctionReturnNewRow<Model>) => R15)?,
            ((c: IColumnFunctionReturnNewRow<Model>) => R16)?,
            ((c: IColumnFunctionReturnNewRow<Model>) => R17)?,
            ((c: IColumnFunctionReturnNewRow<Model>) => R18)?,
            ((c: IColumnFunctionReturnNewRow<Model>) => R19)?
        ]
    ): Promise<Row & R1 & R2 & R3 & R4 & R5 & R6 & R7 & R8 & R8 & R9 & R10 & R11 & R12 & R13 & R14 & R15 & R16 & R17 & R18 & R18 & R19 | void>; // ITypedQueryBuilder<Model, Row & R1 & R2 & R3 & R4 & R5 & R6 & R7 & R8 & R8 & R9 & R10 & R11 & R12 & R13 & R14 & R15 & R16 & R17 & R18 & R18 & R19>;
}



// interface ISelectColumns<Model, Row> {
//     <Prev extends Row, K1 extends FilterObjectsOnly<Model>, K2 extends FilterNonObjects<Model[K1]>>(key1: K1, keys2: K2[]): ITypedQueryBuilder<Model, TransformAll<Pick<Model, K1>, Pick<Model[K1], K2>> & Prev>;
//     <K extends FilterNonObjects<Model>>(keys: K[]): ITypedQueryBuilder<Model, Pick<Model, K> & Row>;
// }


// interface ISelectColumns<Model, Row> {
//     <Prev extends Row, K1 extends FilterObjectsOnly<Model>, K2 extends FilterNonObjects<Model[K1]>>(key1: K1, keys2: K2[]): ITypedQueryBuilder<Model, TransformAll<Pick<Model, K1>, Pick<Model[K1], K2>> & Prev>;
//     <K extends FilterNonObjects<Model>>(keys: K[]): ITypedQueryBuilder<Model, Pick<Model, K> & Row>;
// }

interface IKeyFunctionAsParametersReturnQueryBuider<Model, Row> {
    (selectColumnFunction: (c: IColumnFunctionReturnNewRow<Model>) => void): ITypedQueryBuilder<Model, Row>;
}





// interface IKeysAsArguments<Model, Return> {

//     <K1 extends keyof Model, K2 extends keyof Model[K1], K3 extends keyof Model[K1][K2]>(key1: K1, key2: K2, key3: K3, ...keys: string[]): Return;
//     <K1 extends keyof Model, K2 extends keyof Model[K1], K3 extends keyof Model[K1][K2]>(key1: K1, key2: K2, key3: K3): Return;
//     <K1 extends keyof Model, K2 extends keyof Model[K1]>(key1: K1, key2: K2): Return;
//     <K extends keyof Model>(key1: K): Return;

// }

// // tslint:disable-next-line:no-empty-interfaces
// interface IKeyFunctionAsParametersReturnQueryBuider<Model, Row> extends IKeysAsArguments<Model, ITypedQueryBuilder<Model, Row>> {
// }




// interface IReferenceColumn<Model> {
//     <K1 extends keyof Model, K2 extends keyof Model[K1], K3 extends keyof Model[K1][K2]>(key1: K1, key2: K2, key3: K3, ...keys: string[]): IReferencedColumn;
//     <K1 extends keyof Model, K2 extends keyof Model[K1], K3 extends keyof Model[K1][K2]>(key1: K1, key2: K2, key3: K3): IReferencedColumn;
//     <K1 extends keyof Model, K2 extends keyof Model[K1]>(key1: K1, key2: K2): IReferencedColumn;
//     <K extends keyof Model>(key1: K): IReferencedColumn;
// }




// interface IFindById<Model, Row> {
//     <Prev extends Row, K1 extends FilterObjectsOnly<Model>, K2 extends FilterNonObjects<Model[K1]>>(id: string, key1: K1, keys2: K2[]): Promise<TransformAll<Pick<Model, K1>, Pick<Model[K1], K2>> & Prev | void>;
//     <K extends FilterNonObjects<Model>>(id: string, keys: K[]): Promise<Pick<Model, K> & Row | void>;
// }





interface IWhere<Model, Row> {
    <PropertyType>(selectColumnFunction: (c: IColumnFunctionReturnPropertyType<Model>) => PropertyType, value: PropertyType): ITypedQueryBuilder<Model, Row>;
}


interface IWhereIn<Model, Row> {
    <PropertyType>(selectColumnFunction: (c: IColumnFunctionReturnPropertyType<Model>) => PropertyType, values: PropertyType[]): ITypedQueryBuilder<Model, Row>;
}


interface IWhereBetween<Model, Row> {
    <PropertyType>(selectColumnFunction: (c: IColumnFunctionReturnPropertyType<Model>) => PropertyType, range: [PropertyType, PropertyType]): ITypedQueryBuilder<Model, Row>;
}



interface IHaving<Model, Row> {
    <PropertyType>(selectColumnFunction: (c: IColumnFunctionReturnPropertyType<Model>) => PropertyType, operator: Operator, value: PropertyType): ITypedQueryBuilder<Model, Row>;

    // <K extends FilterNonObjects<Model>>(key1: K, operator: Operator, value: Model[K]): ITypedQueryBuilder<Model, Row>;
    // <K1 extends keyof Model, K2 extends FilterNonObjects<Model[K1]>>(key1: K1, key2: K2, operator: Operator, value: Model[K1][K2]): ITypedQueryBuilder<Model, Row>;
    // <K1 extends keyof Model, K2 extends keyof Model[K1], K3 extends FilterNonObjects<Model[K1][K2]>>(key1: K1, key2: K2, key3: K3, operator: Operator, value: Model[K1][K2][K3]): ITypedQueryBuilder<Model, Row>;
    // <K1 extends keyof Model, K2 extends keyof Model[K1], K3 extends keyof Model[K1][K2]>(key1: K1, key2: K2, key3: K3, ...keysOperratorAndValue: any[]): ITypedQueryBuilder<Model, Row>;
}



interface IWhereCompareTwoColumns<Model, Row> {


    <PropertyType1, PropertyType2, Model2>(selectColumn1Function: (c: IColumnFunctionReturnPropertyType<Model>) => PropertyType1, operator: Operator, selectColumn2Function: ((c: IColumnFunctionReturnPropertyType<Model2>) => PropertyType2) | string): ITypedQueryBuilder<Model, Row>;

    // (): { Left: () : { RIght: IKeysAsArguments<Model, ITypedQueryBuilder<Model, Row>> } };

    // (): { left: IKeysAsArguments<Model, { right: IKeysAsArguments<Model, ITypedQueryBuilder<Model, Row>> }> };


    // <L1K1 extends keyof Model, L2K1 extends keyof Model, L2K2 extends keyof Model[L2K1]>(column1: [L1K1] | [L2K1, L2K2], operator: Operator, column2: [L1K1] | [L2K1, L2K2] | IReferencedColumn): ITypedQueryBuilder<Model, Row>;


}






// interface IWhereBetween<Model, Row> {
//     <K extends FilterNonObjects<Model>>(key1: K, range: [Model[K], Model[K]]): ITypedQueryBuilder<Model, Row>;
//     <K1 extends keyof Model, K2 extends FilterNonObjects<Model[K1]>>(key1: K1, key2: K2, range: [Model[K1][K2], Model[K1][K2]]): ITypedQueryBuilder<Model, Row>;
//     <K1 extends keyof Model, K2 extends keyof Model[K1], K3 extends FilterNonObjects<Model[K1][K2]>>(key1: K1, key2: K2, key3: K3, range: [Model[K1][K2][K3], Model[K1][K2][K3]]): ITypedQueryBuilder<Model, Row>;
//     <K1 extends keyof Model, K2 extends keyof Model[K1], K3 extends keyof Model[K1][K2]>(key1: K1, key2: K2, key3: K3, ...keysAndValues: any[]): ITypedQueryBuilder<Model, Row>;
// }


interface IWhereExists<Model, Row> {
    <SubQueryModel>(subQueryModel: new () => SubQueryModel, code: (subQuery: ITypedQueryBuilder<SubQueryModel, {}>, parent: IColumnFunctionReturnColumnName<Model>) => void): ITypedQueryBuilder<Model, Row>;
}

interface IWhereParentheses<Model, Row> {
    (code: (subQuery: ITypedQueryBuilder<Model, Row>) => void): ITypedQueryBuilder<Model, Row>;
}

interface IUnion<Model, Row> {
    <SubQueryModel>(subQueryModel: new () => SubQueryModel, code: (subQuery: ITypedQueryBuilder<SubQueryModel, {}>) => void): ITypedQueryBuilder<Model, Row>;
}




export class TypedQueryBuilder<ModelType, Row = {}> implements ITypedQueryBuilder<ModelType, Row> {
    public columns: { name: string; }[];

    private queryBuilder: Knex.QueryBuilder;
    private tableName: string;
    private extraJoinedProperties: { name: string, propertyType: new () => any }[];

    constructor(private tableClass: new () => ModelType, private knex: Knex, queryBuilder?: Knex.QueryBuilder) {
        this.tableName = getTableMetadata(tableClass).tableName;
        this.columns = getColumnProperties(tableClass);

        if (queryBuilder !== undefined) {
            this.queryBuilder = queryBuilder;
            this.queryBuilder.from(this.tableName);
        } else {
            this.queryBuilder = this.knex.from(this.tableName);
        }


        this.extraJoinedProperties = [];
    }

    public async delByPrimaryKey(value: any) {
        const primaryKeyColumnInfo = getPrimaryKeyColumn(this.tableClass);

        await this.queryBuilder.del().where(primaryKeyColumnInfo.name, value);
    }

    public async insert(newObject: Partial<ModelType>) {
        await this.insertItems([newObject]);
    }

    public async insertItems(items: Partial<ModelType>[]) {
        items = [...items];

        for (let item of items) {

            if (beforeInsertTransform) {
                item = beforeInsertTransform(item, this);
            }
        }

        while (items.length > 0) {
            const chunk = items.splice(0, 500);
            await this.knex.from(this.tableName).insert(chunk);
        }
    }

    public async update(primaryKeyValue: any, item: Partial<ModelType>) {
        if (beforeUpdateTransform) {
            item = beforeUpdateTransform(item, this);
        }

        const primaryKeyColumnInfo = getPrimaryKeyColumn(this.tableClass);

        await this.queryBuilder.update(item).where(primaryKeyColumnInfo.name, primaryKeyValue);
    }

    public async updateItems(items: { primaryKeyValue: any, data: Partial<ModelType> }[]) {

        const primaryKeyColumnInfo = getPrimaryKeyColumn(this.tableClass);

        items = [...items];
        while (items.length > 0) {
            const chunk = items.splice(0, 500);

            let sql = '';
            for (const item of chunk) {
                const query = this.knex.from(this.tableName);
                if (beforeUpdateTransform) {
                    item.data = beforeUpdateTransform(item.data, this);
                }
                query.update(item.data);
                sql += query.where(primaryKeyColumnInfo.name, item.primaryKeyValue).toString().replace('?', '\\?') + ';\n';
            }


            await this.knex.raw(sql);
        }
    }

    public limit(value: number) {
        this.queryBuilder.limit(value);
        return this as any;
    }

    public offset(value: number) {
        this.queryBuilder.offset(value);
        return this as any;
    }

    public async findById(id: string, columns: (keyof ModelType)[]) {
        return await this.queryBuilder.select(columns as any).where(this.tableName + '.id', id).first();
    }

    public async countResult() {
        const query = this.queryBuilder.count();
        const result = await query;
        if (result.length === 0) {
            return 0;
        }
        return result[0].count;
    }


    public async firstItemOrNull() {
        const items = await this.queryBuilder;
        if (!items || items.length === 0) {
            return null;
        }
        return unflatten(items[0]);
    }


    public async firstItem() {
        const items = await this.queryBuilder;
        if (!items || items.length === 0) {
            throw new Error('Item not found.');
        }
        return unflatten(items[0]);
    }

    // public selectColumn() {
    //     if (arguments.length === 1) {
    //         this.queryBuilder.select(this.getColumnName(arguments[0]) + ' as ' + arguments[0]);
    //     } else {

    //         this.queryBuilder.select(this.getColumnName(...arguments) + ' as ' + this.getColumnSelectAlias(...arguments));
    //     }
    //     return this as any;
    // }

    public selectColumn() {
        let calledArguments = [] as string[];

        function saveArguments(...args: string[]) {
            calledArguments = args;
        }

        arguments[0](saveArguments);

        this.queryBuilder.select(this.getColumnName(...calledArguments) + ' as ' + this.getColumnSelectAlias(...calledArguments));

        return this as any;
    }

    public selectColumns() {

        const functions = arguments[0];

        for (const f of functions) {
            (this.selectColumn as any)(f);
            // const args = this.getArgumentsFromColumnFunction(f);

            // if (args.length === 1) {
            //     this.queryBuilder.select(this.getColumnName(key));
            // } else {

            //     this.queryBuilder.select(this.getColumnName(arguments[0], key) + ' as ' + this.getColumnSelectAlias(arguments[0], key));
            // }
        }

        // const argumentsKeys = arguments[arguments.length - 1];
        // for (const key of argumentsKeys) {
        //     if (arguments.length === 1) {
        //         this.queryBuilder.select(this.getColumnName(key));
        //     } else {

        //         this.queryBuilder.select(this.getColumnName(arguments[0], key) + ' as ' + this.getColumnSelectAlias(arguments[0], key));
        //     }
        // }
        return this as any;
    }


    public orderBy() {
        // if (arguments.length === 1) {
        this.queryBuilder.orderBy(this.getColumnNameWithoutAliasFromFunction(arguments[0]), arguments[1]);
        // } else {

        //     this.queryBuilder.orderBy(this.getColumnSelectAlias(...arguments));
        // }
        return this as any;
    }

    public async list() {
        const items = await this.queryBuilder;
        return unflatten(items) as Row[];
    }

    public selectRaw() {
        const name = arguments[0];
        const query = arguments[2];

        this.queryBuilder.select(this.knex.raw(`(${query}) as "${name}"`));
        return this as any;
    }

    public innerJoinColumn() {
        return this.joinColumn('innerJoin', arguments[0]);
    }
    public leftOuterJoinColumn() {
        return this.joinColumn('leftOuterJoin', arguments[0]);
    }

    public innerJoinTable() {
        const newPropertyKey = arguments[0];
        const newPropertyType = arguments[1];
        const column1Parts = arguments[2];
        const operator = arguments[3];
        const column2Parts = arguments[4];

        this.extraJoinedProperties.push({ name: newPropertyKey, propertyType: newPropertyType });

        const tableToJoinClass = newPropertyType;
        const tableToJoinName = getTableMetadata(tableToJoinClass).tableName;
        const tableToJoinAlias = newPropertyKey;

        const table1Column = this.getColumnName(...column1Parts);
        const table2Column = this.getColumnName(...column2Parts);

        this.queryBuilder.innerJoin(`${tableToJoinName} as ${tableToJoinAlias}`, table1Column, operator, table2Column);

        return this;
    }

    public leftOuterJoinTableOnFunction() {
        const newPropertyKey = arguments[0];
        const newPropertyType = arguments[1];

        this.extraJoinedProperties.push({ name: newPropertyKey, propertyType: newPropertyType });

        const tableToJoinClass = newPropertyType;
        const tableToJoinName = getTableMetadata(tableToJoinClass).tableName;
        const tableToJoinAlias = newPropertyKey;

        const onFunction = arguments[2] as (join: IJoinOnClause<any>) => void;

        let knexOnObject: any;
        this.queryBuilder.leftOuterJoin(`${tableToJoinName} as ${tableToJoinAlias}`, function() {
            knexOnObject = this;
        });

        const onObject = {
            onColumns: (column1PartsArray: any, operator: any, column2PartsArray: any) => {
                knexOnObject.on(this.getColumnName(...column1PartsArray), operator, this.getColumnName(...column2PartsArray));
                return onObject;
            },
            onNull: (...args: any[]) => {
                knexOnObject.onNull(this.getColumnName(...args));
                return onObject;
            },
        };
        onFunction(onObject as any);


        return this;
    }

    public leftOuterJoinTable() {
        const newPropertyKey = arguments[0];
        const newPropertyType = arguments[1];
        const column1Parts = arguments[2];
        const operator = arguments[3];
        const column2Parts = arguments[4];

        this.extraJoinedProperties.push({ name: newPropertyKey, propertyType: newPropertyType });

        const tableToJoinClass = newPropertyType;
        const tableToJoinName = getTableMetadata(tableToJoinClass).tableName;
        const tableToJoinAlias = newPropertyKey;

        const table1Column = this.getColumnName(...column1Parts);
        const table2Column = this.getColumnName(...column2Parts);

        this.queryBuilder.leftOuterJoin(`${tableToJoinName} as ${tableToJoinAlias}`, table1Column, operator, table2Column);

        return this;
    }



    public whereColumn() {

        const column1Name = this.getColumnName(...this.getArgumentsFromColumnFunction(arguments[0]));

        // const column1Parts = arguments[0];
        const operator = arguments[1];

        let column2Name;
        if (typeof (arguments[2]) === 'string') {
            column2Name = arguments[2];
        } else {
            column2Name = this.getColumnName(...this.getArgumentsFromColumnFunction(arguments[2]));
        }

        // const column2Name = this.getColumnName(...this.getArgumentsFromColumnFunction(arguments[2]));
        // const column2Parts = arguments[2];

        // let column2Name;
        // if (typeof (column2Parts) === 'string') {
        //     column2Name = column2Parts;
        // } else {
        //     column2Name = this.getColumnName(...column2Parts);
        // }

        this.queryBuilder.whereRaw(`?? ${operator} ??`, [column1Name, column2Name]);

        return this;
    }


    public toQuery() {
        return this.queryBuilder.toQuery();
    }

    public whereNull() {
        this.queryBuilder.whereNull(this.getColumnName(...arguments));
        return this;
    }

    public whereNotNull() {
        this.queryBuilder.whereNotNull(this.getColumnName(...arguments));
        return this;
    }

    public getArgumentsFromColumnFunction(f: any) {
        let calledArguments = [] as string[];

        function saveArguments(...args: string[]) {
            calledArguments = args;
        }

        f(saveArguments);

        return calledArguments;
    }

    public async findByColumn() {


        const functions = arguments[2];

        for (const f of functions) {
            (this.selectColumn as any)(f);
        }

        this.queryBuilder.where(this.getColumnNameWithoutAliasFromFunction(arguments[0]), arguments[1]);

        return await this.queryBuilder.first();
    }

    public where() {
        const columnArguments = this.getArgumentsFromColumnFunction(arguments[0]);

        this.queryBuilder.where(this.getColumnName(...columnArguments), arguments[1]);
        return this;
    }

    public whereNot() {
        const columnArguments = this.getArgumentsFromColumnFunction(arguments[0]);

        this.queryBuilder.whereNot(this.getColumnName(...columnArguments), arguments[1]);
        return this;
    }

    public andWhere() {
        const columnArguments = this.getArgumentsFromColumnFunction(arguments[0]);

        this.queryBuilder.andWhere(this.getColumnName(...columnArguments), arguments[1]);
        return this;
    }

    public orWhere() {
        const columnArguments = this.getArgumentsFromColumnFunction(arguments[0]);

        this.queryBuilder.orWhere(this.getColumnName(...columnArguments), arguments[1]);
        return this;
    }


    public whereIn() {
        const range = arguments[1];
        this.queryBuilder.whereIn(this.getColumnNameFromFunction(arguments[0]), range);
        return this;
    }
    public whereNotIn() {
        const range = arguments[1];
        this.queryBuilder.whereNotIn(this.getColumnNameFromFunction(arguments[0]), range);
        return this;
    }
    public orWhereIn() {
        const range = arguments[1];
        this.queryBuilder.orWhereIn(this.getColumnNameFromFunction(arguments[0]), range);
        return this;
    }
    public orWhereNotIn() {
        const range = arguments[1];
        this.queryBuilder.orWhereNotIn(this.getColumnNameFromFunction(arguments[0]), range);
        return this;
    }

    public whereBetween() {
        const value = arguments[1];
        this.queryBuilder.whereBetween(this.getColumnNameFromFunction(arguments[0]), value);
        return this;
    }
    public whereNotBetween() {
        const value = arguments[1];
        this.queryBuilder.whereNotBetween(this.getColumnNameFromFunction(arguments[0]), value);
        return this;
    }


    public orWhereBetween() {
        const value = arguments[1];
        this.queryBuilder.orWhereBetween(this.getColumnNameFromFunction(arguments[0]), value);
        return this;
    }
    public orWhereNotBetween() {
        const value = arguments[1];
        this.queryBuilder.orWhereNotBetween(this.getColumnNameFromFunction(arguments[0]), value);
        return this;
    }


    public callQueryCallbackFunction(functionName: string, typeOfSubQuery: any, functionToCall: any) {
        const that = this;
        ((this.queryBuilder as any)[functionName] as (callback: Knex.QueryCallback) => Knex.QueryBuilder)(function() {
            const subQuery = this;
            functionToCall(new TypedQueryBuilder(typeOfSubQuery, that.knex, subQuery), that.getColumnName.bind(that));
        });
    }


    public whereParentheses() {
        // const typeOfSubQuery = arguments[0];
        // const functionToCall = arguments[1];

        this.callQueryCallbackFunction('where', this.tableClass, arguments[0]);

        return this;
    }


    public whereExists() {
        const typeOfSubQuery = arguments[0];
        const functionToCall = arguments[1];

        this.callQueryCallbackFunction('whereExists', typeOfSubQuery, functionToCall);

        return this;
    }
    public orWhereExists() {
        const typeOfSubQuery = arguments[0];
        const functionToCall = arguments[1];

        this.callQueryCallbackFunction('orWhereExists', typeOfSubQuery, functionToCall);

        return this;
    }

    public whereNotExists() {
        const typeOfSubQuery = arguments[0];
        const functionToCall = arguments[1];

        this.callQueryCallbackFunction('whereNotExists', typeOfSubQuery, functionToCall);

        return this;
    }
    public orWhereNotExists() {
        const typeOfSubQuery = arguments[0];
        const functionToCall = arguments[1];

        this.callQueryCallbackFunction('orWhereNotExists', typeOfSubQuery, functionToCall);

        return this;
    }

    public whereRaw(sql: string, ...bindings: string[]) {
        this.queryBuilder.whereRaw(sql, bindings);
        return this;
    }


    public having() {
        const operator = arguments[1];
        const value = arguments[2];
        this.queryBuilder.having(this.getColumnNameFromFunction(arguments[0]), operator, value);
        return this;
    }

    public havingIn() {
        const value = arguments[1];
        this.queryBuilder.havingIn(this.getColumnNameFromFunction(arguments[0]), value);
        return this;
    }

    public havingNotIn() {
        const value = arguments[1];
        (this.queryBuilder as any).havingNotIn(this.getColumnNameFromFunction(arguments[0]), value);
        return this;
    }

    public havingNull() {
        (this.queryBuilder as any).havingNull(this.getColumnNameFromFunction(arguments[0]));
        return this;
    }

    public havingNotNull() {
        (this.queryBuilder as any).havingNotNull(this.getColumnNameFromFunction(arguments[0]));
        return this;
    }

    public havingExists() {
        const typeOfSubQuery = arguments[0];
        const functionToCall = arguments[1];

        this.callQueryCallbackFunction('havingExists', typeOfSubQuery, functionToCall);

        return this;
    }

    public havingNotExists() {
        const typeOfSubQuery = arguments[0];
        const functionToCall = arguments[1];

        this.callQueryCallbackFunction('havingNotExists', typeOfSubQuery, functionToCall);

        return this;
    }



    public havingRaw(sql: string, ...bindings: string[]) {
        this.queryBuilder.havingRaw(sql, bindings);
        return this;
    }

    public havingBetween() {
        const value = arguments[1];
        (this.queryBuilder as any).havingBetween(this.getColumnNameFromFunction(arguments[0]), value);
        return this;
    }

    public havingNotBetween() {
        const value = arguments[1];
        (this.queryBuilder as any).havingNotBetween(this.getColumnNameFromFunction(arguments[0]), value);
        return this;
    }


    public union() {
        const typeOfSubQuery = arguments[0];
        const functionToCall = arguments[1];

        this.callQueryCallbackFunction('union', typeOfSubQuery, functionToCall);

        return this;
    }

    public unionAll() {
        const typeOfSubQuery = arguments[0];
        const functionToCall = arguments[1];

        this.callQueryCallbackFunction('unionAll', typeOfSubQuery, functionToCall);

        return this;
    }

    public returningColumn() {
        throw new NotImplementedError();
    }

    public returningColumns() {
        throw new NotImplementedError();
    }

    public transacting(trx: Knex.Transaction) {
        this.queryBuilder.transacting(trx);
    }

    public min() {
        return this.functionWithAlias('min', arguments[0], arguments[1]);
    }

    public count() {
        return this.functionWithAlias('count', arguments[0], arguments[1]);
    }

    public countDistinct() {
        return this.functionWithAlias('countDistinct', arguments[0], arguments[1]);
    }

    public max() {
        return this.functionWithAlias('max', arguments[0], arguments[1]);
    }

    public sum() {
        return this.functionWithAlias('sum', arguments[0], arguments[1]);
    }

    public sumDistinct() {
        return this.functionWithAlias('sumDistinct', arguments[0], arguments[1]);
    }

    public avg() {
        return this.functionWithAlias('avg', arguments[0], arguments[1]);
    }

    public avgDistinct() {
        return this.functionWithAlias('avgDistinct', arguments[0], arguments[1]);
    }

    public increment() {
        const value = arguments[arguments.length - 1];
        this.queryBuilder.increment(this.getColumnNameFromArgumentsIgnoringLastParameter(...arguments), value);
        return this;
    }
    public decrement() {
        const value = arguments[arguments.length - 1];
        this.queryBuilder.decrement(this.getColumnNameFromArgumentsIgnoringLastParameter(...arguments), value);
        return this;
    }


    public async truncate() {
        await this.queryBuilder.truncate();
    }

    public clearSelect() {
        this.queryBuilder.clearSelect();
        return this as any;
    }
    public clearWhere() {
        this.queryBuilder.clearWhere();
        return this as any;
    }
    public clearOrder() {
        (this.queryBuilder as any).clearOrder();
        return this as any;
    }

    public distinct() {
        this.queryBuilder.distinct();
        return this as any;
    }

    public clone() {

        const queryBuilderClone = this.queryBuilder.clone();

        const typedQueryBuilderClone = new TypedQueryBuilder<ModelType, Row>(this.tableClass, this.knex, queryBuilderClone);

        return typedQueryBuilderClone as any;
    }

    public beginTransaction(): Promise<Knex.Transaction> {
        return new Promise((resolve) => {
            this.knex.transaction((tr) => resolve(tr))
                // If this error is not caught here, it will throw, resulting in an unhandledRejection
                // tslint:disable-next-line:no-empty
                .catch((_e) => { });
        });
    }


    public groupBy() {
        this.queryBuilder.groupBy(this.getColumnNameFromFunction(arguments[0]));
        return this;
    }


    public groupByRaw(sql: string, ...bindings: string[]) {
        this.queryBuilder.groupByRaw(sql, bindings);
        return this;
    }

    public useKnexQueryBuilder(f: (query: Knex.QueryBuilder) => void): void {
        f(this.queryBuilder);
    }


    private functionWithAlias(knexFunctionName: string, f: any, aliasName: string) {
        (this.queryBuilder as any)[knexFunctionName](`${this.getColumnNameWithoutAliasFromFunction(f)} as ${aliasName}`);
        return this as any;
    }



    private getColumnNameFromFunction(f: any) {
        return this.getColumnName(...this.getArgumentsFromColumnFunction(f));
    }


    private getColumnNameWithoutAliasFromFunction(f: any) {
        return this.getColumnNameWithoutAlias(...this.getArgumentsFromColumnFunction(f));
    }

    private joinColumn(joinType: 'innerJoin' | 'leftOuterJoin', f: any) {




        const columnToJoinArguments = this.getArgumentsFromColumnFunction(f);

        const columnToJoinName = this.getColumnName(...columnToJoinArguments);

        let secondColumnName = columnToJoinArguments[0];
        let secondColumnAlias = columnToJoinArguments[0];
        let secondColumnClass = getColumnInformation(this.tableClass, secondColumnName).columnClass;

        for (let i = 1; i < columnToJoinArguments.length; i++) {
            const beforeSecondColumnAlias = secondColumnAlias;
            const beforeSecondColumnClass = secondColumnClass;

            const columnInfo = getColumnInformation(beforeSecondColumnClass, columnToJoinArguments[i]);
            secondColumnName = columnInfo.name;
            secondColumnAlias = beforeSecondColumnAlias + '_' + columnInfo.propertyKey;
            secondColumnClass = columnInfo.columnClass;

            // firstColumnAlias = beforeSecondColumnAlias;
            // firstColumnClass = beforeSecondColumnClass;
        }

        const tableToJoinName = getTableMetadata(secondColumnClass).tableName;
        // const tableToJoinAlias = tableToJoinName.replace('.', '_');
        const tableToJoinAlias = secondColumnAlias;
        const tableToJoinJoinColumnName = `${tableToJoinAlias}.${getPrimaryKeyColumn(secondColumnClass).name}`;

        if (joinType === 'innerJoin') {
            this.queryBuilder.innerJoin(`${tableToJoinName} as ${tableToJoinAlias}`, tableToJoinJoinColumnName, columnToJoinName);
        } else if (joinType === 'leftOuterJoin') {
            this.queryBuilder.leftOuterJoin(`${tableToJoinName} as ${tableToJoinAlias}`, tableToJoinJoinColumnName, columnToJoinName);

        }


        // let firstColumnAlias = this.tableName;
        // let firstColumnClass = this.tableClass;
        // let secondColumnAlias = columnToJoinArguments[0];
        // let secondColumnName = columnToJoinArguments[0];
        // let secondColumnClass = getColumnInformation(firstColumnClass, secondColumnAlias).columnClass;

        // for (let i = 1; i < columnToJoinArguments.length; i++) {
        //     const beforeSecondColumnAlias = secondColumnAlias;
        //     const beforeSecondColumnClass = secondColumnClass;

        //     secondColumnName = columnToJoinArguments[i];
        //     secondColumnAlias = beforeSecondColumnAlias + '_' + columnToJoinArguments[i];
        //     secondColumnClass = getColumnInformation(beforeSecondColumnClass, columnToJoinArguments[i]).columnClass;

        //     firstColumnAlias = beforeSecondColumnAlias;
        //     firstColumnClass = beforeSecondColumnClass;
        // }
        // // tableToJoinJoinColumnName = getPrimaryKeyColumn(getColumnProperties);

        // const tableToJoinName = getTableMetadata(secondColumnClass).tableName;
        // const tableToJoinAlias = secondColumnAlias;
        // const tableToJoinJoinColumnName = `${tableToJoinAlias}.${getPrimaryKeyColumn(secondColumnClass)}`;
        // const tableJoinedColumnName = `${firstColumnAlias}.${secondColumnName}Id`;

        // if (joinType === 'innerJoin') {
        //     this.queryBuilder.innerJoin(`${tableToJoinName} as ${tableToJoinAlias}`, tableToJoinJoinColumnName, tableJoinedColumnName);
        // } else if (joinType === 'leftOuterJoin') {
        //     this.queryBuilder.leftOuterJoin(`${tableToJoinName} as ${tableToJoinAlias}`, tableToJoinJoinColumnName, tableJoinedColumnName);

        // }

        return this;

    }

    private getColumnNameFromArgumentsIgnoringLastParameter(...keys: string[]): string {
        const argumentsExceptLast = keys.slice(0, -1);
        return this.getColumnName(...argumentsExceptLast);

    }


    private getColumnName(...keys: string[]): string {


        const firstPartName = this.getColumnNameWithoutAlias(keys[0]);

        if (keys.length === 1) {
            return firstPartName;
        } else {

            let currentColumnPart = getColumnInformation(this.tableClass, keys[0]);

            let columnName = '';
            let columnAlias = currentColumnPart.propertyKey;
            let currentClass = currentColumnPart.columnClass;
            for (let i = 1; i < keys.length; i++) {

                currentColumnPart = getColumnInformation(currentClass, keys[i]);

                columnName = columnAlias + '.' + (keys.length - 1 === i ? currentColumnPart.name : currentColumnPart.propertyKey);
                columnAlias += '_' + (keys.length - 1 === i ? currentColumnPart.name : currentColumnPart.propertyKey);
                currentClass = currentColumnPart.columnClass;
            }
            return columnName;
        }


        // let currentClass = this.tableClass;
        // let result = this.tableName;
        // for (let i = 0; i < keys.length; i++) {
        //     const currentColumnPart = getColumnInformation(currentClass, keys[i]);
        //     result += '.' + currentColumnPart.name;
        //     currentClass = currentColumnPart.columnClass;
        // }

        // return result;

        // if (keys.length === 1) {
        //     return this.tableName + '.' + keys[0];
        // } else {
        //     let columnName = keys[0];
        //     let columnAlias = keys[0];
        //     for (let i = 1; i < keys.length; i++) {
        //         columnName = columnAlias + '.' + keys[i];
        //         columnAlias += '_' + keys[i];
        //     }
        //     return columnName;
        // }
    }


    private getColumnNameWithoutAlias(...keys: string[]): string {


        if (keys.length === 1) {
            const columnInfo = getColumnInformation(this.tableClass, keys[0]);
            return this.tableName + '.' + columnInfo.name;
        } else {

            // let currentClass = this.tableClass;
            // let result = '';

            let currentColumnPart = getColumnInformation(this.tableClass, keys[0]);

            // let columnName = '';
            let result = currentColumnPart.propertyKey;
            let currentClass = currentColumnPart.columnClass;

            for (let i = 1; i < keys.length; i++) {
                currentColumnPart = getColumnInformation(currentClass, keys[i]);
                result += '.' + (keys.length - 1 === i ? currentColumnPart.name : currentColumnPart.propertyKey);
                currentClass = currentColumnPart.columnClass;
            }

            return result;
        }

        // if (keys.length === 1) {
        //     return this.tableName + '.' + keys[0];
        // } else {
        //     let columnName = keys[0];
        //     // let columnAlias = keys[0];
        //     for (let i = 1; i < keys.length; i++) {
        //         columnName = columnName + '.' + keys[i];
        //         // columnAlias += '_' + keys[i];
        //     }
        //     return columnName;
        // }
    }

    // private getColumnAlias(...keys: string[]): string {
    //     if (arguments.length === 1) {
    //         return arguments[0];
    //     } else {
    //         let columnAlias = arguments[0];
    //         for (let i = 1; i < arguments.length; i++) {
    //             columnAlias += '_' + arguments[i];
    //         }
    //         return columnAlias;
    //     }
    // }

    private getColumnSelectAlias(...keys: string[]): string {
        if (keys.length === 1) {
            return keys[0];
        } else {
            let columnAlias = keys[0];
            for (let i = 1; i < keys.length; i++) {
                columnAlias += '.' + keys[i];
            }
            return columnAlias;
        }
    }

}
