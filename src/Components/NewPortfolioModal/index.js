import React, { useState } from "react";
import Input from "../Input/input.js";
import Modal from "../Modal";
import { createPortfolio } from "../../Redux/Actions/portfolios";

const NewPortfolioModal = ({ user, isVisible, toggleVisible }) => {
  const [newPortfolioName, updatePortfolioName] = useState("");
  const handleAddNewPortfolio = () => {
    const portfolioInfo = {
      name: newPortfolioName,
      coins: {}
    };
    createPortfolio(user.uid, portfolioInfo);
    toggleVisible();
  };
  return (
    <Modal
      isVisible={isVisible}
      toggleModal={toggleVisible}
      title="Add a New Portfolio"
    >
      <Input
        color="secondary"
        autoFocus
        label="Name"
        value={newPortfolioName}
        onChange={name => updatePortfolioName(name)}
        handleSubmit={e => [e.preventDefault(), handleAddNewPortfolio()]}
        error={null}
      />
    </Modal>
  );
};

export default NewPortfolioModal;
