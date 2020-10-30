process.env.MONGOMS_SYSTEM_BINARY = '/usr/bin/mongod';

import { createConnection, Connection, Model, Document, Schema } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server-core';
import { expect } from 'chai';

import { createSchemaLoader, SchemaLoader, SchemaLoaderOptions } from '../../src';
import config from '../fixtures/schemas';

const mongod = new MongoMemoryServer();

describe('Schemas', function () {
  this.timeout(30000);

  let connection: Connection;

  before(async function () {
    const uri = await mongod.getConnectionString();

    connection = await createConnection(uri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true
    });
  });

  it('should be a function', function () {
    expect(createSchemaLoader).to.be.a('function');
  });

  it('should not create a loader without a connection', function () {
    expect(() => createSchemaLoader(null, null)).to.throw();
  });

  it('should create a loader without options', function () {
    expect(() => createSchemaLoader(connection)).to.not.throw();
  });

  it('should create a loader with options', function () {
    const options: SchemaLoaderOptions = {
      clone: true
    };

    expect(() => createSchemaLoader(connection, options)).to.not.throw();
  });

  it('should load all schemas without options', function () {
    const schemas: SchemaLoader = createSchemaLoader(connection);

    schemas.loadAll(config.schemas);

    const models: string[] = connection.modelNames();

    expect(models).to.be.an('array').of.length(3)
      .that.include.members(['user', 'post', 'comment']);
  });

  it('should not replace connection models from config schemas', function () {
    const options: SchemaLoaderOptions = {
      replace: false
    };

    const schemas: SchemaLoader = createSchemaLoader(connection, options);

    expect(() => schemas.loadAll(config.schemas)).to.not.throw();

    const user: Schema = new Schema({
      birthdate: Date,
      name: String
    });

    expect(() => schemas.load('user', user)).to.not.throw();

    const User: Model<Document> = connection.model('user');

    expect(User).to.be.a('function');
    expect(User.schema.path('birthdate')).to.be.undefined;
  });

  it('should replace a previously loaded schema', function () {
    const options: SchemaLoaderOptions = {
      replace: true
    };

    const schemas: SchemaLoader = createSchemaLoader(connection, options);

    // Load configured schemas
    expect(() => schemas.loadAll(config.schemas)).to.not.throw();

    const user: Schema = new Schema({
      birthdate: Date,
      name: String
    });

    // Replace a loaded schema
    expect(() => schemas.load('user', user)).to.not.throw();

    const User: Model<Document> = connection.model('user');

    expect(User).to.be.a('function');
    expect(User.schema.path('birthdate')).to.not.be.undefined;
  });

  it('should not clone config schemas before loading connection models', function () {
    const options: SchemaLoaderOptions = {
      replace: false,
      clone: false
    };

    const schemas: SchemaLoader = createSchemaLoader(connection, options);

    const thing: Schema = new Schema({
      length: Number
    });

    config.schemas.set('thing', thing);

    expect(() => schemas.loadAll(config.schemas)).to.not.throw();

    // Add a schema path after loading it...
    thing.add({
      weight: Number
    });

    const Thing: Model<Document> = connection.model('thing');

    expect(Thing).to.be.a('function');
    expect(Thing.schema.path('weight')).to.not.be.undefined;
  });

  it('should clone config schemas before loading connection models', function () {
    const options: SchemaLoaderOptions = {
      replace: false,
      clone: true
    };

    const schemas: SchemaLoader = createSchemaLoader(connection, options);

    const stuff: Schema = new Schema({
      count: Number
    });

    config.schemas.set('stuff', stuff);

    expect(() => schemas.loadAll(config.schemas)).to.not.throw();

    // Add a schema path after loading it...
    stuff.add({
      smell: Number
    });

    const Stuff: Model<Document> = connection.model('stuff');

    expect(Stuff).to.be.a('function');
    expect(Stuff.schema.path('smell')).to.be.undefined;
  });

  after(async function () {
    await connection.close();
    await mongod.stop();
  });
});
