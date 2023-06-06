import React from "react";
import { LineWave } from "react-loader-spinner";
export default function Loader(props) {
  return (
    <div className="w-full m-auto ml-[5rem] -mt-7 -mb-8">
      <LineWave color="#4fa94d" visible={true} className="ml-14" />
    </div>
  );
}
