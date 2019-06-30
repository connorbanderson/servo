import React from "react";
import TableCell from "@material-ui/core/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel";

const SortingTableCell = ({ sortLabel, sortKey, sortKeyString, dataKey, handleSort}) => (
  <TableCell
    key={`${sortKeyString}Cell`}
    sortDirection={
      sortKey !== null
        ? sortKey === "asc"
          ? "asc"
          : "desc"
        : false
    }
    style={{ color: "white", fontWeight: "bold" }}
  >
    <TableSortLabel
      active={sortKey !== null}
      direction={
        sortKey === "asc"
          ? "asc"
          : "desc"
      }
      onClick={() => handleSort(dataKey,sortKeyString)}
      style={{ color: "white", fontWeight: "bold", fontSize: "13px" }}
    >
      {sortLabel}
    </TableSortLabel>
  </TableCell>
)

export default SortingTableCell;
