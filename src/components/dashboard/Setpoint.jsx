/* eslint-disable react/prop-types */
import React from "react";
import {
  Table,
  TableCell,
  TableRow,
  Typography,
  Box,
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
        <Table>
          {activeSetpoints.map((item) => (
            <React.Fragment key={item.id}>
              <TableRow>
                <TableCell className="py-2 px-2 ">Temperature</TableCell>
                <TableCell className="py-2 px-2 text-right">
                  {item.watertemp}°C
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="py-2 px-2">PPM</TableCell>
                <TableCell className="py-2 px-2 text-right">
                  {item.waterppm} ppm
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="py-2 px-2">pH</TableCell>
                <TableCell className="py-2 px-2 text-right">
                  {item.waterph}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="py-2 px-2">timestamp</TableCell>
                <TableCell className="py-2 px-2 text-right">
                  {item.timestamp}
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </Table>
      </Table>
    </Box>
  );
};

export default SetpointTable;
