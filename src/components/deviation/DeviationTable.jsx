/* eslint-disable react/prop-types */
import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
} from "@mui/material";
import { DEVIATION_COLORS, ERROR_RANGES } from "../../utils/constants";

const getErrorColor = (error, paramType) => {
  const value = Math.abs(parseFloat(error));
  const ranges = ERROR_RANGES[paramType] || ERROR_RANGES.temperature;

  if (value <= ranges.high) return DEVIATION_COLORS.high;
  if (value <= ranges.medium) return DEVIATION_COLORS.medium;
  return DEVIATION_COLORS.low;
};

const calculateError = (measured, target) => {
  return Math.abs(measured - target).toFixed(2);
};

const DeviationTable = ({
  loading,
  getCurrentPageData,
  targetValues,
  errorData,
  page,
  rowsPerPage,
  handleChangePage,
}) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!targetValues || errorData.length === 0) {
    return null;
  }

  return (
    <Box>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
        }}
      >
        <Table aria-label="Error Data">
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.50" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Avg Water Temp
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Temp Error (±)
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Avg PPM
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                PPM Error (±)
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Avg pH
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                pH Error (±)
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Avg Air Temp
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Avg Humidity
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getCurrentPageData().map((row, index) => (
              <TableRow
                key={index}
                sx={{
                  "&:hover": { bgcolor: "grey.50" },
                  transition: "background-color 0.2s ease",
                }}
              >
                <TableCell sx={{ fontWeight: "medium" }}>
                  {new Date(row.date).toLocaleDateString()}
                </TableCell>
                <TableCell align="right">
                  {parseFloat(row.avg_watertemp).toFixed(1)}
                </TableCell>
                <TableCell align="right">
                  <Box
                    sx={{
                      display: "inline-block",
                      bgcolor: `${getErrorColor(
                        calculateError(
                          parseFloat(row.avg_watertemp),
                          targetValues.watertemp
                        ),
                        "temperature"
                      )}20`,
                      color: getErrorColor(
                        calculateError(
                          parseFloat(row.avg_watertemp),
                          targetValues.watertemp
                        ),
                        "temperature"
                      ),
                      px: 1.5,
                      py: 0.5,
                      borderRadius: "full",
                      fontWeight: "medium",
                      fontSize: "0.875rem",
                    }}
                  >
                    {calculateError(
                      parseFloat(row.avg_watertemp),
                      targetValues.watertemp
                    )}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  {parseFloat(row.avg_waterppm).toFixed(1)}
                </TableCell>
                <TableCell align="right">
                  <Box
                    sx={{
                      display: "inline-block",
                      bgcolor: `${getErrorColor(
                        calculateError(
                          parseFloat(row.avg_waterppm),
                          targetValues.waterppm
                        ),
                        "ppm"
                      )}20`,
                      color: getErrorColor(
                        calculateError(
                          parseFloat(row.avg_waterppm),
                          targetValues.waterppm
                        ),
                        "ppm"
                      ),
                      px: 1.5,
                      py: 0.5,
                      borderRadius: "full",
                      fontWeight: "medium",
                      fontSize: "0.875rem",
                    }}
                  >
                    {calculateError(
                      parseFloat(row.avg_waterppm),
                      targetValues.waterppm
                    )}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  {parseFloat(row.avg_waterph).toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  <Box
                    sx={{
                      display: "inline-block",
                      bgcolor: `${getErrorColor(
                        calculateError(
                          parseFloat(row.avg_waterph),
                          targetValues.waterph
                        ),
                        "ph"
                      )}20`,
                      color: getErrorColor(
                        calculateError(
                          parseFloat(row.avg_waterph),
                          targetValues.waterph
                        ),
                        "ph"
                      ),
                      px: 1.5,
                      py: 0.5,
                      borderRadius: "full",
                      fontWeight: "medium",
                      fontSize: "0.875rem",
                    }}
                  >
                    {calculateError(
                      parseFloat(row.avg_waterph),
                      targetValues.waterph
                    )}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  {parseFloat(row.avg_airtemp).toFixed(1)}
                </TableCell>
                <TableCell align="right">
                  {parseFloat(row.avg_airhum).toFixed(1)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {errorData.length > 0 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={Math.ceil(errorData.length / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
            color="secondary-emphasis"
          />
        </Box>
      )}
    </Box>
  );
};

export default DeviationTable;
