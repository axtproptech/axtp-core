import { P1, P2, P3 } from "@/features/terms/use/v1/paragraphs";
import { useAppContext } from "@/app/hooks/useAppContext";
import { SafeExternalLink } from "@/app/components/navigation/externalLink";

export const TermsOfUse = () => {
  const { Terms } = useAppContext();
  return (
    <>
      <article className="prose text-justify mx-auto">
        <h2>TERMO DE USO</h2>
        <h4>Curitiba, Março 2023</h4>
        <SafeExternalLink href={Terms.Use}>
          <u>Documento PDF</u>
        </SafeExternalLink>
        <P1 />
        <P2 />
        <P3 />
      </article>
      <div className="h-[64px]"></div>
    </>
  );
};
