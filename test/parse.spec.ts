import fs from 'fs/promises';
import path from 'path';
import { parseSSC } from '../src';
describe('parse', () => {
    it('should parse sample ssc file', async () => {
        const sscContent = await fs.readFile(
            path.join(__dirname, '..', 'ssc-samples', 'test.ssc'),
            'utf-8'
        );
        const parsedSSC = parseSSC(sscContent);
    });
});
