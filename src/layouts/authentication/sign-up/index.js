import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Select,
  CircularProgress,  // Import Circular Loader
  Box
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import bgImage from "assets/images/bg-sign-up-cover.jpeg";

function InvoicePreview() {
  const [invoice, setInvoice] = useState(null);
  const [ambiguousProducts, setAmbiguousProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const [selectedProducts, setSelectedProducts] = useState({}); // To store the selected stock codes for ambiguous products

  const invoiceId = JSON.parse(localStorage.getItem("invoice_id"));

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!invoiceId) return;

      try {
        const response = await fetch(`http://localhost:8000/api/process-invoice/?id=${invoiceId}`);
        const data = await response.json();

        if (data.Status === 201) {
          setAmbiguousProducts(data.data);
        } else {
          setInvoice(data.data);
        }
      } catch (error) {
        console.error("Error fetching invoice:", error);
      } finally {
        setLoading(false); // Stop loading when data is fetched
      }
    };

    fetchInvoice();
  }, [invoiceId]);

  const handleUpdateProduct = async () => {
    // Extract old descriptions and new stock codes from the selectedProducts state
    const oldDescs = ambiguousProducts.map(item => item.Description);
    const newStockCodes = oldDescs.map(desc => selectedProducts[desc]);

    try {
      const response = await fetch("http://localhost:8000/api/update-invoice-products/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invoice_id: invoiceId,
          old_descs: oldDescs,
          new_stock_codes: newStockCodes,
        }),
      });

      if (!response.ok) throw new Error("Failed to update products");

      alert("Products updated successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error updating products:", error);
    }
  };

  // Show loader while fetching
  if (loading) {
    return (
      <CoverLayout image={bgImage}>
        <MDBox textAlign="center" mt={10}>
          <CircularProgress size={50} color="info" />
          <MDTypography variant="h6" mt={2}>
            Loading Invoice...
          </MDTypography>
        </MDBox>
      </CoverLayout>
    );
  }

  // If ambiguous products exist, show selection UI
  if (ambiguousProducts.length > 0) {
    return (
      <CoverLayout image={bgImage}>
        <MDBox textAlign="center" mt={20}>
          <MDTypography variant="h5" color="error">
            Ambiguous Products Found
          </MDTypography>
          <MDTypography variant="body1">
            Please select the correct product for each item.
          </MDTypography>

          {/* Flex Container */}
          <MDBox display="flex" justifyContent="center" gap={3} mt={3}>
            <Card sx={{ width: 500, p: 3 }}>
              {ambiguousProducts.map((item, index) => (
                <MDBox key={index} sx={{ mb: 3 }}>
                  <MDTypography variant="h6">{item.Description}</MDTypography>
                  <Select
                    fullWidth
                    value={selectedProducts[item.Description] || ""}
                    onChange={(e) => {
                      setSelectedProducts({
                        ...selectedProducts,
                        [item.Description]: e.target.value,
                      });
                    }}
                  >
                    <MenuItem value="" disabled>Select a product</MenuItem>
                    {item.Items.map((option, idx) => {
                      const stockCode = Object.keys(option)[0];
                      const description = option[stockCode];
                      return (
                        <MenuItem key={idx} value={stockCode}>
                          {description} ({stockCode})
                        </MenuItem>
                      );
                    })}
                  </Select>
                </MDBox>
              ))}
            </Card>

            {invoice && (
              <Card sx={{ width: 400, p: 2, height: 500 }}>
                <MDTypography variant="h6" color="info" textAlign="center">
                  Invoice Preview
                </MDTypography>
                <MDTypography variant="body2"><b>Invoice No:</b> {invoice.InvoiceNo}</MDTypography>
                <MDTypography variant="body2"><b>Date:</b> {invoice.InvoiceDate}</MDTypography>
                <MDTypography variant="body2"><b>Customer ID:</b> {invoice["Customer ID"]}</MDTypography>

                <TableContainer component={Paper} sx={{ mt: 1, maxHeight: "200px", overflow: "auto" }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell><b>Desc</b></TableCell>
                        <TableCell><b>Qty</b></TableCell>
                        <TableCell><b>Price</b></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {invoice.ProductItems.slice(0, 3).map((item, index) => (  
                        <TableRow key={index}>
                          <TableCell>{item.Description}</TableCell>
                          <TableCell>{item.Quantity}</TableCell>
                          <TableCell>{item.UnitPrice.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <MDTypography variant="body2" mt={1}>
                  <b>Total:</b> {invoice.TotalAmount.toFixed(2)}
                </MDTypography>
              </Card>
            )}
          </MDBox>

          <MDBox mt={3} textAlign="center">
            <MDButton onClick={handleUpdateProduct} variant="gradient" color="info">
              Update Products
            </MDButton>
          </MDBox>
        </MDBox>
      </CoverLayout>
    );
  }

  // If no invoice data, show error
  if (!invoice) {
    return (
      <CoverLayout image={bgImage}>
        <MDBox textAlign="center" mt={5}>
          <MDTypography variant="h5" color="error">
            Invoice Not Found!
          </MDTypography>
        </MDBox>
      </CoverLayout>
    );
  }

  return (
    <CoverLayout image={bgImage}>
      <MDBox display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Card sx={{ width: 1000, p: 3 }}>
          <MDBox
            variant="gradient"
            bgColor="info"
            borderRadius="lg"
            coloredShadow="success"
            mx={2}
            mt={-3}
            p={3}
            mb={1}
            textAlign="center"
          >
            <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
              Invoice Preview
            </MDTypography>
          </MDBox>

          <MDBox p={3}>
            <MDTypography variant="h6">Invoice No: {invoice.InvoiceNo}</MDTypography>
            <MDTypography variant="body1">Date: {invoice.InvoiceDate}</MDTypography>
            <MDTypography variant="body1">Customer ID: {invoice["Customer ID"]}</MDTypography>
            <MDTypography variant="body1">Seller Name: {invoice.SellerName || "N/A"}</MDTypography>
            <MDTypography variant="body1">Seller Address: {invoice.SellerAddress || "N/A"}</MDTypography>

            <TableContainer component={Paper} sx={{ mt: 2, maxHeight: "500px", overflow: "auto" }}>
              <Table>
                <TableRow>
                    <TableCell><b>Description</b></TableCell>
                    <TableCell><b>Stock Code</b></TableCell>
                    <TableCell><b>Quantity</b></TableCell>
                    <TableCell><b>Unit Price</b></TableCell>
                    <TableCell><b>Total Price</b></TableCell>
                </TableRow>
                <TableBody >
                  {invoice.ProductItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.Description}</TableCell>
                      <TableCell>{item.StockCode}</TableCell>
                      <TableCell>{item.Quantity.toFixed(2)}</TableCell>
                      <TableCell>{item.UnitPrice.toFixed(2)}</TableCell>
                      <TableCell>{item.total_price.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <MDTypography variant="h6" mt={2}>SubTotal: {invoice.SubTotal.toFixed(2)}</MDTypography>
            <MDTypography variant="h6" color="info">Total: {invoice.TotalAmount.toFixed(2)}</MDTypography>

            <MDBox mt={3} textAlign="center">
              <MDButton component={Link} to="/" variant="gradient" color="info">
                Back to Dashboard
              </MDButton>
            </MDBox>
          </MDBox>
        </Card>
      </MDBox>
    </CoverLayout>
  );
}

export default InvoicePreview;

