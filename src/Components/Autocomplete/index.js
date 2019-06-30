import React from "react";
import deburr from "lodash/deburr";
import * as Autosuggest from "react-autosuggest";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import Popper from "@material-ui/core/Popper";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";

function renderInputComponent(inputProps) {
  const { classes, inputRef = () => {}, ref, ...other } = inputProps;
  return (
    <div className="flex">
      <TextField
        fullWidth
        InputProps={{
          inputRef: node => {
            ref(node);
            inputRef(node);
          },
          classes: {
            input: classes.input
          }
        }}
        {...other}
      />
      <IconButton style={{ color: "red" }} aria-label="Add">
        <AddIcon />
      </IconButton>
    </div>
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.label, query);
  const parts = parse(suggestion.label, matches);
  return (
    <MenuItem selected={isHighlighted} component="div">
      <img
        src={suggestion.image}
        alt={suggestion.image}
        style={{ height: "24px", width: "24px", marginRight: "10px" }}
      />
      <div>
        {parts.map(part => (
          <span
            key={part.text}
            style={{ fontWeight: part.highlight ? 600 : 400 }}
          >
            {part.text}
          </span>
        ))}
      </div>
    </MenuItem>
  );
}

function getSuggestions(value, suggestionList) {
  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;
  return inputLength === 0
    ? []
    : suggestionList.filter(suggestion => {
        const keep =
          count < 5 &&
          suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;
        if (keep) {
          count += 1;
        }
        return keep;
      });
}

function getSuggestionValue(suggestion) {
  return suggestion.label;
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  container: {
    position: "relative"
  },
  suggestionsContainerOpen: {
    position: "absolute",
    zIndex: 999,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0
  },
  suggestion: {
    display: "block"
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: "none"
  },
  divider: {
    height: theme.spacing(2)
  }
}));

export default function IntegrationAutosuggest({ coins, onAdd }) {
  const suggestionList = [];
  coins.length > 0 &&
    coins.map(coin =>
      suggestionList.push({ id: coin.id, label: coin.name, image: coin.image })
    );
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [state, setState] = React.useState({
    single: "",
    popper: ""
  });
  const [stateSuggestions, setSuggestions] = React.useState([]);

  const handleSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value, suggestionList));
  };

  const handleSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const handleChange = name => (event, { newValue }) => {
    setState({
      ...state,
      [name]: newValue
    });
  };

  const autosuggestProps = {
    renderInputComponent,
    suggestions: stateSuggestions,
    onSuggestionsFetchRequested: handleSuggestionsFetchRequested,
    onSuggestionsClearRequested: handleSuggestionsClearRequested,
    getSuggestionValue,
    renderSuggestion
  };

  return (
    <div
      onKeyDown={e =>
        e.key === "Enter" &&
        autosuggestProps.suggestions.length > 0 && [
          onAdd(autosuggestProps.suggestions[0].id),
          e.preventDefault(),
          setState({ ...state, popper: "" }),
        ]
      }
      className={classes.root}
    >
      <Autosuggest
        {...autosuggestProps}
        inputProps={{
          classes,
          id: "react-autosuggest-popper",
          placeholder: "Seach For Crypto To Add...",
          value: state.popper,
          onChange: handleChange("popper"),
          onSubmit: onAdd,
          inputRef: node => {
            setAnchorEl(node);
          },
          InputLabelProps: {
            shrink: true
          }
        }}
        theme={{
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion
        }}
        renderSuggestionsContainer={options => (
          <Popper
            style={{ zIndex: "999" }}
            anchorEl={anchorEl}
            open={Boolean(options.children)}
          >
            <Paper
              onClick={() => [
                onAdd(
                  options.children.props.items[
                    options.children.props.highlightedItemIndex
                  ].id
                ),
                setState({ ...state, popper: "" })
              ]}
              square
              {...options.containerProps}
              style={{
                width: anchorEl ? anchorEl.clientWidth : undefined,
                zIndex: "999"
              }}
            >
              {options.children}
            </Paper>
          </Popper>
        )}
      />
    </div>
  );
}
