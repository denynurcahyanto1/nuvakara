/**
 * Promotes the address in ADMIN_EMAILS to the admin role.
 *
 * Usage: node scripts/promote-admin.mjs [email]
 */
import { connect, loadEnv } from "./lib/db.mjs";

loadEnv();

const email =
  process.argv[2] || process.env.ADMIN_EMAILS?.split(",")[0]?.trim();

if (!email) {
  console.error("usage: node scripts/promote-admin.mjs <email>");
  process.exit(1);
}

const client = await connect();
const res = await client.query(
  "update profiles set role = 'admin' where email = $1 returning email, role",
  [email],
);
console.log(JSON.stringify(res.rows, null, 1));
await client.end();
