import { SchemasMap } from '../../../src';

import comment from './comment';
import post from './post';
import user from './user';

const schemas: SchemasMap = new Map();

schemas.set('comment', comment);
schemas.set('post', post);
schemas.set('user', user);

export default { schemas };
