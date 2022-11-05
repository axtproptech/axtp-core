import React, { useState } from "react";
import PropTypes from "prop-types";
import CountUp from "react-countup";
import Box from "common/components/Box";
import NextImage from "common/components/NextImage";
import Card from "common/components/Card";
import Text from "common/components/Text";
import Heading from "common/components/Heading";
import Button from "common/components/Button";
import FeatureBlock from "common/components/FeatureBlock";
import Container from "common/components/UI/Container";
import WorkHistoryWrapper, { CounterUpArea } from "./workHistory.style";
import shape1 from "common/assets/image/cryptoModern/oliver-hager-colored.webp";

const Items = {
  default: {
    title: "Conheça os experts",
    description:
      "A expertise da AXT PropTech é caracterizada por anos de experiência e extensa rede de relacionamentos nas áreas de gestão de negócios, administração, consultoria financeira e engenharia de software.",
  },
  oliver: {
    title: "Oliver Hager, CTO",
    description:
      "Oliver Hager é o especialista em blockchain, contratos inteligentes e tokenização. Ele possui um mestrado em Ciência da Computação, é membro da equipe central da Signum Blockchain, palestrante em conferências, defensor do código aberto e um desenvolvedor de software apaixonado.",
    link: "https://www.linkedin.com/in/oliverhager",
  },
  osman: {
    title: "Osman Lima, COO",
    description: "Osman Lime é ...",
    link: "https://www.linkedin.com/in/osman-lima-41378018/",
  },
  daniel: {
    title: "Daniel Heuri, CEO",
    description: "Daniel Heuri é ...",
    link: "https://www.linkedin.com/in/danielheuri/",
  },
  danniel: {
    title: "Danniel Covo, CMO",
    description: "Danniel Covo  é ...",
    link: "https://www.linkedin.com/in/danniel-covo/",
  },
};

const WorkHistory = ({ row, col, cardStyle, btnStyle }) => {
  const [selected, setSelected] = useState(Items.default);

  const handleSelect = (selection) => () => {
    setSelected(Items[selection] || Items.default);
  };

  const openLink = (link) => () => {
    window.open(link, "_blank", "noreferrer noopener");
  };

  return (
    <WorkHistoryWrapper id="workHistorySection">
      <Container>
        <Box className="row" {...row}>
          <Box className="col" {...col}>
            <CounterUpArea>
              <Card
                onClick={handleSelect("daniel")}
                className="card"
                {...cardStyle}
              >
                <NextImage src={shape1} alt="Daniel Heuri, CEO" />
                <h2>
                  Daniel Heuri
                  <Text content="CEO" />
                  {/*<CountUp start={0} end={75000} />+*/}
                </h2>
              </Card>
              <Card
                onClick={handleSelect("osman")}
                className="card"
                {...cardStyle}
              >
                <NextImage src={shape1} alt="Osman Lima, COO" />
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
                <NextImage src={shape1} alt="Oliver Hager, CTO" />
                <h2>
                  Oliver Hager
                  <Text content="CTO" />
                  {/*<CountUp start={0} end={75000} />+*/}
                </h2>
              </Card>
              <Card
                onClick={handleSelect("danniel")}
                className="card"
                {...cardStyle}
              >
                <NextImage src={shape1} alt="Danniel Covo, CMO" />
                <h2>
                  Danniel Covo
                  <Text content="CMO" />
                  {/*<CountUp start={0} end={75000} />+*/}
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
                  <Button
                    title="LinkedIn"
                    variant="textButton"
                    icon={<i className="flaticon-next" />}
                    onClick={openLink(selected.link)}
                    {...btnStyle}
                  />
                )
              }
            />
          </Box>
        </Box>
      </Container>
    </WorkHistoryWrapper>
  );
};

// WorkHistory style props
WorkHistory.propTypes = {
  sectionHeader: PropTypes.object,
  sectionTitle: PropTypes.object,
  sectionSubTitle: PropTypes.object,
  row: PropTypes.object,
  col: PropTypes.object,
  cardStyle: PropTypes.object,
};

// WorkHistory default style
WorkHistory.defaultProps = {
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

export default WorkHistory;
