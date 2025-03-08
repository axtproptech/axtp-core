import React, { useState } from "react";
import PropTypes from "prop-types";
import Box from "common/components/Box";
import NextImage from "common/components/NextImage";
import Card from "common/components/Card";
import Text from "common/components/Text";
import Heading from "common/components/Heading";
import FeatureBlock from "common/components/FeatureBlock";
import Container from "common/components/UI/Container";
import ExpertsTeamWrapper, { CounterUpArea } from "./expertsTeam.style";
import oliver from "common/assets/image/cryptoModern/oliver-hager.webp";
import danniel from "common/assets/image/cryptoModern/danniel-covo.webp";
import osman from "common/assets/image/cryptoModern/osman-lima.webp";
import danielh from "common/assets/image/cryptoModern/daniel-heuri.webp";
import Link from "common/components/Link";

const Items = {
  default: {
    title: "Conheça os experts",
    description:
      "A expertise da AXT PropTech é caracterizada por anos de experiência e extensa rede de relacionamentos nas áreas de gestão de negócios, administração, consultoria financeira e engenharia de software.",
  },
  oliver: {
    title: "Oliver Hager, CTO",
    description:
      "Oliver Hager é o especialista em blockchain, contratos inteligentes e tokenização. Ele possui um amplo conhecimento na engenharia de software, tanto no desenvolvimento, quanto nos processos ágeis. Ele é Mestre em Ciência da Computação, palestrante em conferências, e um dos membros principais da comunidade internacional da Signum Network.",
    link: "https://www.linkedin.com/in/oliverhager",
  },
  osman: {
    title: "Osman Lima, COO",
    description:
      "Osman Lima se conecta com todas as áreas do negócio e sua gestão. Formado em Engenharia da Computação, professor, desenvolvedor de software, gestor, investidor. Entusiasta de tecnologia e suas aplicações.",
    link: "https://www.linkedin.com/in/osman-lima",
  },
  daniel: {
    title: "Daniel Heuri, CEO",
    description:
      "Daniel Heuri é um reconhecido especialista financeiro internacional com ampla experiência em consultoria e educação financeira. Entre outras, ele é CEO da NXT Advisors, Prof. Pós-Graduação na FGV, Eng. Poli, Mestre Adm. da FEA-USP, Consultor CVM, Cert. CEA, Advisor Financeiro e Expert em Tranquilidade Financeira, Angel Investor na Poli Angels e membro das sociedades MENSA e MDRT.",
    link: "https://www.linkedin.com/in/danielheuri",
  },
  danniel: {
    title: "Danniel Covo, CMO",
    description:
      "Danniel Covo é profissional de TI com experiência em relacionamento comercial, técnico e liderança de equipes. Também é mentor de investimentos, com grande alcance no marketing digital. Pronto para assumir o papel estratégico de CMO, trazendo expertise em TI, relacionamento comercial e marketing para impulsionar o sucesso da empresa.",
    link: "https://www.linkedin.com/in/danniel-covo",
  },
};

const ExpertsTeam = ({ row, col, cardStyle }) => {
  const [selected, setSelected] = useState(Items.default);

  const handleSelect = (selection) => () => {
    setSelected(Items[selection] || Items.default);
  };

  return (
    <ExpertsTeamWrapper id="experts">
      <Container>
        <Box className="row" {...row}>
          <Box className="col" {...col}>
            <CounterUpArea>
              <Card
                onClick={handleSelect("daniel")}
                className="card"
                {...cardStyle}
              >
                <NextImage src={danielh} alt="Daniel Heuri, CEO" />
                <h2>
                  Daniel Heuri
                  <Text content="CEO" />
                </h2>
              </Card>
              <Card
                onClick={handleSelect("osman")}
                className="card"
                {...cardStyle}
              >
                <NextImage src={osman} alt="Osman Lima, COO" />
                <h2>
                  Osman Lima
                  <Text content="COO" />
                </h2>
              </Card>
              <Card
                onClick={handleSelect("oliver")}
                className="card"
                {...cardStyle}
              >
                <NextImage src={oliver} alt="Oliver Hager, CTO" />
                <h2>
                  Oliver Hager
                  <Text content="CTO" />
                </h2>
              </Card>
              <Card
                onClick={handleSelect("danniel")}
                className="card"
                {...cardStyle}
              >
                <NextImage src={danniel} alt="Danniel Covo, CMO" />
                <h2>
                  Danniel Covo
                  <Text content="CMO" />
                </h2>
              </Card>
            </CounterUpArea>
          </Box>
          <Box className="col" {...col}>
            <FeatureBlock
              title={<Heading content={selected.title} />}
              description={<Text content={selected.description} />}
              button={
                selected.link && (
                  <Link
                    href={selected.link}
                    style={{ color: "white" }}
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    LinkedIn&nbsp;
                    <i className="flaticon-next" />
                  </Link>
                )
              }
            />
          </Box>
        </Box>
      </Container>
    </ExpertsTeamWrapper>
  );
};

// WorkHistory style props
ExpertsTeam.propTypes = {
  sectionHeader: PropTypes.object,
  sectionTitle: PropTypes.object,
  sectionSubTitle: PropTypes.object,
  row: PropTypes.object,
  col: PropTypes.object,
  cardStyle: PropTypes.object,
};

// WorkHistory default style
ExpertsTeam.defaultProps = {
  // WorkHistory section row default style
  row: {
    flexBox: true,
    flexWrap: "wrap",
    ml: "-15px",
    mr: "-15px",
  },
  // WorkHistory section col default style
  col: {
    pr: "15px",
    pl: "15px",
    width: [1, 1, 1 / 2, 1 / 2],
    flexBox: true,
    alignSelf: "center",
  },
  // Card default style
  cardStyle: {
    p: ["20px 20px", "30px 20px", "30px 20px", "53px 40px"],
    borderRadius: "10px",
  },

  // Button default style
  btnStyle: {
    minWidth: "156px",
    fontSize: "14px",
    fontWeight: "500",
  },
};

export default ExpertsTeam;
