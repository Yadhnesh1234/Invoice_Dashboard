import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

function UploadInvoice() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select an invoice file.");
      return;
    }

    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("invoice", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/save-invoice", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.status === 200) {
        localStorage.setItem("invoice_id", JSON.stringify(data.data));
        setMessage(`Invoice uploaded successfully! ID: ${data.data}`);
      } else {
        setMessage("Failed to upload invoice.");
      }
    } catch (error) {
      setMessage("Error uploading invoice. Please try again.");
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Upload Invoice
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3} textAlign="center">
          <MDBox mb={2}>
            <MDInput type="file" onChange={handleFileChange} fullWidth />
          </MDBox>
          <MDBox mt={4} mb={1}>
            <MDButton
              variant="gradient"
              color="info"
              fullWidth
              onClick={handleUpload}
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload Invoice"}
            </MDButton>
          </MDBox>
          {message && (
            <MDTypography variant="body2" color="text">
              {message}
            </MDTypography>
          )}
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default UploadInvoice;
