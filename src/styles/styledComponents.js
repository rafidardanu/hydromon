import { styled } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { Alert } from "@mui/material";
import {
  Card,
  CardContent,
  Box,
  Button,
  TableCell,
  TableRow,
  Paper,
  Typography,
  ToggleButtonGroup,
  Link,
} from "@mui/material";

//Login Styled
export const LoginBox = styled(Box)({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  background: "linear-gradient(135deg, #4CAF50, #45a049)",
  padding: "20px",
});

export const LoginCard = styled(Card)({
  borderRadius: "15px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  width: "100%",
  maxWidth: "500px",
  margin: "0 auto",
});

export const LoginCardContent = styled(CardContent)({
  padding: "3rem !important",
  "@media (max-width: 600px)": {
    padding: "2rem !important",
  },
});

export const LoginButton = styled(Button)({
  backgroundColor: "#4CAF50",
  "&:hover": {
    backgroundColor: "#45a049",
  },
  padding: "10px 0",
  marginTop: "16px",
  marginBottom: "16px",
});

export const LoginLink = styled(Link)({
  color: "#4CAF50",
  textDecoration: "none",
  "&:hover": {
    color: "#45a049",
  },
});

//Register Styled
export const registerTheme = createTheme({
  palette: {
    primary: {
      main: "#4CAF50",
      dark: "#45a049",
    },
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        fullWidth: true,
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          padding: "12px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "15px",
        },
      },
    },
  },
});

export const RegisterCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(5),
  },
}));

export const RegisterButton = styled(Button)({
  marginTop: "16px",
  textTransform: "none",
  fontSize: "1rem",
});

//Main Styled
export const StyledCard = styled(Card)(({ theme }) => ({
  transition: "all 0.3s",
  "&:hover": {
    transform: "scale(1.04)",
    boxShadow: theme.shadows[8],
},
}));

export const StyledCardContent = styled(CardContent)(() => ({
    padding: "3rem !important",
    "@media (max-width: 600px)": {
        padding: "2rem !important",
    },
}));

export const StyledButton = styled(Button)({
  backgroundColor: "#4CAF50",
  "&:hover": {
    backgroundColor: "#45a049",
  },
  padding: "10px 0",
  marginTop: "16px",
});

export const StyledPaper = styled(Paper)({
  borderRadius: 15,
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
});

export const DataSetpoint = styled(Card)(({ theme, bgcolor }) => ({
  backgroundColor: bgcolor,
  color: theme.palette.common.white,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[8],
  },
}));

export const MetricValue = styled(Typography)(({ theme }) => ({
  fontFamily: "'Roboto Mono', monospace",
  fontSize: "3.3rem",
  fontWeight: "bold",
  textAlign: "center",
  marginTop: theme.spacing(2),
}));

export const ChartSelector = styled(ToggleButtonGroup)(({ theme }) => ({
  position: "absolute",
  right: theme.spacing(2),
  top: theme.spacing(2),
  zIndex: 1,
}));

export const CenteredAlert = styled(Alert)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  width: "100%",
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1),
  "& .MuiAlert-icon": {
    marginRight: theme.spacing(1),
  },
  "& .MuiAlert-message": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: theme.shadows[2],
  },
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  background: "#4CAF50",
  color: theme.palette.common.white,
  fontSize: 16,
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
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

export const CenteredBox = styled(Box)({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
});

export const DeviationCard = styled(Card)(({ theme, error }) => {
  const color = getErrorColor(error);
  return {
    backgroundColor: `${color}10`,
    borderLeft: `4px solid ${color}`,
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: theme.shadows[4],
    },
  };
});

const getErrorColor = (error) => {
  const value = parseFloat(error);
  if (value <= 5) return "#4CAF50";
  if (value <= 10) return "#FF9800";
  return "#F44336";
};

export const ContactAdminBox = styled(Box)({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  background: "linear-gradient(135deg, #4CAF50, #45a049)",
  padding: "20px",
});
