## 📱 Versão Mobile (Aplicativo Android)

Além do monitoramento via bot do Telegram e painel web, o **Space-Threat SOC** conta agora com um aplicativo nativo desenvolvido no **Android Studio** (integrado via Railway). O app serve como um centro de comando portátil para o analista acompanhar métricas de CTI e segurança em tempo real.

### 🖼️ Visão Geral das Telas do Aplicativo:

| 1. Tela Principal (Visão Geral) | 2. Detalhes Orbitais & Espaciais | 3. Atalho / Integração com Telegram |
| :---: | :---: | :---: |
| ![Tela Principal](assets/Tela%20Principal%20(Visão%20...jpeg) | ![Detalhes Orbitais](assets/Detalhes%20Orbitais%20e%20Espa....jpeg) | ![Integração com Telegram](assets/Integração%20com%20Teleg....jpeg) |

### 🔍 O que cada tela apresenta:

* **Tela Principal (Dashboard & Status):** 
  * Exibe o **Threat Level** atual (ex: *Moderate*), contagem de eventos nas últimas 24 horas e monitoramento de objetos LEO (Low Earth Orbit).
  * Possui o **AI Briefing & CTI Summary**, que traz um resumo executivo gerado por inteligência artificial simulando uma análise de SOC Sênior.
  * Contém a **Timeline Operacional** com alertas recentes de aproximação de detritos e atualizações de efemérides.

* **Detalhes Orbitais & Monitoramento Técnico:**
  * Lista o status online de feeds de inteligência de ameaças e dados espaciais (como *NEO Feed da NASA/JPL* e *Space Weather da NOAA*).
  * Monitoramento de radiação orbital (Cinturão de Van Allen), tráfego em constelações LEO e segurança cibernética com criptografia C2 ativa (AES-256).
  * Inclui um **Terminal ao Vivo** simulando logs de sistema (*SYSTEM ONLINE, NEO SYNC, FIREWALL SECURE*) para dar o toque real de um ambiente de operações de segurança.

* **Integração Direta:**
  * Botão de ação rápida **"Abrir Alertas no Telegram"**, permitindo que o operador salte imediatamente do aplicativo mobile para o chat interativo do bot de incidentes.
