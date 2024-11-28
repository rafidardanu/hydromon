/* eslint-disable react/prop-types */
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";
import { StyledTableCell, StyledTableRow } from "../../styles/styledComponents";
import { format } from "date-fns";

const HistoryTable = ({
  monitoringData,
  selectedProfile,
  targetValues,
  page,
  rowsPerPage,
  calculateError,
}) => {
  const calculateErrorWrapper = (measured, target) => {
    if (measured === null || measured === undefined || !selectedProfile) {
      return "N/A";
    }
    return `${calculateError(measured, target)}%`;
  };

  const formatNumber = (value) => {
    if (value === null || value === undefined) {
      return "N/A";
    }
    return value.toFixed(2);
  };

  return (
    <TableContainer
      component={Paper}
      elevation={6}
      style={{ borderRadius: 15 }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>Timestamp</StyledTableCell>
            <StyledTableCell>
              Water Temp (°C)
              {selectedProfile && (
                <Box
                  component="span"
                  sx={{ fontSize: "0.8em", display: "block" }}
                >
                  Target: {formatNumber(targetValues.watertemp)}°C
                </Box>
              )}
            </StyledTableCell>
            {selectedProfile && <StyledTableCell>Error (%)</StyledTableCell>}
            <StyledTableCell>
              Water pH
              {selectedProfile && (
                <Box
                  component="span"
                  sx={{ fontSize: "0.8em", display: "block" }}
                >
                  Target: {formatNumber(targetValues.waterph)}
                </Box>
              )}
            </StyledTableCell>
            {selectedProfile && <StyledTableCell>Error (%)</StyledTableCell>}
            <StyledTableCell>
              Water PPM
              {selectedProfile && (
                <Box
                  component="span"
                  sx={{ fontSize: "0.8em", display: "block" }}
                >
                  Target: {formatNumber(targetValues.waterppm)}
                </Box>
              )}
            </StyledTableCell>
            {selectedProfile && <StyledTableCell>Error (%)</StyledTableCell>}
            <StyledTableCell>Air Temp (°C)</StyledTableCell>
            <StyledTableCell>Air Humidity (%)</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {monitoringData
            .slice((page - 1) * rowsPerPage, page * rowsPerPage)
            .map((item, index) => (
              <StyledTableRow key={index}>
                <TableCell>
                  {item.timestamp
                    ? format(new Date(item.timestamp), "yyyy-MM-dd HH:mm:ss")
                    : "N/A"}
                </TableCell>
                <TableCell>{formatNumber(item.watertemp)}</TableCell>
                {selectedProfile && (
                  <TableCell>
                    {calculateErrorWrapper(
                      item.watertemp,
                      targetValues.watertemp
                    )}
                  </TableCell>
                )}
                <TableCell>{formatNumber(item.waterph)}</TableCell>
                {selectedProfile && (
                  <TableCell>
                    {calculateErrorWrapper(item.waterph, targetValues.waterph)}
                  </TableCell>
                )}
                <TableCell>{formatNumber(item.waterppm)}</TableCell>
                {selectedProfile && (
                  <TableCell>
                    {calculateErrorWrapper(
                      item.waterppm,
                      targetValues.waterppm
                    )}
                  </TableCell>
                )}
                <TableCell>{formatNumber(item.airtemp)}</TableCell>
                <TableCell>{formatNumber(item.airhum)}</TableCell>
              </StyledTableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default HistoryTable;
