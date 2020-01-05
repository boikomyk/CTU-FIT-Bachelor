import React from "react";
import cx from "classnames";
import PropTypes from "prop-types";

import withStyles from "@material-ui/core/styles/withStyles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import tableStyles from "styles/components/table/Table.jss";
import TableFooter from "@material-ui/core/TableFooter";
import Button from "components/button/Button";
import { Link as RouterLink } from "react-router-dom";

function CustomTable({ ...props }) {
  const {
    classes,
    tableHead,
    tableData,
    tableShowMoreLink,
    stripedColor,
    tableHeaderColor,
    hover,
    emptyData,
    staticRows,
    alignColls,
    footer,
    alignedColls,
    align,
    striped,
    customHeadCellClasses,
    customHeadClassesForCells
  } = props;
  let data = tableData === undefined ? [] : tableData;

  let height = 49;
  let emptyRows = 0;

  if (staticRows !== 0) {
    if (data.length >= staticRows) {
      data = tableData.slice(0, staticRows);
    } else {
      emptyRows = staticRows - data.length;
      height *= emptyRows;
    }
  }

  if (data.length === 0) {
    return (
      <div className={classes.tableResponsive}>
        <Table className={classes.table}>
          <TableHead className={classes[tableHeaderColor]}>
            <TableRow className={classes.tableRow} />
          </TableHead>
          <TableBody>
            <TableRow className={classes.tableRow} style={{ height: height }}>
              <TableCell
                align="center"
                className={classes.tableCell}
                colSpan={1}
              >
                <p className={classes.disabledText}> {emptyData.text} </p>
                {emptyData.link !== "" && emptyData.linkText && (
                  <Button
                    color="white"
                    to={{ pathname: emptyData.link }}
                    component={RouterLink}
                  >
                    {emptyData.linkText}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
          {footer && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={1} align="center" />
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>
    );
  }

  let columns = data[0].length;

  return (
    <div className={classes.tableResponsive}>
      <Table className={classes.table}>
        {tableHead === undefined ? null : (
            <TableHead className={classes[tableHeaderColor]}>
                <TableRow className={classes.tableRow}>
                    {tableHead.map((prop, key) => {
                        const tableCellClasses =
                            classes.tableHeadCell +
                            " " +
                            classes.tableCell +
                            " " +
                            cx({
                                [customHeadCellClasses[
                                    customHeadClassesForCells.indexOf(key)
                                    ]]: customHeadClassesForCells.indexOf(key) !== -1
                            });
                        return (
                            <TableCell
                                align={
                                    alignColls.indexOf(-key) === -1 ? align : alignedColls[alignColls.indexOf(-key)]
                                }
                                className={tableCellClasses}
                                key={key}
                            >
                                <b>{prop}</b>
                            </TableCell>
                        );
                    })}
                </TableRow>
            </TableHead>
        )}
        <TableBody>
          {data.map((prop, key) => {
            const tableRowClasses = cx({
              [classes.tableRowHover]: hover,
              [classes[stripedColor + "TableStripedRow"]]:
                striped && key % 2 === 0
            });

            return (
              <TableRow
                key={key}
                hover={hover}
                className={classes.tableRow + " " + tableRowClasses}
              >
                {prop.map((prop, key) => {
                  const tableCellClasses = classes.tableCell;
                  return (
                    <TableCell
                      align={
                        alignColls.indexOf(key) === -1 ? align : alignedColls[alignColls.indexOf(key)]
                      }
                      className={tableCellClasses}
                      key={key}
                    >
                      {prop}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>

        {footer && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={columns} align="center">
                {tableShowMoreLink !== undefined && emptyRows <= 0 ? (
                  <Button
                    color="transparent"
                    to={{ pathname: tableShowMoreLink }}
                    component={RouterLink}
                  >
                    Show All
                  </Button>
                ) : null}
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </div>
  );
}

CustomTable.defaultProps = {
  tableHeaderColor: "gray",
  hover: false,
  alignColls: [],
  alignedColls: [],
  align: "left",
  striped: false,
  customCellClasses: [],
  emptyData: {
    link: "",
    linkText: "",
    text: "There are no items yet."
  },
  footer: true,
  stripedColor: "gray",
  staticRows: 0,
  customClassesForCells: [],
  customHeadCellClasses: [],
  customHeadClassesForCells: []
};

CustomTable.propTypes = {
  classes: PropTypes.object.isRequired,
  tableHeaderColor: PropTypes.oneOf([
    "warning",
    "primary",
    "danger",
    "success",
    "info",
    "rose",
    "gray"
  ]),
  stripedColor: PropTypes.oneOf([
    "warning",
    "primary",
    "danger",
    "success",
    "info",
    "rose",
    "blue",
    "gray"
  ]),
  emptyData: PropTypes.shape({
    link: PropTypes.string,
    linkText: PropTypes.string,
    text: PropTypes.string
  }),
  align: PropTypes.string,
  tableHead: PropTypes.arrayOf(PropTypes.string),
  tableData: PropTypes.array,
  tableShowMoreLink: PropTypes.string,
  hover: PropTypes.bool,
  footer: PropTypes.bool,
  alignedColls: PropTypes.arrayOf(PropTypes.string),
  staticRows: PropTypes.number,
  alignColls: PropTypes.arrayOf(PropTypes.number),
  customCellClasses: PropTypes.arrayOf(PropTypes.string),
  customClassesForCells: PropTypes.arrayOf(PropTypes.number),
  customHeadCellClasses: PropTypes.arrayOf(PropTypes.string),
  customHeadClassesForCells: PropTypes.arrayOf(PropTypes.number),
  striped: PropTypes.bool
};

export default withStyles(tableStyles)(CustomTable);
