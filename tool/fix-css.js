// This program remove all CSS commented with /* Chromium-only */
// Usage:
//   node fix-css.js <path-to-css-file>

import fs from 'fs';
import path from 'path';



function main() {
    if(process.argv.length !== 3) {
        console.error('Usage: node fix-css.js <path-to-css-file>');
        process.exit(1);
    }

    const cssFilePath = process.argv[2];
    const absPath = path.resolve(cssFilePath);

    if (!fs.existsSync(absPath)) {
        console.error(`File not found: ${absPath}`);
        process.exit(1);
    }

    const cssContent = fs.readFileSync(absPath, 'utf8');
    const lines_read = cssContent.split('\n');
    const lines_write = [];

    let filtering_out = false;

    for (let i = 0; i < lines_read.length; i++) {
        const line = lines_read[i];

        if (line.includes('/* Chromium-only */')) {
            if(i < lines_read.length - 1 && lines_read[i + 1].includes('{')) {
                filtering_out = true;
                continue;
            }
        }

        if (filtering_out && line.includes('}')) {
            filtering_out = false;
            continue;
        }

        if(!filtering_out) {
            lines_write.push(line);
        }
    }

    const filteredContent = lines_write.join('\n');
    fs.writeFileSync(absPath, filteredContent, 'utf8');
}

main();
