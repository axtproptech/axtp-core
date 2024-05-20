import {useEffect, useRef, useState} from "react";
import {useAppContext} from "@/app/hooks/useAppContext";
import ReactMarkdown from "react-markdown";
import {useTranslation} from "next-i18next";
import {useAccount} from "@/app/hooks/useAccount";
import {PinInput} from "@/app/components/pinInput";
import {Button} from "react-daisyui";
import {RiEdit2Line, RiMailOpenLine} from "react-icons/ri";
import {useNotification} from "@/app/hooks/useNotification";
import {useLedgerService} from "@/app/hooks/useLedgerService";

interface Props {
    onSign: () => void;
}

export const StepSign = ({onSign}: Props) => {
    const ref = useRef(null);
    const {t} = useTranslation()
    const {customer, getKeys} = useAccount()
    const {KycService} = useAppContext();
    const  ledgerService = useLedgerService();
    const {showError} = useNotification()
    const [pin, setPin] = useState("")
    const [isSigning, setIsSigning] = useState(false)
    const [error, setError] = useState("")
    const sign = async () => {
        try {
            const keys = await getKeys(pin);


            // KycService.storeSignedDocument({})

        } catch (e: any) {
            showError("Invalid Pin")
            // @ts-ignore
            ref.current?.reset();
        }
    }

    return (
        <div className="flex flex-col">
            <section>
                <h3>Sign Terms</h3>
            </section>
            <section>
                <p>I, {customer?.firstName}, hereby declare that I have carefully read and understood the document
                    presented
                    to me.</p>
                <div className="flex flex-col justify-center gap-2">
                    <PinInput onPinChange={setPin} ref={ref}/>
                    <div className={"mt-4"}>
                        <Button
                            color="secondary"
                            onClick={sign}
                            disabled={isSigning}
                            startIcon={<RiEdit2Line/>}
                        >
                            {t("sign")}
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};
