"""Local-only token broker. No audio/transcript persistence; no third-party dependencies."""
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from pathlib import Path
from urllib.request import Request,urlopen
from urllib.error import HTTPError,URLError
import os,json,secrets,time,threading,ssl
ROOT=Path(__file__).resolve().parent
env=ROOT/'.env'
if env.exists():
 for line in env.read_text().splitlines():
  if line.startswith('ASSEMBLYAI_API_KEY='):os.environ.setdefault('ASSEMBLYAI_API_KEY',line.split('=',1)[1].strip().strip('\"').strip("'"))
TLS=ssl.create_default_context(cafile='/etc/ssl/cert.pem') if Path('/etc/ssl/cert.pem').exists() else ssl.create_default_context()
KEY=os.environ.get('ASSEMBLYAI_API_KEY','')
CSRF=secrets.token_urlsafe(32); recent=[]; lock=threading.Lock(); PORT=int(os.environ.get('BRIEFKEEPER_PORT','8801'))
class Handler(SimpleHTTPRequestHandler):
 def __init__(self,*a,**kw):super().__init__(*a,directory=str(ROOT/'public'),**kw)
 def log_message(self,*a):pass
 def headers_safe(self):
  self.send_header('Cache-Control','no-store');self.send_header('X-Content-Type-Options','nosniff');self.send_header('Referrer-Policy','no-referrer');self.send_header('X-Frame-Options','DENY')
 def reply(self,status,data):
  body=json.dumps(data).encode();self.send_response(status);self.headers_safe();self.send_header('Content-Type','application/json');self.send_header('Content-Length',str(len(body)));self.end_headers();self.wfile.write(body)
 def do_GET(self):
  if self.headers.get('Host') not in [f'127.0.0.1:{PORT}',f'localhost:{PORT}']:return self.reply(403,{'error':'Local access only'})
  if self.path=='/api/config':return self.reply(200,{'configured':bool(KEY),'csrf':CSRF,'sessionSeconds':180})
  return super().do_GET()
 def do_POST(self):
  if self.path!='/api/voice-token':return self.reply(404,{'error':'Not found'})
  if self.headers.get('Origin') not in [f'http://127.0.0.1:{PORT}',f'http://localhost:{PORT}'] or self.headers.get('X-CSRF-Token')!=CSRF:return self.reply(403,{'error':'Invalid origin'})
  if not KEY:return self.reply(503,{'error':'A chave AssemblyAI ainda não foi configurada neste servidor. O exemplo simulado continua disponível.'})
  with lock:
   now=time.time();recent[:]=[t for t in recent if now-t<60]
   if len(recent)>=3:return self.reply(429,{'error':'Aguarde um minuto antes de abrir outra sessão.'})
   recent.append(now)
  try:
   request=Request('https://agents.assemblyai.com/v1/token?expires_in_seconds=60&max_session_duration_seconds=180',headers={'Authorization':'Bearer '+KEY})
   with urlopen(request,timeout=20,context=TLS) as r:data=json.load(r)
   if not isinstance(data.get('token'),str):return self.reply(502,{'error':'Resposta inesperada do serviço de voz.'})
   return self.reply(200,{'token':data['token']})
  except HTTPError as e:return self.reply(502,{'error':f'AssemblyAI não autorizou a sessão (HTTP {e.code}). Confira o acesso e os créditos da conta.'})
  except (URLError,TimeoutError,ValueError):return self.reply(502,{'error':'Não foi possível conectar à AssemblyAI. Tente novamente.'})
if __name__=='__main__':
 print(f'Briefkeeper: http://127.0.0.1:{PORT} — voice configured: {bool(KEY)}',flush=True)
 ThreadingHTTPServer(('127.0.0.1',PORT),Handler).serve_forever()
