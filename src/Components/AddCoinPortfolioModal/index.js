import React, { useState } from "react";
import Modal from "../Modal";
import Input from "../Input/input.js";
import { NUMBER_ONLY_REGX } from "../../constants";

const AddCoinPortfolioModal = ({
  isVisible,
  toggleVisible,
  coinToAdd,
  user,
  match,
  addCoinToPortfolio
}) => {
  const emptyErrorState = {
    amountInvestedError: false,
    amountPurchasedError: false
  };
  const [inputErrors, updateInputErrors] = useState(emptyErrorState);
  const [amountPurchased, updateAmountPurchased] = useState(null);
  const [amountInvested, updateAmountInvested] = useState(null);
  const handleAddCoinToPortfolio = () => {
    const isAmountInvestedValid = NUMBER_ONLY_REGX.test(amountInvested);
    const isAmountPurchasedValid = NUMBER_ONLY_REGX.test(amountPurchased);
    const payload = {
      accountKey: user.uid,
      portfolioKey: `-${match.params.id}`,
      coinInfo: {
        coin: coinToAdd,
        amountPurchased: parseInt(amountPurchased),
        amountInvested: parseInt(amountInvested)
      }
    };
    if (isAmountInvestedValid && isAmountPurchasedValid) {
      addCoinToPortfolio(payload);
      toggleVisible();
    } else {
      updateInputErrors({
        amountInvestedError: !isAmountInvestedValid,
        amountPurchasedError: !isAmountPurchasedValid
      });
    }
  };
  return (
    <Modal
      isVisible={isVisible}
      toggleModal={toggleVisible}
      title={`Add ${coinToAdd}`}
      onSubmit={() => handleAddCoinToPortfolio()}
    >
      <Input
        autoFocus
        color="secondary"
        label="Amount Purchased"
        type="number"
        value={amountPurchased}
        onChange={amountPurchased => updateAmountPurchased(amountPurchased)}
        handleSubmit={e => [e.preventDefault(), handleAddCoinToPortfolio()]}
        error={inputErrors.amountPurchasedError}
        helperText={
          inputErrors.amountPurchasedError
            ? "Please Enter a Positive Number"
            : null
        }
        clearError={() => updateInputErrors(emptyErrorState)}
      />
      <Input
        color="secondary"
        label="Amount Invested"
        type="number"
        value={amountInvested}
        onChange={amountInvested => updateAmountInvested(amountInvested)}
        handleSubmit={e => [e.preventDefault(), handleAddCoinToPortfolio()]}
        error={inputErrors.amountInvestedError}
        helperText={
          inputErrors.amountInvestedError
            ? "Please Enter a Positive Number"
            : null
        }
        clearError={() => updateInputErrors(emptyErrorState)}
      />
    </Modal>
  );
};

AddCoinPortfolioModal.defaultProps = {
  isVisible: false,
  toggleVisible: () => console.log("Toogle Visible Not Declared."),
  coinToAdd: "No Coin To Add Declared"
};

export default AddCoinPortfolioModal;
