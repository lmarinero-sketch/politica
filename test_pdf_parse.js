const fs = require('fs');
const { PDFParse } = require('pdf-parse');

const files = ['fiesta_adulto.pdf', 'monda_jachal.pdf', 'encuesta_opinion.pdf', 'sample_res_adj.pdf'];

async function parseAll() {
    for (const f of files) {
        if (!fs.existsSync(f)) continue;
        console.log(`\n=================== Parsing ${f} ===================`);
        const dataBuffer = fs.readFileSync(f);
        try {
            const parser = new PDFParse(new Uint8Array(dataBuffer));
            await parser.load();
            const text = await parser.getText();
            console.log('Text length:', text?.length);
            if (text && text.trim().length > 0) {
                console.log('Text snippet:');
                console.log(text.slice(0, 1500));
                fs.writeFileSync(`${f}.txt`, text);
            } else {
                console.log('NO EXTRACTED TEXT (Document is an image/scanned PDF)');
            }
        } catch (e) {
            console.error(`Error on ${f}:`, e.message);
        }
    }
}

parseAll();
