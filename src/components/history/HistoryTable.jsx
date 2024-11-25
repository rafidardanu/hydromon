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
import { styled } from "@mui/material/styles";
import { format } from "date-fns";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  background: "#4CAF50",
  color: theme.palette.common.white,
  fontSize: 16,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  transition: "all 0.3s",
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
    transform: "scale(1.01)",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
}));

const HistoryTable = ({
  monitoringData,
  selectedProfile,
  targetValues,
  page,
  rowsPerPage,
  calculateError,
}) => {
  const calculateErrorWrapper = (measured, target) => {
    return selectedProfile ? `${calculateError(measured, target)}%` : "N/A";
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
                  Target: {targetValues.watertemp}°C
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
                  Target: {targetValues.waterph}
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
                  Target: {targetValues.waterppm}
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
                  {format(new Date(item.timestamp), "yyyy-MM-dd HH:mm:ss")}
                </TableCell>
                <TableCell>{item.watertemp.toFixed(2)}</TableCell>
                {selectedProfile && (
                  <TableCell>
                    {calculateErrorWrapper(
                      item.watertemp,
                      targetValues.watertemp
                    )}
                  </TableCell>
                )}
                <TableCell>{item.waterph.toFixed(2)}</TableCell>
                {selectedProfile && (
                  <TableCell>
                    {calculateErrorWrapper(item.waterph, targetValues.waterph)}
                  </TableCell>
                )}
                <TableCell>{item.waterppm.toFixed(2)}</TableCell>
                {selectedProfile && (
                  <TableCell>
                    {calculateErrorWrapper(
                      item.waterppm,
                      targetValues.waterppm
                    )}
                  </TableCell>
                )}
                <TableCell>{item.airtemp.toFixed(2)}</TableCell>
                <TableCell>{item.airhum.toFixed(2)}</TableCell>
              </StyledTableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default HistoryTable;
