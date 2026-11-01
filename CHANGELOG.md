# Changelog

## [1.3.0]

### Adicionado

- Adicionado o preset Windows 7 ao editor de temas, com paleta azul clara e bordas suaves.
- Adicionado ao quadro um controle para exibir ou recolher as colunas ocultas; ele aparece apenas quando há colunas ocultas.
- Adicionado ao editor de cores um seletor RGB com espectro quadrado, controle de matiz, prévia e edição hexadecimal; a paleta existente foi mantida.

### Melhorado

- O onboarding agora pergunta o nome da pessoa e apresenta orientações sobre projetos, quadro, backlog, propriedades, tarefas, visão geral, personalização e backups, sem criar ou remover projetos e tarefas.
- A exportação e a importação de projetos, listas e tarefas agora usam uma seed única em vez de CSV.
- Os ícones das ações do perfil agora representam melhor tutorial, personalização e importação ou exportação de dados.
- Os modais dos seletores de cores, datas e horários agora limitam sua altura à área disponível e mantêm cabeçalhos e ações acessíveis com conteúdo rolável.
- A edição de propriedades do projeto agora organiza os campos e ações para evitar overflow em telas estreitas.
- Na tela de configurações, a versão instalada recebe o rótulo "Desenvolvimento" em builds de desenvolvimento; a comparação com releases continua usando a versão numérica.
- Os alertas e confirmações do app passaram a usar diálogos próprios. Os seletores de data e horário também usam modais personalizados, e seus cantos e os sliders do editor de temas acompanham o arredondamento configurado.
- O seletor de data agora tem calendário próprio, navegação entre meses, atalho para hoje e destaque para a data selecionada.
- O seletor de horário agora usa controles próprios para horas e minutos, atalhos de minuto e formato de 24 horas.
- As rotas do modal de perfil agora têm contorno e indicador de avanço; a ação de editar o nome ficou menos destacada.
- As rotas do modal de perfil agora seguem as cores, bordas e o arredondamento do tema aplicado.
- A ação de apagar todo o conteúdo foi movida do modal de perfil para uma seção própria nas configurações, mantendo a confirmação antes da exclusão.
- Os slogans dos cabeçalhos das rotas foram limitados a uma linha para evitar que ocupem espaço excessivo.
- A prévia do editor de temas foi aproximada da interface atual, incluindo cabeçalho, cartões, indicadores e navegação inferior.
- A seção "Forma e tipografia" do editor de temas agora pode ser expandida e recolhida.

### Corrigido

- Corrigida a exibição dos logos dos projetos recentes na Visão geral.
- Corrigido o overflow do teclado nos formulários de projeto, na edição de tarefas e nos detalhes do projeto.
- Corrigidos o layout da paleta de cores e o posicionamento do botão de conclusão no seletor.
- Corrigido o modal de detalhes do projeto no APK Android: quando o teclado abre durante a edição de propriedades, o modal inteiro sobe em vez de deslocar apenas o campo.

### Removido

- Removido o preset Rainbow porque sua combinação com a fonte Press Start 2P causava recortes em vários componentes; a fonte continua disponível para outros temas.
- Removido o mecanismo de projetos-modelo e a inclusão automática de exemplos em instalações novas; as migrações preservam os projetos já salvos.
- Removidas as imagens `bkgImage.png` e `logo.jpg` que eram usadas nos projetos-modelo.

### Refatorado

- Separados os fluxos de lembretes e consulta de atualizações em hooks; seletor de horário, notas de versão e diálogos agora são módulos independentes.
