import fs from 'fs/promises';
import path from 'path';
import { parseSM, validateSM } from '../src/parser';
describe('parse', () => {
    it('should parse sample sm file', async () => {
        try {
            const smContent = await fs.readFile(
                path.join(__dirname, '..', 'sm-samples', 'Autoload.sm'),
                'utf-8'
            );
            const parsedSM = parseSM(smContent);
            console.log(parsedSM);

            const validatedSSC = validateSM(parsedSM);

            // write into disk validatedSSC as json file
            await fs.writeFile(
                path.join(__dirname, '..', 'sm-samples', 'Autoload.json'),
                JSON.stringify(validatedSSC, null, 2)
            );
        } catch (e) {
            console.log(e);
            throw e;
        }
    });
});
