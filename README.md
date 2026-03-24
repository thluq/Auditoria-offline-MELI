## 📦 OfflineTools-MELI(em desenvolvimento)
Hub de ferramentas logísticas para suporte operacional.

## 01. Auditoria de Rotas

Ferramenta de suporte operacional desenvolvida para auxiliar no processo de auditoria/aduana e conferência de carrinhos, especialmente em situações com problemas sistêmicos, divergências na contagem ou erros no envio de contagem pelo motorista.

O principal objetivo é garantir que a rota seja devidamente auditada, permitindo que o colaborador realize a conferência de forma ágil e eficiente, por meio de uma lógica de checklist inteligente.

##  Funcionalidades

- **Checklist em Tempo Real:** A lista de IDs previstos aparece em tela e é marcada automaticamente conforme os bipes ocorrem.
- **Validação Inteligente (Regex):** Filtra automaticamente bipes de etiquetas (11 dígitos), tratando códigos fora do padrão (como DANFEs de 44 dígitos) como "Inválidos".
- **Sinalização Visual por Cores:**
  - ⚪ **Cinza:** Item aguardando bipe.
  - 🟢 **Verde:** Item conferido com sucesso.
  - 🟠 **Laranja:** Item "A Mais" (ID de 11 dígitos que não estava na base).
  - 🔴 **Vermelho:** Item "Inválido" (Etiqueta fora do padrão ou erro de leitura).
- **Tratamento de Duplicatas:** Remove IDs repetidos na base de dados e alerta o usuário caso tente bipar o mesmo pacote duas vezes.
- **Exportação CSV:** Gera um relatório completo contendo os IDs conferidos, faltantes e as exceções encontradas.
- **Modo Offline:** Funciona inteiramente no navegador, sem necessidade de banco de dados ou internet após o carregamento inicial.

## Tecnologias Utilizadas

- **HTML5 & CSS3:** Interface responsiva seguindo a identidade visual "Mercado Livre".
- **JavaScript (Vanilla):** Lógica de processamento de dados, manipulação de DOM e Regex.
- **Git & GitHub:** Versionamento e deploy.

---

##  Como Usar

1. Acesse a ferramenta (via local ou [GitHub Pages](https://thluq.github.io/Auditoria-offline-MELI/)).
2. Cole a lista de IDs dos pacotes que deseja auditar no campo de configuração.
3. Clique em **"Iniciar Conferência"**.
4. Realize os bipes. A lista será atualizada automaticamente.
5. Ao finalizar, clique nos três pontos (⋮) e selecione **"Baixar Resultados (CSV)"** para salvar o relatório caso desejar.

---

## Desenvolvedor

**Thiago Lucas Nunes Gonçalves**
*Estudante de Engenharia da Computação*

---

Esta ferramenta é um projeto independente de automação local e **não constitui um sistema ou produto oficial**. Todos os direitos sobre logotipos, marcas e os nomes "Mercado Livre" e "Mercado Envios" pertencem exclusivamente à **Ebazar.com.br. LTDA**. O uso da identidade visual serve apenas para facilitar a familiaridade operacional dos colaboradores, sem qualquer intenção de uso indevido, comercialização ou violação de propriedade intelectual.
