import {timingSafeEqual} from 'node:crypto';
export default async (req:Request) => {
 const json=(status:number,body:object)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});
 if(req.method!=='POST')return json(405,{error:'Method not allowed'});
 const origin=new URL(req.url).origin;
 if(req.headers.get('Origin')!==origin)return json(403,{error:'Invalid origin'});
 const expected=Netlify.env.get('BRIEFKEEPER_ACCESS_CODE')||'';
 const supplied=req.headers.get('X-Demo-Code')||'';
 if(!expected||supplied.length>200||Buffer.byteLength(expected)!==Buffer.byteLength(supplied)||!timingSafeEqual(Buffer.from(expected),Buffer.from(supplied)))return json(401,{error:'Informe o código de acesso da demonstração.'});
 const key=Netlify.env.get('ASSEMBLYAI_API_KEY');
 if(!key)return json(503,{error:'Demonstração temporariamente indisponível.'});
 try{
 const r=await fetch('https://agents.assemblyai.com/v1/token?expires_in_seconds=60&max_session_duration_seconds=180',{headers:{Authorization:`Bearer ${key}`},signal:AbortSignal.timeout(15000)});
 if(!r.ok)return json(502,{error:'Não foi possível abrir a sessão de voz. Tente novamente mais tarde.'});
 const data=await r.json();if(typeof data.token!=='string')return json(502,{error:'Resposta inesperada do serviço.'});
 return json(200,{token:data.token});
 }catch{return json(502,{error:'Serviço de voz indisponível. Tente novamente.'})}
};
export const config={path:'/api/voice-token',rateLimit:{windowLimit:3,windowSize:180,aggregateBy:['ip','domain']}};
