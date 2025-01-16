import fs from 'fs';
// Given a path of JS file, remove all occurrences of export keyword in the file.
function remove_export(path) {
    const content = fs.readFileSync(path, 'utf-8');
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('export ')) {
            lines[i] = lines[i].substring('export '.length);
        }
    }
    fs.writeFileSync(path, lines.join('\n'));
}

function main()  {
    // walk through all files under dist/js/
    const files = fs.readdirSync('dist/js/');
    for (const file of files) {
        if (file.endsWith('.js')) {
            remove_export(`dist/js/${file}`);
        }
    }
}

main();
