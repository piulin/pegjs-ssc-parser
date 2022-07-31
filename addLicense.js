const glob = require('glob');
const fs = require('fs/promises');

// options is optional
glob('dist/**/*.{ts,js,d.ts}', {}, async (er, files) => {
    const license = await fs.readFile('./COPYRIGHT_NOTICE', 'utf-8');

    await Promise.all(
        files.map(async (filePath) => {
            const content = await fs.readFile(filePath, 'utf-8');
            await fs.writeFile(filePath, `${license}${content}`, 'utf-8');
        })
    );
});
