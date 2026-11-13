/**
 * Prints the most recent profiles and the profile triggers — used to debug
 * the admin bootstrap flow.
 *
 * Usage: node scripts/inspect-profiles.mjs
 */
import { connect } from "./lib/db.mjs";

const client = await connect();

const profiles = await client.query(
  "select id, email, full_name, role, created_at from profiles order by created_at desc limit 10",
);
console.log(JSON.stringify(profiles.rows, null, 1));

const triggers = await client.query(`
  select tgname, pg_get_triggerdef(oid) as def
  from pg_trigger
  where tgrelid = 'profiles'::regclass and not tgisinternal
`);
console.log(JSON.stringify(triggers.rows, null, 1));

await client.end();
