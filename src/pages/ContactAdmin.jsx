/* eslint-disable react/no-unescaped-entities */
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Container,
} from "@mui/material";
import { ContactAdminBox, StyledCard, StyledCardContent, StyledButton } from "../styles/styledComponents";

const ContactAdmin = () => {
  return (
    <ContactAdminBox>
      <Container maxWidth="sm">
        <StyledCard>
          <StyledCardContent>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mb={4}
            >
              <Box
                component="img"
                src="/icon.svg"
                alt="Taman Herbal Lawu"
                sx={{
                  width: "80px",
                  height: "auto",
                  mb: 2,
                }}
              />
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  fontWeight: "bold",
                  color: "#4CAF50",
                  mb: 3,
                }}
              >
                Contact Admin
              </Typography>
            </Box>

            <Box textAlign="center" mb={4}>
              <Typography variant="body1" sx={{ mb: 3 }}>
                If you've forgotten your password or need to create a new
                account, please contact the administrator using the information
                below:
              </Typography>

              <Typography variant="body1" sx={{ mb: 1 }}>
                <Box component="span" fontWeight="bold">
                  Email:
                </Box>{" "}
                admin@tamanherballawu.com
              </Typography>

              <Typography variant="body1" sx={{ mb: 1 }}>
                <Box component="span" fontWeight="bold">
                  Phone:
                </Box>{" "}
                +62 123 456 7890
              </Typography>

              <Typography variant="body1">
                <Box component="span" fontWeight="bold">
                  Office hours:
                </Box>{" "}
                Monday to Friday, 9:00 AM - 5:00 PM (WIB)
              </Typography>
            </Box>

            <Box textAlign="center">
              <StyledButton
                component={Link}
                to="/login"
                variant="contained"
                fullWidth
                size="large"
              >
                Back to Login
              </StyledButton>
            </Box>
          </StyledCardContent>
        </StyledCard>
      </Container>
    </ContactAdminBox>
  );
};

export default ContactAdmin;
