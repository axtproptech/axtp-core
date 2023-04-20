import { CSSProperties } from "react";

interface Props {
  style: CSSProperties;
}

export const TransactionItem = ({ style }: Props) => {
  return (
    <div className="card card-side bg-base-100 shadow-xl" style={style}>
      <figure>
        <img src="/assets/img/signumjs.svg" alt="Movie" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">New movie is released!</h2>
        <p>Click the button to watch on Jetflix app.</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Watch</button>
        </div>
      </div>
    </div>
  );
};
