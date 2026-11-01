# ProjeKan

ProjeKan é um app mobile para organizar projetos e tarefas em um espaço de trabalho local. Esta documentação acompanha a versão **1.3.0**.

## Funcionalidades

- **Quadro:** acompanhe projetos por status, reorganize cartões por arrastar e soltar e oculte ou revele colunas.
- **Visão geral:** consulte indicadores de progresso e projetos recentes.
- **Backlog:** mantenha ideias e projetos para organizar depois.
- **Tarefas:** crie listas, registre tarefas, edite itens e acompanhe o que foi concluído.
- **Detalhes do projeto:** registre descrição, responsável, prioridade, prazo, links, notas, imagens e propriedades personalizadas, incluindo releases.
- **Personalização:** escolha temas prontos — incluindo Windows 7 — ou edite cores, fonte, bordas e arredondamento.
- **Perfil e configurações:** personalize nome e foto, reveja o tutorial, configure lembretes diários e consulte as notas e atualizações.
- **Backup:** exporte projetos e tarefas em CSV e importe um backup para substituir esses dados no dispositivo.

Os dados do app são armazenados localmente no dispositivo. Imagens escolhidas pelo usuário são mantidas como referências locais; considere isso ao transferir dados entre dispositivos.

## Requisitos

- Node.js conforme a versão indicada em `package.json` (22.13+ ou versões compatíveis listadas ali).
- npm.
- Para executar em dispositivo ou emulador: ambiente nativo configurado para Expo/React Native.
- Para gerar o APK de distribuição interna: conta e configuração do EAS Build.

## Desenvolvimento

Instale as dependências:

```sh
npm ci
```

Inicie o Expo com tunnel:

```sh
npm start
```

Execute diretamente em um dispositivo/emulador Android ou em um ambiente iOS compatível:

```sh
npm run android
npm run ios
```

Verifique os tipos TypeScript:

```sh
npm run typecheck
```

## Build Android

Gere um APK de distribuição interna usando o perfil `preview` do EAS:

```sh
npm run build:apk
```

O comando exige acesso ao EAS configurado para este projeto.

## Estrutura do projeto

- `src/pages/`: telas principais do app.
- `src/components/`: componentes visuais e modais, organizados por funcionalidade.
- `src/hooks/`: estado e lógica reutilizável de interface.
- `src/stores/`: armazenamento local de projetos, tarefas e tema.
- `src/constants/`: configurações e changelog gerado.
- `src/utils/`: utilitários compartilhados.
- `CHANGELOG.md`: histórico de alterações; a versão consumida pelo app é gerada por `scripts/sync-changelog.cjs`.

Ao editar o changelog, sincronize a cópia usada no app com:

```sh
node scripts/sync-changelog.cjs
```
