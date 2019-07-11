import React from "react";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";

const CurrencyButton = ({ selectedCurrency, onChange }) => (
  <ButtonGroup
    className="customButtonGroup"
    variant="contained"
    size="small"
    aria-label="Small contained button group"
  >
    <Button
      className="currencyButtonSelected"
      style={{ backgroundColor: "white" }}
    >
      USD
    </Button>
    <Button
      disabled
      className="currencyButton"
      style={{ backgroundColor: "white" }}
    >
      CAD
    </Button>
  </ButtonGroup>
);

CurrencyButton.defaultProps = {
  selectedCurrency: null,
  onChange: () => console.log("onChange not defined")
};

export default CurrencyButton;
