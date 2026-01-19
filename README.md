# 💰 CarteiraManager

CarteiraManager é um ecossistema de produtividade pessoal desenvolvido com React Native. O projeto une um gestor financeiro robusto com um bloco de notas integrado e calendario interativo, focado em privacidade, performance offline e uma experiência de usuário fluida.

---

## 📸 Screenshots

Abaixo, a demonstração visual das principais funcionalidades do app. 

| Home Dashboard | LightMode | Gestor Despesas |
| :---: | :---: | :---: |
| <img src="./screenshots/1.png" width="200" /> | <img src="./screenshots/2.png" width="200" /> | <img src="./screenshots/3.png" width="200" /> |
| **Gestor Geral** | **Gestor Ganhos** | **Anotacoes** |
| <img src="./screenshots/4.png" width="200" /> | <img src="./screenshots/5.png" width="200" /> | <img src="./screenshots/6.png" width="200" /> |
| **PopUp Conta** | **Calendario** | **Calendario cards** |
| <img src="./screenshots/7.png" width="200" /> | <img src="./screenshots/8.png" width="200" /> | <img src="./screenshots/9.png" width="200" /> |
| **Detalhes card** | **Adicionar categoria** | **Adicionar anotacao** |
| <img src="./screenshots/10.png" width="200" /> | <img src="./screenshots/11.png" width="200" /> | <img src="./screenshots/12.png" width="200" /> |

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

### 🏗️ Como Rodar o Projeto

baixe o apk em releases e instale em seu dispositivo android
---

## 👨‍💻 Autor

**Kaynan Santos**
Estudante de Ciência da Computação na Universidade Estadual do Ceará (UECE). 

---
