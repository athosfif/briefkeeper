import {test} from 'node:test';
import assert from 'node:assert/strict';
import {sampleConversation} from '../public/sample.mjs';
import {emptyBrief,applyEvidence,reviewSummary} from '../public/core.mjs';

for (const language of ['en','pt']) test(`${language}: correction has exact source evidence, history and no invented unknowns`,()=>{
  const brief=emptyBrief(),turns=[];
  for (const step of sampleConversation(language)) {
    turns.push({id:'turn-'+turns.length,role:step.role,text:step.text});
    for (const update of step.updates||[]) assert.equal(applyEvidence(brief,turns,update).ok,true);
  }
  assert.deepEqual(reviewSummary(brief),{filled:4,reviewed:0});
  assert.equal(brief.deliverables.history.length,1);
  assert.match(brief.deliverables.value,language==='en'?/packaging.*excluded/:/embalagem.*excluído/);
  assert.match(brief.deliverables.history[0].value,language==='en'?/website/:/site/);
  for (const key of ['budget','timing','constraints']) assert.equal(brief[key].value,'');
  for (const field of Object.values(brief).filter(x=>x.value)) {
    const source=turns.find(x=>x.id===field.sourceId);
    assert.equal(source.role,'user');assert.ok(source.text.includes(field.quote));
  }
});
