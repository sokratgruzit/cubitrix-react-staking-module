import React from "react";
import { storiesOf } from "@storybook/react";
import { Staking } from "../components/Staking";

const stories = storiesOf("Staking", module);

stories.add("Staking", () => {
  return (
    <div>
      <Staking />
    </div>
  );
});
