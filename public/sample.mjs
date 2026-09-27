// Fictional, deterministic walkthrough. This is never presented as a live voice session.
export function sampleConversation(language = 'en') {
  if (language === 'pt') return [
    {role:'agent',text:'O que você quer criar e para quem?'},
    {role:'user',text:'Quero lançar a marca de café Serra Clara. Preciso de identidade visual e um site.',updates:[
      {field:'objective',value:'Lançar a marca de café Serra Clara.',quote:'Quero lançar a marca de café Serra Clara.'},
      {field:'deliverables',value:'Identidade visual e site.',quote:'Preciso de identidade visual e um site.'}]},
    {role:'agent',text:'Quem vai comprar esse café?'},
    {role:'user',text:'Pessoas de 25 a 40 anos que compram cafés especiais. O visual deve ser acolhedor, com verde escuro e creme.',updates:[
      {field:'audience',value:'Pessoas de 25 a 40 anos que compram cafés especiais.',quote:'Pessoas de 25 a 40 anos que compram cafés especiais.'},
      {field:'direction',value:'Acolhedor, verde escuro e creme.',quote:'O visual deve ser acolhedor, com verde escuro e creme.'}]},
    {role:'user',text:'Corrigindo: não quero site. Só identidade visual e embalagem. Não temos prazo nem orçamento definidos ainda.',updates:[
      {field:'deliverables',value:'Identidade visual e embalagem. Site excluído.',quote:'Corrigindo: não quero site. Só identidade visual e embalagem.'}]},
    {role:'agent',text:'Atualizei: identidade visual e embalagem, sem site. Prazo e orçamento continuam em aberto. Há alguma restrição de produção?'}
  ];
  return [
    {role:'agent',text:'What would you like to create, and who is it for?'},
    {role:'user',text:'I want to launch the Serra Clara coffee brand. I need a visual identity and a website.',updates:[
      {field:'objective',value:'Launch the Serra Clara coffee brand.',quote:'I want to launch the Serra Clara coffee brand.'},
      {field:'deliverables',value:'Visual identity and website.',quote:'I need a visual identity and a website.'}]},
    {role:'agent',text:'Who will buy this coffee?'},
    {role:'user',text:'People aged 25 to 40 who buy specialty coffee. The design should feel warm, with dark green and cream.',updates:[
      {field:'audience',value:'People aged 25 to 40 who buy specialty coffee.',quote:'People aged 25 to 40 who buy specialty coffee.'},
      {field:'direction',value:'Warm, dark green and cream.',quote:'The design should feel warm, with dark green and cream.'}]},
    {role:'user',text:'Correction: I do not want a website. Just visual identity and packaging. We have not agreed on a deadline or a budget yet.',updates:[
      {field:'deliverables',value:'Visual identity and packaging. Website excluded.',quote:'Correction: I do not want a website. Just visual identity and packaging.'}]},
    {role:'agent',text:'Updated: visual identity and packaging, without a website. Timing and budget remain open. Are there any production constraints?'}
  ];
}
