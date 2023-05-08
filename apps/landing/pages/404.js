import React, { Fragment } from "react";
import Head from "next/head";
import ErrorSec from "containers/Error";

export default function Custom404() {
  return (
    <Fragment>
      <Head>
        <title>404: Not found</title>
      </Head>

      <ErrorSec />
    </Fragment>
  );
}
