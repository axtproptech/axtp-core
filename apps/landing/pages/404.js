import React, { Fragment } from "react";
import Head from "next/head";
import ResetCSS from "common/assets/css/style";
import ErrorSec from "containers/Error";

export default function Custom404() {
  return (
    <Fragment>
      <Head>
        <title>404: Not found</title>
      </Head>
      <ResetCSS />
      <div>
        <ErrorSec />
      </div>
    </Fragment>
  );
}
