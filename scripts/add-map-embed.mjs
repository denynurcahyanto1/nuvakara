import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

async function main() {
  const templatesDir = 'src/components/templates';
  const entries = await readdir(templatesDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const file = join(templatesDir, entry.name, 'index.tsx');
    
    let content;
    try {
      content = await readFile(file, 'utf-8');
    } catch (e) {
      continue; // No index.tsx
    }

    // Skip if already has MapEmbed rendered
    if (content.includes('<MapEmbed')) {
      console.log(`Skipping ${file} (already has MapEmbed)`);
      continue;
    }
    // Skip if doesn't import MapEmbed
    if (!content.includes('MapEmbed')) {
      console.log(`Skipping ${file} (no MapEmbed import)`);
      continue;
    }

    const insertionPoint = content.includes('<GiftInfo') 
      ? '<GiftInfo' 
      : (content.includes('<InvitationFooter') ? '<InvitationFooter' : '</main>');

    const mapEmbedSection = `
        {data.mapUrl ? (
          <section id="lokasi" className="mt-20">
            <Reveal>
              <MapEmbed
                url={data.mapUrl}
                href={data.mapsLink}
                venue={data.venue}
                address={data.address}
                city={data.city}
              />
            </Reveal>
          </section>
        ) : null}

        `;
        
    content = content.replace(insertionPoint, mapEmbedSection + insertionPoint);
    await writeFile(file, content);
    console.log(`Updated ${file}`);
  }
}

main().catch(console.error);
