# @validatecl/schema-loader

[![Build Status](https://travis-ci.org/validatecl/schema-loader.svg?branch=master)](https://travis-ci.org/validatecl/schema-loader)
![GitHub](https://img.shields.io/github/license/validatecl/schema-loader)
![GitHub last commit](https://img.shields.io/github/last-commit/validatecl/schema-loader)
![npm (scoped)](https://img.shields.io/npm/v/@validatecl/schema-loader)
![npm](https://img.shields.io/npm/dw/@validatecl/schema-loader)

Schema loader for Mongoose connections.

## Installation

```sh
npm i @validatecl/schema-loader
```

## Usage

Use it to load your schemas into any Mongoose connection.

`./configs/schemas.ts`:

```ts
import { SchemasMap, SchemaLoaderOptions } from '@validatecl/schema-loader';

// You could move the schema map to another sub-module...
import profile from '../schemas/profile';
import user from '../schemas/user';

const schemas: SchemasMap = new Map();

schemas.set('profile', profile);
schemas.set('user', user);

const options: SchemaLoaderOptions = {
  replace: false,
  clone: true
};

export default {
  schemas,
  options
};
```

`./components/schemas.ts`:

```ts
import { createSchemaLoader, SchemaLoader } from '@validatecl/schema-loader';
import { Connection } from 'mongoose';

import { options, schemas } from '../configs/schemas';
import db from '../components/database';

const conn: Connection = db.connection('default');
const loader: SchemaLoader = createSchemaLoader(conn, options);

loader.loadAll(schemas);

export default loader;
```

## Documentation

Please visit [the documentation page](https://validatecl.github.io/schema-loader/) for more info and options.
