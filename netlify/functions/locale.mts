export default async (_req:Request,context:{geo?:{country?:{code?:string}}})=>Response.json({country:context.geo?.country?.code||null},{headers:{'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});
export const config={path:'/api/locale'};
