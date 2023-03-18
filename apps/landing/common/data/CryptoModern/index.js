/* ------------------------------------ */
// Navbar data section
/* ------------------------------------ */
import logo from "common/assets/image/cryptoModern/logo.svg";

export const navbar = {
  logo: logo,
  navMenu: [
    {
      id: 1,
      label: "Home",
      path: "#home",
      offset: "84",
    },
    // {
    //   id: 2,
    //   label: "O Maior Mercado",
    //   path: "#key-features",
    //   offset: "81",
    // },
    {
      id: 3,
      label: "Expertise",
      path: "#experts",
      offset: "81",
    },
    {
      id: 4,
      label: "Mercado",
      path: "#markets",
      offset: "81",
    },
    {
      id: 5,
      label: "Compliance",
      path: "#compliance",
      offset: "81",
    },
    {
      id: 6,
      label: "FAQ",
      path: "#faqSection",
      offset: "81",
    },
  ],
};

/* ------------------------------------ */
// Features data section
/* ------------------------------------ */
import featureIcon1 from "common/assets/image/cryptoModern/icons/008-property.png";
import featureIcon2 from "common/assets/image/cryptoModern/icons/011-access.png";
import featureIcon3 from "common/assets/image/cryptoModern/icons/001-blockchain.png";
import featureIcon4 from "common/assets/image/cryptoModern/icons/013-participation.png";

export const Features = [
  {
    id: 1,
    icon: featureIcon1,
    title: "Mercado Imobiliário",
    description:
      "Maturidade, solidez e liquidez de uma economia bicentenária em moeda forte.",
  },
  {
    id: 2,
    icon: featureIcon2,
    title: "Acesso Simplificado",
    description:
      "Tenha acesso simplificado ao maior mercado imobiliário usando tecnologia inovadora.",
  },
  {
    id: 3,
    icon: featureIcon3,
    title: "Tecnologia Disruptiva",
    description:
      "Alinhado com a ESG usamos uma blockchain sustentável garantindo transparência e segurança.",
  },
  {
    id: 4,
    icon: featureIcon4,
    title: "Participe Agora",
    description:
      "Cadastre-se para receber mais informações sobre o mercado e a plataforma.",
  },
];

/* ------------------------------------ */
// Wallet  data section
/* ------------------------------------ */
import walletIcon1 from "common/assets/image/cryptoModern/wallet1.png";
import walletIcon2 from "common/assets/image/cryptoModern/wallet2.png";
import walletIcon3 from "common/assets/image/cryptoModern/wallet3.png";
import colors from "common/theme/cryptoModern/colors";

export const WalletFeatures = [
  {
    id: 1,
    icon: walletIcon1,
    title: "Secure transfers with verified Casinos.",
  },
  {
    id: 2,
    icon: walletIcon2,
    title: "Easily buy and sell CLV within the wallet",
  },
  {
    id: 3,
    icon: walletIcon3,
    title: "Pay as many as you want",
  },
];

/* ------------------------------------ */
// Faq  data section
/* ------------------------------------ */

export const Faq = [
  {
    id: 1,
    title: "O que a AXT faz?",
    description:
      "Somos uma empresa de tecnologia especializada em blockchain e à aplicando de forma inovadora na construção de patrimônio.",
  },
  {
    id: 2,
    title: "Porque usar blockchain?",
    description:
      "As transações são armazenadas em centenas de servidores em todo o mundo (absolutamente decentralizadas) e estão, portanto, sempre disponíveis. Os dados são protegidos por métodos criptográficos e ficam imutáveis (é um livro registro permanente). Todas as transações são passíveis de auditoria pública e, portanto, garantem total transparência.",
  },
  {
    id: 2,
    title: "Qual blockchain a AXT usa?",
    description: (
      <>
        Contamos com a{" "}
        <a
          href="https://signum.network"
          target="_blank"
          rel="noreferrer noopener"
          style={{ color: colors.textColor, textDecoration: "underline" }}
        >
          Signum Network
        </a>
        . Esta é uma plataforma de blockchain pública com um enorme conjunto de
        características. Os custos de transação são muito baixos e a Signum
        também utiliza uma forma de mineração muito eficiente em termos
        energéticos. No decorrer de nossa política do ESG, esta é a escolha
        ideal.
      </>
    ),
  },
  {
    id: 3,
    title: "Porque o mercado americano?",
    description:
      "Como maior mercado imobiliário do mundo temos diversas oportunidades únicas e economicamente vantajosas. Além disso, possui maturidade e solidez suficientes para nos garantir segurança patrimonial.",
  },
  // {
  //   id: 4,
  //   title: "New update fixed all bug and issues?",
  //   description:
  //     "We are giving the update of this theme continuously . You will receive an email Notification when we push an update. Always try to be updated with us .",
  // },
];

/* ------------------------------------ */
// Footer data section
/* ------------------------------------ */
export const Footer_Data = [
  {
    title: "About Us",
    menuItems: [
      {
        url: "mailto:support@axtp.com.br",
        text: "Suporte",
      },
      {
        url: "#experts",
        text: "About Us",
      },

      // {
      //   url: "#",
      //   text: "Copyright",
      // },
    ],
  },
  {
    title: "Políticas",
    menuItems: [
      {
        id: "privacy",
        url: "/policy/privacy",
        text: "Política de Privacidade",
      },
      {
        id: "usage",
        url: "/policy/usage",
        text: "Termos de Uso",
      },
    ],
  },
];
