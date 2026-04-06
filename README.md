# Mecânica BMI

> Projeto institucional desenvolvido como portfólio e demonstração de habilidades em desenvolvimento web.

## 📖 Descrição
O projeto **Mecânica BMI** é um site institucional estático para uma organização mecânica fictícia. Ele foi idealizado para exibir uma interface moderna com forte inspiração no universo automotivo e gamer, utilizando uma paleta de cores preta e laranja. O layout foi construído prezando pela melhor experiência do usuário, oferecendo navegação fluida, interações dinâmicas e design totalmente responsivo para desktop e mobile.

## ⚠️ Observação Importante
- **Sem Backend:** O site é composto unicamente por tecnologias front-end (HTML, CSS, JS).
- **Simulação Visual:** O sistema de envio de formulários (contato, recrutamento) e upload de comprovantes no pagamento funcionam apenas visualmente como simulação (sem envio de fato para um banco de dados).
- **Propósito Institucional:** O projeto foi idealizado puramente como um portfólio para a apresentação e demonstração prática de habilidades de desenvolvimento web.

## 🚀 Tecnologias Utilizadas
- **HTML5:** Modularização e semântica;
- **CSS3:** Layouts em Flex/Grid, variáveis de ambiente, responsividade e animações;
- **JavaScript (Vanilla):** Funcionalidades interativas, gerenciamento de abas, cálculos matemáticos automatizados, scroll suave e manipulação do DOM.

## ⚙️ Funcionalidades
- **Design Moderno:** Tema automotivo premium focado num mix de cores dark e laranja.
- **Responsividade:** Interface readaptável visualmente de celulares a monitores ultrawide.
- **Navegação Inteligente:** Scroll suave para seções específicas.
- **Interatividade Mobile:** Menu lateral (hambúrguer) responsivo em dispositivos de tela menor.
- **Sistema de Abas:** Exibição elegante e sem recarregamento para módulos de Serviços.
- **Simulador de Preços:** Área de compra de horas e cargos de hierarquia com cálculo automático do valor em tempo real.
- **Sistema de Pagamento Fake:** Integração visual de interface de pagamento via PIX (QR Code e chave de copia/cola) e envio de comprovante com feedback visual.
- **Sessões Administrativas:** Conteúdos densos organizados contemplando regras, FAQ, dados operacionais e a distribuição da hierarquia.
- **Pronto para Hospedagem:** A estrutura de roteamento estático permite hospedar na nuvem gratuitamente (GitHub Pages, Cloudflare Pages, etc).

## 📁 Estrutura de Pastas
O projeto está organizado da seguinte maneira para otimizar a manutenibilidade:

```text
mecanica-bmi/
├── assets/         # Imagens, logotipos, fontes e demais arquivos e mídias
├── css/            # Folhas de estilo locais (style.css, variáveis globais)
├── js/             # Funcionalidades dinâmicas do front-end (app.js)
├── index.html      # Base contendo a marcação primária da página
└── README.md       # Documentação principal
```

## 💻 Como Rodar Localmente
1. **Clone o repositório em sua máquina:**
   ```bash
   git clone https://github.com/seu-usuario/mecanica-bmi.git
   ```
2. **Abra a pasta do projeto:**
   ```bash
   cd mecanica-bmi
   ```
3. **Execute o arquivo:**
   Você pode simplesmente dar um duplo clique no arquivo `index.html` para abri-lo em seu navegador padrão. 
   *(Recomendação: Utilize a extensão "Live Server" do Visual Studio Code para recarregamento automático).*

## 🌐 Como Publicar no GitHub Pages
Se desejar hospedar e visualizar este projeto de forma online gratuitamente, o GitHub Pages é o serviço recomendado.
1. Suba/envie os arquivos desta pasta raiz para um repositório seu no **GitHub**.
2. Vá até o repositório, clique na aba **Settings** *(Configurações)*.
3. No menu esquerdo, navegue até **Pages**.
4. Em _Build and deployment_, escolha a opção "Source" como **Deploy from a branch**.
5. Selecione a branch `main` (ou `master`), utilizando a pasta raiz `/(root)` e salve.
6. Em minutos, seu site entrará no ar e o domínio ficará visível no topo da página de configurações. É possível apontá-lo para um domínio customizado via **Cloudflare** utilizando as configurações de DNS.

---

## 🎖️ Créditos
- **Desenvolvimento:** [Oliveira Strategic](https://github.com/) 
- O projeto foi desenvolvido com atenção e foco sendo utilizado especificamente para fins de demonstração prática e validação de expertise.
