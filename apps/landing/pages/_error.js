import React, { Fragment } from "react";
import Head from "next/head";
import ErrorSec from "containers/Error";

export default function Error({ statusCode }) {
  return (
    <Fragment>
      <Head>
        <title>404: Not found</title>
      </Head>

      <div>
        {statusCode ? (
          `An error ${statusCode} occurred on server`
        ) : (
          <ErrorSec />
        )}
      </div>
    </Fragment>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};
