export function clampVolume(value){const n=Number(value);return Number.isFinite(n)?Math.max(0,Math.min(1,n)):0.45}
let volume=0.45;const outputs=new Set();
export function setVoiceVolume(value){volume=clampVolume(value);for(const {ctx,node} of outputs){node.gain.cancelScheduledValues(ctx.currentTime);node.gain.setTargetAtTime(volume,ctx.currentTime,0.025)}return volume}
export function createVoiceOutput(ctx){const node=ctx.createGain();node.gain.value=volume;node.connect(ctx.destination);const entry={ctx,node};outputs.add(entry);return {node,dispose(){outputs.delete(entry);node.disconnect()}}}
if(typeof document!=='undefined'){
const label=document.createElement('label');label.style.cssText='display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin:16px 0;font-size:14px';
const title=document.createElement('span');const input=document.createElement('input');input.type='range';input.min='0';input.max='100';input.step='1';input.value='45';input.style.cssText='width:160px;accent-color:#a87947';input.id='voiceVolume';const value=document.createElement('output');value.htmlFor=input.id;value.textContent='45%';
const updateLabel=()=>{const labels={pt:'Volume da voz',en:'Voice volume',es:'Volumen de voz',fr:'Volume de la voix',de:'Sprachlautstärke',it:'Volume della voce'};const text=labels[document.documentElement.lang.slice(0,2)]||labels.en;if(title.textContent!==text)title.textContent=text};updateLabel();new MutationObserver(updateLabel).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
input.addEventListener('input',()=>{setVoiceVolume(Number(input.value)/100);value.textContent=input.value+'%'});label.append(title,input,value);document.querySelector('#start')?.parentElement.after(label);
}
