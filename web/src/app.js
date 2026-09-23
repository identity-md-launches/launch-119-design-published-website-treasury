// CSV is copied unchanged from the accepted model at build time.
// @ts-ignore generated module only exists in the static export
import csv from './data.js';
/** @typedef {{[key:string]:number|string, scenario:string, month:number}} Row */
const lines = /** @type {string} */ (csv).trim().split(/\r?\n/);
const headers = lines.shift().split(',');
const rows = lines.map(line => /** @type {Row} */ (Object.fromEntries(line.split(',').map((value,i)=>[headers[i],i===0?value:Number(value)]))));
/** @type {Record<string,{title:string,description:string}>} */
const scenarios={base:{title:'Base scenario',description:'Token volume starts at $2M/month and grows 2% monthly. Market return +0.3%; LP drag 0.15% monthly.'},bull:{title:'Bull scenario',description:'Token volume starts at $3M/month and grows 8% monthly. Market return +1.5%; LP drag 0.25% monthly. The strongest assumptions drive the strongest outcome.'},bear:{title:'Bear scenario',description:'Token volume starts at $1M/month and falls 5% monthly. Market return −1.5%; LP drag 0.80% monthly. Covering fees and costs does not preserve NAV.'},token_trading_fades:{title:'Token trading fades',description:'Volume is 70%, 40% and 10% of the initial $2M in months 1–3, then flat. Market return 0%; LP drag 0.30% monthly. IMD additions stop after month 2.'},imd_price_falls_70pct:{title:'IMD price falls 70%',description:'A $35,000 total shock hits the initial IMD component over months 1–3. Volume starts at $2M and grows 2% monthly; market return −0.5%, LP drag 0.30% monthly.'}};
const money=new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0});
const compact=new Intl.NumberFormat('en-US',{notation:'compact',maximumFractionDigits:1});
/** @param {string} id */
function el(id){const node=document.getElementById(id);if(!node)throw new Error(`Missing element: ${id}`);return node;}
/** @param {number|string} value */
function usd(value){return money.format(Number(value));}
/** @param {string} id @param {Row[]} data @param {string[]} keys */
function chart(id,data,keys){
 const width=580,left=65,right=20,top=20,bottom=225;
 const max=Math.max(...data.flatMap(row=>keys.map(key=>Number(row[key]))))*1.12;
 const x=(/** @type {number} */ i)=>left+i*(width-left-right)/11;
 const y=(/** @type {number} */ value)=>bottom-value/max*(bottom-top);
 let markup=`<title>${scenarios[data[0].scenario].title}: ${id==='nav-chart'?'treasury value':'token volume and break-even'}</title>`;
 for(let i=0;i<5;i++){const value=max*i/4;markup+=`<line x1="${left}" y1="${y(value)}" x2="560" y2="${y(value)}" stroke="#dbe0d1"/><text x="${left-9}" y="${y(value)+4}" text-anchor="end">$${compact.format(value)}</text>`;}
 for(const i of [0,2,5,8,11])markup+=`<text x="${x(i)}" y="250" text-anchor="middle">M${i+1}</text>`;
 keys.forEach((key,index)=>{const points=data.map((row,i)=>`${x(i)},${y(Number(row[key]))}`).join(' ');if(id==='nav-chart')markup+=`<polygon points="${left},${bottom} ${points} 560,${bottom}" fill="#d8e5bf" opacity=".6"/>`;markup+=`<polyline points="${points}" fill="none" stroke="${index?'#9e532e':'#4e6b2d'}" stroke-width="3" ${index?'stroke-dasharray="7 5"':''}/>`;});
 el(id).innerHTML=markup;
}
/** @param {string} name @param {boolean} updateUrl */
function render(name,updateUrl=false){
 if(!scenarios[name])name='base';
 const data=rows.filter(row=>row.scenario===name),last=data[data.length-1];
 document.querySelectorAll('button[data-scenario]').forEach(button=>button.setAttribute('aria-pressed',String(button.getAttribute('data-scenario')===name)));
 el('scenario-title').textContent=scenarios[name].title;el('scenario-description').textContent=scenarios[name].description;
 el('nav-value').textContent=usd(last.treasury_value_usd);el('income-value').textContent=usd(last.gross_income_usd);el('imd-value').textContent=usd(last.cumulative_imd_liquidity_added_usd);
 el('hero-value').textContent=usd(rows.find(row=>row.scenario==='base'&&row.month===12).treasury_value_usd);
 el('hero-mobile-value').textContent=el('hero-value').textContent;
 chart('nav-chart',data,['treasury_value_usd']);chart('volume-chart',data,['token_volume_usd','break_even_token_volume_usd']);
 el('breakpoint-note').textContent=`Month 12 break-even: ${usd(last.break_even_token_volume_usd)} in canonical token volume. This scenario has ${usd(last.token_volume_usd)} — ${Number(last.token_volume_usd)>=Number(last.break_even_token_volume_usd)?'above':'below'} that threshold.`;
 el('monthly-rows').innerHTML=data.map(row=>`<tr><th scope="row">${row.month}</th>${['treasury_value_usd','gross_income_usd','imd_liquidity_added_usd','token_volume_usd','break_even_token_volume_usd'].map(key=>`<td>${usd(row[key])}</td>`).join('')}</tr>`).join('');
 if(updateUrl){const url=new URL(location.href);url.searchParams.set('scenario',name);history.replaceState(null,'',url);}
}
document.querySelectorAll('button[data-scenario]').forEach(button=>button.addEventListener('click',()=>render(button.getAttribute('data-scenario'),true)));
render(new URLSearchParams(location.search).get('scenario')||'base');
window.addEventListener('popstate',()=>render(new URLSearchParams(location.search).get('scenario')||'base'));
