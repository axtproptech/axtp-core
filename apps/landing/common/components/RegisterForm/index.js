import JotForm from "jotform-react";

const JotFormId = process.env.NEXT_PUBLIC_JOTFORM_ID;

export const RegisterForm = () => {
  return (
    <div>
      <JotForm
        formURL={`https://form.jotform.com/${JotFormId}`}
        formID={JotFormId}
      />
    </div>
  );
};
