# Changelog

## [1.3.0]

### Adicionado

- Adicionado o preset Windows 7 ao editor de temas, com paleta azul clara e bordas suaves.
- Adicionado ao quadro um controle para exibir ou recolher as colunas ocultas; ele aparece apenas quando há colunas ocultas.
- Adicionado ao editor de cores um seletor RGB com espectro quadrado, controle de matiz, prévia e edição hexadecimal; a paleta existente foi mantida.

### Melhorado

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

- Corrigido o modal de detalhes do projeto no APK Android: quando o teclado abre durante a edição de propriedades, o modal inteiro sobe em vez de deslocar apenas o campo.
- Corrigida a migração de projetos para não adicionar projetos de demonstração quando já há dados salvos; os modelos iniciais permanecem apenas em instalações novas.

### Removido

- Removido o preset Rainbow porque sua combinação com a fonte Press Start 2P causava recortes em vários componentes; a fonte continua disponível para outros temas.
- Removidas as imagens `bkgImage.png` e `logo.jpg` dos projetos iniciais; referências antigas dessas imagens são limpas durante a migração dos dados salvos.

### Refatorado

- Separados os fluxos de lembretes e consulta de atualizações em hooks; seletor de horário, notas de versão e diálogos agora são módulos independentes.
