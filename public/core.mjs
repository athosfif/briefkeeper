export const FIELDS={objective:'Objetivo',audience:'Público',deliverables:'Entregas',direction:'Direção visual',timing:'Prazo',constraints:'Restrições',budget:'Orçamento'};
export function emptyBrief(){return Object.fromEntries(Object.keys(FIELDS).map(k=>[k,{value:'',quote:'',sourceId:null,reviewed:false,history:[]}]))}
export function applyEvidence(brief,turns,args){
 if(!args||!Object.hasOwn(FIELDS,args.field)||typeof args.value!=='string'||typeof args.quote!=='string')return {ok:false,error:'Invalid field or arguments'};
 const quote=args.quote.trim();
 const source=[...turns].reverse().find(t=>t.role==='user'&&quote.length>=4&&t.text.includes(quote));
 if(!source)return {ok:false,error:'The quote must exactly match a user transcript. Ask for clarification; never invent evidence.'};
 if(args.value.length>1200||quote.length>1800)return {ok:false,error:'Field too long'};
 const old=brief[args.field];if(old.value===args.value&&old.quote===quote)return {ok:true,unchanged:true};
 brief[args.field]={value:args.value.trim(),quote,sourceId:source.id,reviewed:false,history:[...old.history,...(old.value?[{value:old.value,quote:old.quote,sourceId:old.sourceId}]:[])]};
 return {ok:true,field:args.field,needsHumanReview:true};
}
export function markdown(brief,turns,mode){return '# Briefkeeper — briefing\n\nOrigem: '+mode+'\n\n'+Object.entries(FIELDS).map(([k,label])=>`## ${label}\n${brief[k].value||'Não informado'}\n\nEstado: ${brief[k].reviewed?'Revisado':'Pendente de revisão'}\n${brief[k].manual?'Edição humana: o valor foi alterado após a extração.\n':''}${brief[k].quote?'\nOrigem: “'+brief[k].quote+'”\n':''}`).join('\n')+'\n## Conversa\n'+turns.map(t=>`- ${t.role==='user'?'Cliente':'Agente'}: ${t.text}`).join('\n')}

export function applyUpdates(brief,turns,args){
 if(!Array.isArray(args?.updates)||args.updates.length<1||args.updates.length>7)return {ok:false,error:'Provide 1 to 7 explicit field updates'};
 const results=args.updates.map(update=>applyEvidence(brief,turns,update));
 return {ok:results.every(r=>r.ok),results,needsHumanReview:true};
}
