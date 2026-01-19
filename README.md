# 💰 CarteiraManager

CarteiraManager é um ecossistema de produtividade pessoal desenvolvido com React Native. O projeto une um gestor financeiro robusto com um bloco de notas integrado e calendario interativo, focado em privacidade, performance offline e uma experiência de usuário fluida.

---

## 📸 Screenshots

Abaixo, a demonstração visual das principais funcionalidades do app. 
*(Para visualizar as imagens, adicione seus prints na pasta `assets/screenshots/`)*

| Home Dashboard | Gestor de Contas | Calendário Dinâmico |
| :---: | :---: | :---: |
| <img src="./assets/screenshots/home.png" width="200" /> | <img src="./assets/screenshots/expenses.png" width="200" /> | <img src="./assets/screenshots/calendar.png" width="200" /> |
| **Bloco de Notas** | **Filtros por Período** | **Análise com Gráficos** |
| <img src="./assets/screenshots/notes.png" width="200" /> | <img src="./assets/screenshots/filters.png" width="200" /> | <img src="./assets/screenshots/charts.png" width="200" /> |
| **Modo Escuro (UI)** | **Detalhes de Transação** | **Categorias Custom** |
| <img src="./assets/screenshots/dark_mode.png" width="200" /> | <img src="./assets/screenshots/details.png" width="200" /> | <img src="./assets/screenshots/categories.png" width="200" /> |

---

## 🚀 Diferenciais de Engenharia

Desenvolvido com foco em boas práticas de Engenharia de Software:

* **Persistência Offline (SQLite):** Implementação de banco de dados relacional local com `expo-sqlite`. Utiliza o modo **WAL (Write-Ahead Logging)** para garantir que as operações de leitura/escrita não bloqueiem a interface.
* **Gerenciamento de Estado Global:** Uso de **Context API** (`ThemeContext`) para orquestrar temas dinâmicos (Dark/Light Mode) de forma consistente em todo o app.
* **Otimização de Performance:** Aplicação de **Memoização** com hooks `useCallback` e `useMemo`, evitando ciclos de re-renderização custosos em listas de transações e cálculos de gráficos.
* **Segurança de Tipos:** Código 100% escrito em **TypeScript**, com interfaces bem definidas para transações, notas e categorias, reduzindo erros em tempo de execução.
* **Arquitetura de Navegação:** Estrutura baseada em arquivos com **Expo Router**, garantindo uma árvore de rotas limpa e intuitiva.

---

## 🛠️ Tecnologias Utilizadas

* **Framework:** [React Native](https://reactnative.dev/) com [Expo](https://expo.dev/)
* **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
* **Banco de Dados:** [SQLite](https://www.sqlite.org/index.html) (via expo-sqlite)
* **Visualização de Dados:** [React Native Gifted Charts](https://github.com/Abhinandan-Kushwaha/react-native-gifted-charts)
* **Ícones:** [Lucide React Native](https://lucide.dev/)
* **Navegação:** [Expo Router](https://docs.expo.dev/routing/introduction/)

---

## 🏗️ Como Rodar o Projeto

---

## 👨‍💻 Autor

**Kaynan Santos**
Estudante de Ciência da Computação na Universidade Estadual do Ceará (UECE). 
Interessado em desenvolvimento mobile, segurança da informação e engenharia de software eficiente.

---
