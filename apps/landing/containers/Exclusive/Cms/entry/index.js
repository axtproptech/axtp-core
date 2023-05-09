import { useEffect, useState } from "react";
import { Icon } from "react-icons-kit";
import { ic_keyboard_arrow_left_twotone } from "react-icons-kit/md/ic_keyboard_arrow_left_twotone";

import Link from "next/link";
import format from "date-fns/format";
import ReactMarkdown from "react-markdown";
import Button from "common/components/Button";

// TODO: ADD DYNAMIC DATA INSTEAD OF POLICY .MD FILE USED
const CmsEntryPage = () => {
  const [policyText, setPolicyText] = useState("");
  useEffect(() => {
    fetch("/policies/privacy_policy_pt.md")
      .then((response) => response.text())
      .then(setPolicyText);
  }, []);

  return (
    <div className="flex flex-col pt-32 mb-24 max-w-4xl px-4 mx-auto gap-4">
      <div>
        <Link href="/exclusive/blog" passHref>
          <Button
            icon={<Icon icon={ic_keyboard_arrow_left_twotone} />}
            iconPosition="left"
            disabled={false}
            variant="extenfabvdedFab"
            colors="secondaryWithBg"
            title="Back To Blog"
            onClick={null}
          />
        </Link>
      </div>

      <div className="w-full flex xs:flex-col md:flex-row items-center justify-between px-4 gap-4">
        <div className="badge badge-warning badge-lg gap-2 font-bold">
          Company News
        </div>

        <div className="flex items-center justify-start gap-2">
          <div className="avatar">
            <div className="w-8 rounded-full">
              <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
            </div>
          </div>

          <p className="font-medium text-sm text-white opacity-80">
            Laura Lopez / {format(new Date(), "MMMM do',' yyyy")}
          </p>
        </div>
      </div>

      <div className="divider m-0"></div>

      <h1 className="text-white font-bold text-4xl tracking-tight">
        Announcing the new Investment Pool
      </h1>

      <h2 className="text-lg text-white opacity-80 line-clamp-6 mb-4">
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
      </h2>

      <article className="text-justify mx-auto w-full text-white">
        <ReactMarkdown>{policyText}</ReactMarkdown>
      </article>
    </div>
  );
};

export default CmsEntryPage;
