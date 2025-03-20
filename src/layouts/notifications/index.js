import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function Notifications() {
  const [invoiceNotification, setInvoiceNotification] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkInvoice = () => {
      const invoiceId = localStorage.getItem("invoice_id");
      if (invoiceId) {
        setInvoiceNotification(true);
      }
    };

    const interval = setInterval(checkInvoice, 5000);
    return () => clearInterval(interval);
  }, []);

  const closeInvoiceNotification = () => setInvoiceNotification(false);
  const handleInvoiceClick = () => {
    closeInvoiceNotification();
    navigate("/authentication/sign-up"); 
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={6} mb={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={8}>
            <Card>
              <MDBox p={2}>
                <MDTypography variant="h5">Notifications</MDTypography>
              </MDBox>
              <MDBox p={2}>
                {invoiceNotification ? (
                  <MDBox p={2} bgcolor="warning.main" borderRadius="md">
                    <MDTypography variant="h6" color="white">
                      New Unverified Invoice Detected
                    </MDTypography>
                    <MDTypography variant="body2" color="white">
                      Click the button below to review the invoice.
                    </MDTypography>
                    <MDBox mt={2} display="flex" justifyContent="center">
                      <MDButton
                        variant="contained"
                        color="white"
                        onClick={handleInvoiceClick}
                      >
                        Review Invoice
                      </MDButton>
                    </MDBox>
                  </MDBox>
                ) : (
                  <MDTypography variant="body2" color="textSecondary">
                    No new notifications.
                  </MDTypography>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Notifications;
