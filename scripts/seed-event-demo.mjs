/**
 * Seeds the demo event (id 1) with realistic detail fields, and optionally
 * switches its template.
 *
 * Usage:
 *   node scripts/seed-event-demo.mjs                  # fill detail fields
 *   node scripts/seed-event-demo.mjs <template-slug>  # switch template
 */
import { connect } from "./lib/db.mjs";

const client = await connect();

const slug = process.argv[2];

if (slug) {
  const res = await client.query(
    "update events set template_slug = $1 where id = 1 returning template_slug",
    [slug],
  );
  console.log(JSON.stringify(res.rows));
} else {
  const res = await client.query(
    `update events set
       host_name = 'Deny',
       partner_name = 'Sonya',
       event_date = '2026-12-12 10:00:00+07',
       venue_name = 'Grand Ballroom',
       venue_address = 'Jl. Jenderal Sudirman No. 1',
       city = 'Jakarta',
       description = 'Dengan penuh sukacita kami mengundang Anda untuk merayakan hari bahagia kami.'
     where id = 1
     returning name, host_name, partner_name, event_date, venue_name, city`,
  );
  console.log(JSON.stringify(res.rows, null, 1));
}

await client.end();
