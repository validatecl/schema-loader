import { Schema, Connection } from 'mongoose';

export type SchemasMap = Map<string, Schema>;

export interface SchemaLoaderOptions {
  /**
   * Whether to replace Schemas upon recurrent `load` calls.
   */
  replace?: boolean;

  /**
   * Whether to clone schemas before assigning them to the connection's models.
   */
  clone?: boolean;
}

export interface SchemaLoader {
  /**
   * Loads all schemas present in the current connection and config.
   */
  loadAll(schemas: SchemasMap): void;

  /**
   * Loads a single schema respecting the current connection and config.
   *
   * @param {string} name The schema name to use.
   * @param {Schema} schema The schema to load.
   */
  load(name: string, schema: Schema): void;
}

/**
 * Loads a schema for the provided connection.
 *
 * @param {Connection} connection The connection to use.
 * @param {object} options The options object.
 * @param {string} name The schema name.
 * @param {Schema} schema The schema to load.
 */
function load(connection: Connection, options: SchemaLoaderOptions, name: string, schema: Schema): void {
  const { clone, replace } = options;

  if (connection.modelNames().includes(name)) {
    if (!replace) {
      return;
    }

    connection.deleteModel(name);
  }

  connection.model(name, clone ? schema.clone() : schema);
}

/**
 * Loads all provided Schemas into the Connection's Models.
 *
 * IMPORTANT: Cloned Schemas will no be able to make indirect changes to the
 * connection model (e.g.: `schema.add`). This can be helpful when using the
 * same base schema on different connections.
 *
 * @param {object} connection The connection to use
 * @param {object} config The config to load.
 * @param {boolean} config.replace Whether to update a loaded schema.
 * @param {boolean} config.clone Whether to clone the schema before loading.
 * @param {Map<string, Schema>} schemas The schemas definition.
 */
function loadAll(connection: Connection, { clone, replace }: SchemaLoaderOptions, schemas: SchemasMap): void {
  for (const [name, schema] of schemas) {
    load(connection, { clone, replace }, name, schema);
  }
}

/**
 * Creates a new schema loader instance.
 *
 * @param {Connection} connection The connection to use.
 * @param {object} options The options object.
 *
 * @returns {object} The schema loader instance.
 */
export function createSchemaLoader(connection: Connection, options?: SchemaLoaderOptions): SchemaLoader {
  if (!(connection instanceof Connection)) {
    throw new Error('The `connection` argument must be an instance of `Connection`');
  }

  return Object.freeze<SchemaLoader>({
    loadAll: loadAll.bind(null, connection, options || {}),
    load: load.bind(null, connection, options || {})
  });
}

