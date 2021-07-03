import React from "react";
import ReactLoader from "react-loader-spinner";
import { colors } from "../../styles/theme";

const Loader = () => (
  <ReactLoader type="Oval" color={colors.cyan} height={100} width={100} />
);
export default Loader;
