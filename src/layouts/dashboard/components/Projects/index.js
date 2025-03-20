import { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress"; // Loader
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React examples
import DataTable from "examples/Tables/DataTable";

function Projects() {
  const [menu, setMenu] = useState(null);
  const [selectedType, setSelectedType] = useState("high_recency"); // Default type
  const [data, setData] = useState({ columns: [], rows: [] });
  const [loading, setLoading] = useState(false); // Loader state

  // Mapping API types to user-friendly labels
  const typeOptions = [
    { label: "Daily Required Products", value: "high_recency" },
    { label: "Frequently Bought Products", value: "high_frequency" },
    { label: "High-Value Purchases", value: "high_monetary" },
    { label: "Popular & Frequently Bought", value: "high_recency_high_frequency" },
    { label: "Expensive & Frequent Purchases", value: "high_amount_high_frequency" },
    { label: "Least Bought & Low Value", value: "low_frequency_low_monetary" },
    { label: "Rarely Bought Products", value: "low_recency_low_frequency" },
    { label: "Loyalty-Based Purchases", value: "high_loyalty" },
  ];

  // Fetch data from API using fetch()
  const fetchData = async (type) => {
    setLoading(true); // Start loading
    try {
      const response = await fetch(
        `http://localhost:8000/api/frequent-purchase-items/?type=${type}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      const items = result.response;

      // Format data for DataTable
      const columns = [
        { Header: "Stock Code", accessor: "StockCode", align: "left" },
        { Header: "Description", accessor: "Description", align: "left" },
      ];
      const rows = items.map((item) => ({
        StockCode: item.StockCode,
        Description: item.Description,
      }));

      setData({ columns, rows });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false); // Stop loading
  };

  // Fetch data when selectedType changes
  useEffect(() => {
    fetchData(selectedType);
  }, [selectedType]);

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const openMenu = ({ currentTarget }) => setMenu(currentTarget);
  const closeMenu = () => setMenu(null);

  return (
    <Card>
      <MDBox
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={3}
      >
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Frequent Purchase Items
          </MDTypography>
          <MDBox display="flex" alignItems="center" lineHeight={0}>
            <Icon
              sx={{
                fontWeight: "bold",
                color: ({ palette: { info } }) => info.main,
                mt: -0.5,
              }}
            >
              done
            </Icon>
            <MDTypography variant="button" fontWeight="regular" color="text">
              &nbsp;Select a category to view items
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox color="text" px={2}>
          <Icon
            sx={{ cursor: "pointer", fontWeight: "bold" }}
            fontSize="small"
            onClick={openMenu}
          >
            more_vert
          </Icon>
        </MDBox>
        <Menu
          id="simple-menu"
          anchorEl={menu}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(menu)}
          onClose={closeMenu}
        >
          <MenuItem onClick={closeMenu}>Action</MenuItem>
          <MenuItem onClick={closeMenu}>Another action</MenuItem>
          <MenuItem onClick={closeMenu}>Something else</MenuItem>
        </Menu>
      </MDBox>

      {/* Dropdown for Type Selection */}
      <MDBox p={3}>
        <FormControl fullWidth>
          <InputLabel>Select Product Type</InputLabel>
          <Select
            value={selectedType}
            onChange={handleTypeChange}
            displayEmpty
            fullWidth
            disabled={loading} 
            sx={{padding:"16px",marginTop:"10px"}}
          >
            {typeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </MDBox>

      {/* Show Loader While Fetching Data */}
      <MDBox p={2} display="flex" justifyContent="center" alignItems="center">
        {loading ? (
          <CircularProgress color="info" />
        ) : (
          <DataTable
            table={{ columns: data.columns, rows: data.rows }}
            showTotalEntries={false}
            isSorted={false}
            noEndBorder
            entriesPerPage={false}
          />
        )}
      </MDBox>
    </Card>
  );
}

export default Projects;
