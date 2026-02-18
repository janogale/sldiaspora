import { createDirectus, rest } from '@directus/sdk';
import { Schema } from './schema';


const directus = createDirectus<Schema>('https://admin.sldiaspora.org').with(rest());
    

export default directus;
