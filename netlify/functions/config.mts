export default async () => Response.json({configured:!!Netlify.env.get('ASSEMBLYAI_API_KEY'),requiresAccessCode:true,sessionSeconds:180},{headers:{'Cache-Control':'no-store'}});
export const config={path:'/api/config'};
