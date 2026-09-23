import {mkdir,copyFile,readFile,writeFile} from 'node:fs/promises';
const root = new URL('../../', import.meta.url);
const dest = new URL('dist/', root);
await mkdir(new URL('assets/',dest),{recursive:true});
for(const file of ['index.html','styles.css','app.js']) await copyFile(new URL(`web/src/${file}`,root),new URL(file==='index.html'?file:`assets/${file}`,dest));
for(const file of ['report.md','sources.md','model.py']) await copyFile(new URL(file,root),new URL(`assets/${file}`,dest));
await copyFile(new URL('data/scenarios.csv',root),new URL('assets/scenarios.csv',dest));
// Inline CSV in the module: charts work offline without a fetch/loading dependency.
const csv=await readFile(new URL('data/scenarios.csv',root),'utf8');
await writeFile(new URL('assets/data.js',dest),`export default ${JSON.stringify(csv)};\n`);
console.log('Built dist/index.html with local assets and accepted research downloads.');
