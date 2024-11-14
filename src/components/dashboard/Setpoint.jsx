/* eslint-disable react/prop-types */
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  Box,
  Stack,
} from "@mui/material";

const SetpointTable = ({ data }) => {
  const activeSetpoints = data.filter((item) => item.status === 1);

  return (
    <Box className="w-full">
      {activeSetpoints.length > 0 && (
        <Typography variant="h5" className="text-gray-500 px-2 mb-2">
          {activeSetpoints[0].profile}
        </Typography>
      )}
      <Table>
        <TableBody>
          {activeSetpoints.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="py-4 px-2 w-1/4">
                <Stack spacing={2}>
                  <Typography variant="body1">Temperature</Typography>
                  <Typography variant="body1">PPM</Typography>
                  <Typography variant="body1">pH</Typography>
                </Stack>
              </TableCell>
              <TableCell className="py-4 px-2 w-3/4">
                <Stack spacing={2}>
                  <Typography variant="body1" className="text-right">
                    {item.watertemp}°C
                  </Typography>
                  <Typography variant="body1" className="text-right">
                    {item.waterppm} ppm
                  </Typography>
                  <Typography variant="body1" className="text-right">
                    {item.waterph}
                  </Typography>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default SetpointTable;
