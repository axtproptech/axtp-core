import {
  Step,
  StepConnector,
  stepConnectorClasses,
  StepIconProps,
  StepLabel,
  Stepper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { FC, ReactElement } from "react";
import { IconSeeding, IconUserCheck } from "@tabler/icons";
import { HowToVoteRounded } from "@mui/icons-material";

const Connector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: theme.palette.primary.main,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: theme.palette.primary.main,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

const StepIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    // @ts-ignore
    backgroundColor: theme.palette.primary[800],
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    // @ts-ignore
    backgroundColor: theme.palette.primary[200],
  }),
}));

function StepIconBuilder(
  icon: React.ReactElement<any, string | React.JSXElementConstructor<any>>
) {
  return (props: StepIconProps) => {
    const { active, completed, className } = props;
    return (
      <StepIconRoot ownerState={{ completed, active }} className={className}>
        {icon}
      </StepIconRoot>
    );
  };
}

interface StateType {
  label: string | ReactElement;
  completed: boolean;
  icon: ReactElement;
}

interface Props {
  state: StateType[];
}

export const ApprovalStepper: FC<Props> = ({ state }) => {
  let activeStep = state.findIndex(({ completed }) => !completed);
  activeStep = activeStep === -1 ? state.length : activeStep;

  return (
    <Stepper
      alternativeLabel
      activeStep={activeStep - 1}
      connector={<Connector />}
    >
      {state.map(({ label, icon }, index) => (
        <Step key={`${label}-${index}`}>
          <StepLabel StepIconComponent={StepIconBuilder(icon)}>
            {label}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};
