
// tslint:disable:no-multiline-string
import { assert } from 'chai';
import { Project } from 'ts-simple-ast';

describe('compile time typed-knex', function() {
    this.timeout(1000000);

    const project = new Project({
        tsConfigFilePath: './tsconfig.json',
    });

    it('should return type with properties from the selectColumn method', (done) => {


        const file = project.createSourceFile(
            'test/test.ts'
            ,
            `
            import * as knex from 'knex';
            import { TypedKnex } from '../src/typedKnex';
            import { User } from './testEntities';


            (async () => {

                const typedKnex = new TypedKnex(knex({ client: 'postgresql' }));
                const result = await typedKnex
                    .query(User)
                    .selectColumn(c=>c('id'))
                    .firstItem();

                console.log(result.id);

            })();
        `);

        assert.equal(project.getPreEmitDiagnostics().length, 0);

        file.delete();
        done();
    });


    it('should error on calling property not used in selectColumn method', (done) => {


        const file = project.createSourceFile(
            'test/test.ts'
            ,
            `
            import * as knex from 'knex';
            import { TypedKnex } from '../src/typedKnex';
            import { User } from './testEntities';


            (async () => {

                const typedKnex = new TypedKnex(knex({ client: 'postgresql' }));
                const result = await typedKnex
                    .query(User)
                    .selectColumn(c=>c('id'))
                    .firstItem();

                console.log(result.name);

            })();
        `);

        assert.notEqual(project.getPreEmitDiagnostics().length, 0);

        file.delete();
        done();
    });

    it('should return type with properties from the selectColumns method', (done) => {


        const file = project.createSourceFile(
            'test/test.ts'
            ,
            `
            import * as knex from 'knex';
            import { TypedKnex } from '../src/typedKnex';
            import { User } from './testEntities';


            (async () => {

                const typedKnex = new TypedKnex(knex({ client: 'postgresql' }));
                const result = await typedKnex
                    .query(User)
                    .selectColumns([c=>c('id')])
                    .firstItem();

                console.log(result.id);

            })();
        `);

        assert.equal(project.getPreEmitDiagnostics().length, 0);

        file.delete();
        done();
    });


    it('should error on calling property not used in selectColumns method', (done) => {


        const file = project.createSourceFile(
            'test/test.ts'
            ,
            `
            import * as knex from 'knex';
            import { TypedKnex } from '../src/typedKnex';
            import { User } from './testEntities';


            (async () => {

                const typedKnex = new TypedKnex(knex({ client: 'postgresql' }));
                const result = await typedKnex
                    .query(User)
                    .selectColumns([c=>c('id')])
                    .firstItem();

                console.log(result.name);

            })();
        `);

        assert.notEqual(project.getPreEmitDiagnostics().length, 0);

        file.delete();
        done();
    });


    it('should allow to call whereIn with type of property', (done) => {


        const file = project.createSourceFile(
            'test/test.ts'
            ,
            `
            import * as knex from 'knex';
            import { TypedKnex } from '../src/typedKnex';
            import { User } from './testEntities';


            (async () => {

                const typedKnex = new TypedKnex(knex({ client: 'postgresql' }));
                const query = typedKnex
                .query(User)
                .whereIn('name', ['user1', 'user2']);


            })();
        `);

        assert.notEqual(project.getPreEmitDiagnostics().length, 0);

        file.delete();
        done();
    });

    it('should error on calling whereIn with different type', (done) => {


        const file = project.createSourceFile(
            'test/test.ts'
            ,
            `
            import * as knex from 'knex';
            import { TypedKnex } from '../src/typedKnex';
            import { User } from './testEntities';


            (async () => {

                const query = typedKnex
                .query(User)
                .whereIn('name', [1]);

            })();
        `);

        assert.notEqual(project.getPreEmitDiagnostics().length, 0);

        file.delete();
        done();
    });

    it('should allow to call whereBetween with type of property', (done) => {


        const file = project.createSourceFile(
            'test/test.ts'
            ,
            `
            import * as knex from 'knex';
            import { TypedKnex } from '../src/typedKnex';
            import { User } from './testEntities';


            (async () => {

                const typedKnex = new TypedKnex(knex({ client: 'postgresql' }));
                const query = typedKnex
                .query(User)
                .whereBetween('numericValue', [1,10]);


            })();
        `);

        assert.notEqual(project.getPreEmitDiagnostics().length, 0);

        file.delete();
        done();
    });

    it('should error on calling whereBetween with different type', (done) => {


        const file = project.createSourceFile(
            'test/test.ts'
            ,
            `
            import * as knex from 'knex';
            import { TypedKnex } from '../src/typedKnex';
            import { User } from './testEntities';


            (async () => {

                const query = typedKnex
                .query(User)
                .whereBetween('numericValue', ['','']);

            })();
        `);

        assert.notEqual(project.getPreEmitDiagnostics().length, 0);

        file.delete();
        done();
    });


    it('should error on calling whereBetween with array of more than 2', (done) => {


        const file = project.createSourceFile(
            'test/test.ts'
            ,
            `
            import * as knex from 'knex';
            import { TypedKnex } from '../src/typedKnex';
            import { User } from './testEntities';


            (async () => {

                const query = typedKnex
                .query(User)
                .whereBetween('numericValue', [1,2,3]);

            })();
        `);

        assert.notEqual(project.getPreEmitDiagnostics().length, 0);

        file.delete();
        done();
    });

    it('should allow property of parent query in where exists', (done) => {


        const file = project.createSourceFile(
            'test/test.ts'
            ,
            `
            import * as knex from 'knex';
            import { TypedKnex } from '../src/typedKnex';
            import { User, UserSetting } from './testEntities';


            (async () => {

                const query = typedKnex
                .query(User)
                .whereExists(UserSetting, (subQuery, parentColumn) => {

                    subQuery.whereColumns(['user', 'id'], '=', parentColumn('someValue'));
                });


            })();
        `);

        assert.notEqual(project.getPreEmitDiagnostics().length, 0);

        file.delete();
        done();
    });

    it('should not allow unknown property of parent query in where exists', (done) => {


        const file = project.createSourceFile(
            'test/test.ts'
            ,
            `
            import * as knex from 'knex';
            import { TypedKnex } from '../src/typedKnex';
            import { User, UserSetting } from './testEntities';


            (async () => {

                const query = typedKnex
                .query(User)
                .whereExists(UserSetting, (subQuery, parentColumn) => {

                    subQuery.whereColumns(['user', 'id'], '=', parentColumn('unknown'));
                });


            })();
        `);

        assert.notEqual(project.getPreEmitDiagnostics().length, 0);

        file.delete();
        done();
    });

    it('should return type with properties from the min method', (done) => {


        const file = project.createSourceFile(
            'test/test1.ts'
            ,
            `
            import * as knex from 'knex';
            import { TypedKnex } from '../src/typedKnex';
            import { User } from './testEntities';


            (async () => {

                const typedKnex = new TypedKnex(knex({ client: 'postgresql' }));
                const result = await typedKnex
                    .query(User)
                    .min(c => c('numericValue'), 'minNumericValue')
                    .firstItem();

                console.log(result.minNumericValue);

            })();
        `);

        assert.equal(project.getPreEmitDiagnostics().length, 0);
        file.delete();

        done();
    });


    it('should error on calling property not used in min method', (done) => {


        const file = project.createSourceFile(
            'test/test2.ts'
            ,
            `
            import * as knex from 'knex';
            import { TypedKnex } from '../src/typedKnex';
            import { User } from './testEntities';


            (async () => {

                const typedKnex = new TypedKnex(knex({ client: 'postgresql' }));
                const result = await typedKnex
                    .query(User)
                    .min(c => c('numericValue'), 'minNumericValue')
                    .firstItem();

                console.log(result.id);

            })();
        `);

        assert.notEqual(project.getPreEmitDiagnostics().length, 0);
        file.delete();

        done();
    });

    it('should return all Model properties after clearSelect', (done) => {


        const file = project.createSourceFile(
            'test/test3.ts'
            ,
            `
            import * as knex from 'knex';
            import { TypedKnex } from '../src/typedKnex';
            import { User } from './testEntities';


            (async () => {

                const typedKnex = new TypedKnex(knex({ client: 'postgresql' }));
                const result = await typedKnex
                    .query(User)
                    .selectColumn(c=>c('id'))
                    .clearSelect()
                    .firstItem();

                    console.log(result.id);
                    console.log(result.name);

            })();
        `);

        assert.equal(project.getPreEmitDiagnostics().length, 0);

        file.delete();
        done();
    });

    it('should return correct type from findByColumn', (done) => {


        const file = project.createSourceFile(
            'test/test4.ts'
            ,
            `
            import * as knex from 'knex';
            import { TypedKnex } from '../src/typedKnex';
            import { User } from './testEntities';


            (async () => {

                const typedKnex = new TypedKnex(knex({ client: 'postgresql' }));

                const item = await typedKnex
                .query(User)
                .findByColumn(c => c('numericValue'), 1, [c => c('name')]);

                if (item !== undefined) {
                    console.log(item.name);
                }

            })();
        `);


        assert.equal(project.getPreEmitDiagnostics().length, 0);

        file.delete();
        done();
    });
});
