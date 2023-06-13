import React, { ReactElement } from "react";

function Card({ data, title }: { data: ReactElement; title: string }) {
  return (
    <div className="card  bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        {data}
      </div>
    </div>
  );
}

export default Card;
