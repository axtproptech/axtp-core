import { Body } from "@/app/components/layout/body";
import { Container } from "@/app/components/layout/container";
import { Button, Steps } from "react-daisyui";

export const AccountCreation = () => {
  const handleChange = (args: any) => {
    console.log(args);
  };

  return (
    <>
      <Button>Test</Button>
      <Container>
        <Body>
          <Steps onChange={handleChange}>
            <Steps.Step color="primary">Register</Steps.Step>
            <Steps.Step color="primary">Choose plan</Steps.Step>
            <Steps.Step>Purchase</Steps.Step>
            <Steps.Step>Receive Product</Steps.Step>
          </Steps>
          <div>New Account</div>

          <Button>Test</Button>
        </Body>
      </Container>
    </>
  );
};
