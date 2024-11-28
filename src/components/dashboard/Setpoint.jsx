/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
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
  const [activeSetpoints, setActiveSetpoints] = useState([]);

  useEffect(() => {
    const filteredSetpoints = data.filter((item) => item.status === 1);
    setActiveSetpoints(filteredSetpoints);
  }, [data]);

  return (
    <Box className="w-full">
      {activeSetpoints.length > 0 && (
        <Typography variant="h5" className="px-2 mb-2">
          {activeSetpoints[0].profile}
        </Typography>
      )}
      <Table>
        <TableBody>
          {activeSetpoints.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="py-4 px-2 w-1/4">
                <Stack spacing={3}>
                  <Typography variant="body1">Temperature</Typography>
                  <Typography variant="body1">PPM</Typography>
                  <Typography variant="body1">pH</Typography>
                </Stack>
              </TableCell>
              <TableCell className="py-4 px-2 w-3/4">
                <Stack spacing={3}>
                  <Typography variant="body1" className="text-right">
                    {item.watertemp.toFixed(1)}°C
                  </Typography>
                  <Typography variant="body1" className="text-right">
                    {item.waterppm.toFixed(1)} ppm
                  </Typography>
                  <Typography variant="body1" className="text-right">
                    {item.waterph.toFixed(1)}
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