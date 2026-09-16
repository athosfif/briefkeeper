class PCMInput extends AudioWorkletProcessor{
 constructor(){super();this.samples=[];this.position=0;this.ratio=sampleRate/24000;this.packet=[]}
 process(inputs){const a=inputs[0]?.[0];if(!a)return true;this.samples.push(...a);while(this.position+1<this.samples.length){const i=Math.floor(this.position),f=this.position-i,v=this.samples[i]*(1-f)+this.samples[i+1]*f;this.packet.push(Math.max(-32768,Math.min(32767,Math.round(v*32767))));this.position+=this.ratio;if(this.packet.length===2400){const p=new Int16Array(this.packet);this.port.postMessage(p.buffer,[p.buffer]);this.packet=[]}}const n=Math.min(this.samples.length,Math.floor(this.position));this.samples.splice(0,n);this.position-=n;return true}
}registerProcessor('pcm-input',PCMInput);
