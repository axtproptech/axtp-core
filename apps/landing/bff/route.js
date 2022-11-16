import Boom from "@hapi/boom";

const toArray = (csv) => csv.split(",");
const AcceptedHosts = toArray(
  (process.env.NEXT_SERVER_ACCEPTED_HOSTS || "").toLowerCase()
);

export function route(routeArgs) {
  const { req, res } = routeArgs;
  const referrer = new URL(req.headers.referer || "http://localhost:3000");
  const handlerFunction = req.method
    ? // @ts-ignore
      routeArgs[req.method.toLowerCase()]
    : undefined;

  if (
    !(
      AcceptedHosts.length &&
      (AcceptedHosts[0] === "*" || AcceptedHosts.includes(referrer.host))
    )
  ) {
    console.error("Someone unauthorized tried to call this API", referrer);
    throw Boom.unauthorized();
  }

  try {
    if (handlerFunction) {
      return handlerFunction(req, res);
    } else {
      // if no handler than route does not exists
      res.status(404).end();
    }
  } catch (e) {
    console.error(`BFF Errored in [${req.method} ${handlerFunction.name}]`, e);
    // TODO: using 500 in case of unknown errors - we need another page for it,
    //  or some other less intrusive treatment, i.e. a message
    res.status(404).end();
  }

  return Promise.resolve();
}
