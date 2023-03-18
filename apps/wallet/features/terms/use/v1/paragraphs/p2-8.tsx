import { SupportMailLink } from "@/features/terms/use/v1/paragraphs/supportMailLink";

export const P2_8 = () => (
  <section>
    <h4>2.8 Do suporte</h4>
    <ol type="1">
      <li>
        A AXT PROP TECH oferecerá suporte básico com relação as funcionalidades
        disponíveis no SITE, o que implica no esclarecimento de dúvidas com
        relação ao uso, erros decorrentes e outros.
      </li>
      <li>
        O serviço de suporte fornecido limita-se a esclarecimentos técnicos
        sobre a utilização do SITE da AXT PROP TECH e suas funcionalidades.
        Assim, pressupõe-se o necessário conhecimento em informática pelos
        USUÁRIOS, o que inclui o uso do computador e suas funções.
      </li>
      <li>
        Não estão inclusos nos serviços de suporte:
        <ol type="a">
          <li>
            Atendimento ao USUÁRIO por quaisquer outros meios senão por
            intermédio do e-mail <SupportMailLink />
          </li>
          <li>
            Orientações e serviços técnicos sobre informática, tais como a
            instalação e configuração de equipamentos, sistema operacional,
            problemas técnicos de infraestrutura, impressoras, rede, internet,
            problemas decorrentes de vírus ou da instalação de programas
            aplicativos e outros;
          </li>
        </ol>
      </li>
    </ol>
  </section>
);
