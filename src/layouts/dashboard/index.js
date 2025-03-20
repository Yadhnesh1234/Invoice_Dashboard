import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import { Autocomplete, Modal, IconButton, Box, Select, MenuItem, InputLabel, FormControl, TextField, Button, CircularProgress } from "@mui/material";
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";
import CloseIcon from "@mui/icons-material/Close";
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import { useEffect, useState } from "react";
//http://127.0.0.1:8000/api/get-recommendation/
function Dashboard() {
  const { sales, tasks } = reportsLineChartData;
  const [salesData, setSalesData] = useState(null);
  const [open, setOpen] = useState(false);
  const [freq, setFreq] = useState("M");
  const [period, setPeriod] = useState(2);
  const [loading, setLoading] = useState(true);
  const [productList, setProductList] = useState([])
  const [product, setProduct] = useState("")
  const [quantityData, setQuantityData] = useState(null);
  const [openQuantity, setOpenQuantity] = useState(false);
  const fetchData = async () => {
    try {
      setLoading(true);
      setSalesData(null);
      let stock = 0
      if (product == "")
        stock = 0
      else
        stock = product.split(" ")[0]
      const response = await fetch("http://127.0.0.1:8000/api/get-forecast-product/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stockcode: parseInt(stock),
          freq: freq,
          period: period == null ? 0 : parseInt(period),
        }),
      });
      const data = await response.json();
      if (data && data.forecast) {
        const data_labels = data.forecast.map((item) => item.date);
        const predictions = data.forecast.map((item) =>
          item.total_price != null ? parseInt(item.total_price) : parseInt(item.model1)
        );
        setSalesData({
          labels: data_labels,
          datasets: { label: "Sales Forecast", data: predictions },
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuantityData = async () => {
    try {
      setLoading(true);
      setQuantityData(null);
      let stock = product ? product.split(" ")[0] : 0;
      const response = await fetch("http://127.0.0.1:8000/api/get-quantity-forecast-product/", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stockcode: parseInt(stock),
          freq: freq,
          period: period ? parseInt(period) : 0,
        }),
      });

      const data = await response.json();
      if (data && data.forecast) {
        const data_labels = data.forecast.map((item) => item.date);
        const predictions = data.forecast.map((item) =>
          item.quantity != null ? parseInt(item.quantity) : 0
        );
        setQuantityData({
          labels: data_labels,
          datasets: { label: "Quantity Forecast", data: predictions },
        });
      }
    } catch (error) {
      console.error("Error fetching quantity data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchQuantityData();
  }, []);

  useEffect(() => {
  }, [salesData, productList,quantityData])

  const getSuggetionList = async () => {
    try {
      setLoading(true)
      if (!product) {
        setProductList([]);
        return;
      }
      const response = await fetch("http://127.0.0.1:8000/api/get-recommendation/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search_query: product }),
      });

      const data = await response.json();
      if (data?.data?.length > 0) {
        let productNames = []
        data.data.forEach((item) => {
          Object.entries(item).forEach(([key, value]) => {
            console.log(key + " " + value);
            productNames.push(key + " " + value);
          });
        });
        setProductList(productNames);
        setLoading(false)
      } else {
        setProductList([]);
        setLoading(false)
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setProductList([]);
      setLoading(false)
    }
  };
  const handleOpen = () => {
    setOpen(true);
    fetchData();
  };

  const handleClose = () => {
    setOpen(false);
    setProduct("")
    setFreq("M")
    setPeriod(2)
    fetchData();
  };
  const handleOpenQuantity = () => {
    setOpenQuantity(true);
    fetchQuantityData();
  };

  const handleCloseQuantity = () => {
    setOpenQuantity(false);
    setProduct("");
    setFreq("M");
    setPeriod(2);
    fetchQuantityData();
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard color="dark" icon="weekend" title="Bookings" count={281} percentage={{ color: "success", amount: "+55%", label: "than last week" }} />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard icon="leaderboard" title="Today's Users" count="2,300" percentage={{ color: "success", amount: "+3%", label: "than last month" }} />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard color="success" icon="store" title="Revenue" count="34k" percentage={{ color: "success", amount: "+1%", label: "than yesterday" }} />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard color="primary" icon="person_add" title="Followers" count="+91" percentage={{ color: "success", amount: "", label: "Just updated" }} />
            </MDBox>
          </Grid>
        </Grid>

        <MDBox mt={4.5}>
          <Grid container spacing={2}>
            {/* <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart color="info" title="Website Views" description="Last Campaign Performance" date="campaign sent 2 days ago" chart={reportsBarChartData} />
              </MDBox>
            </Grid> */}

            {/* Sales Forecast Chart (Clickable) */}
            <Grid item xs={12} md={6} lg={6} onClick={handleOpen} style={{ cursor: "pointer" }}>
              <MDBox mb={3}>
                {loading ? ((
                  <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                    <CircularProgress />
                  </Box>
                )) : (salesData != null ? <ReportsLineChart
                  color="success"
                  title="Sales Forecast"
                  description={<>Get Daily, Weekly, Monthly Sale Forecast</>}
                  date="updated 4 min ago"
                  chart={salesData}
                  height={"12.5rem"}
                /> : <></>)}
              </MDBox>
            </Grid>

            {/* Modal with Inputs */}
            <Modal open={open} onClose={handleClose}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "90vw",
                  height: "80vh",
                  bgcolor: "background.paper",
                  boxShadow: 24,
                  p: 3,
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <IconButton
                  onClick={handleClose}
                  sx={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    color: "black",
                  }}
                >
                  <CloseIcon />
                </IconButton>

                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    mb: 2,
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >

                  <FormControl sx={{ display: "flex", flexDirection: "row", gap: 2, alignItems: "center" }}>
                    <Autocomplete
                      freeSolo
                      options={productList}
                      value={product}
                      onChange={(event, newValue) => setProduct(newValue)}
                      onInputChange={(event, newInputValue) => setProduct(newInputValue)}
                      sx={{ width: 400 }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Product"
                          sx={{ minWidth: 150, height: 40, }}
                          disabled={loading}
                        />
                      )}
                    />
                    <Button
                      variant="contained"
                      color="info"
                      onClick={() => { getSuggetionList() }}
                      sx={{ height: 20 }}
                    >
                      Get
                    </Button>
                    <FormControl sx={{ minWidth: 120 }}>
                      <InputLabel>Frequency</InputLabel>
                      <Select
                        value={freq}
                        onChange={(e) => setFreq(e.target.value)}
                        label="Frequency"
                        disabled={loading}
                        sx={{ padding: "14px" }}
                      >
                        <MenuItem value="D">Daily</MenuItem>
                        <MenuItem value="W">Weekly</MenuItem>
                        <MenuItem value="M">Monthly</MenuItem>
                      </Select>
                    </FormControl>

                    <TextField
                      label="Period"
                      type="number"
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                      sx={{ minWidth: 120, height: 40 }}
                      disabled={loading}
                    />
                  </FormControl>
                  <Button
                    variant="contained"
                    color="info"
                    onClick={() => { fetchData() }}
                    disabled={loading}
                    sx={{ height: 40 }}
                  >
                    Search
                  </Button>
                </Box>

                <Box sx={{ flexGrow: 1, marginTop: "20px", width: "100%", overflow: "hidden", justifyContent: "center", alignItems: "center", paddingTop: "50px" }}>
                  {loading ? (
                    <CircularProgress />
                  ) : salesData ? (
                    <ReportsLineChart
                      color="success"
                      title="Sales Forecast - Zoomed In"
                      description={<>Expanded View of Sales Forecast</>}
                      date="updated 4 min ago"
                      chart={salesData}
                      height="25.5rem"
                    />
                  ) : (
                    <Box>No data available</Box>
                  )}
                </Box>
              </Box>
            </Modal>

            <Grid item xs={12} md={6} lg={6} onClick={handleOpenQuantity} style={{ cursor: "pointer" }}>
              <MDBox mb={3}>
                {loading ? (
                  <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                    <CircularProgress />
                  </Box>
                ) : quantityData ? (
                  <ReportsLineChart
                    color="dark"
                    title="Quantity Forecast"
                    description="Get Daily, Weekly, Monthly Quantity Forecast"
                    date="just updated"
                    chart={quantityData}
                    height={"12.5rem"}
                  />
                ) : <></>}
              </MDBox>
            </Grid>

            {/* Modal for Quantity Forecast */}
            <Modal open={openQuantity} onClose={handleCloseQuantity}>
              <Box sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "90vw",
                height: "80vh",
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 3,
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
              }}>
                <IconButton
                  onClick={handleCloseQuantity}
                  sx={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    color: "black",
                  }}
                >
                  <CloseIcon />
                </IconButton>

                <Box sx={{
                  display: "flex",
                  gap: 2,
                  mb: 2,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}>
                  <FormControl sx={{ display: "flex", flexDirection: "row", gap: 2, alignItems: "center" }}>
                    <Autocomplete
                      freeSolo
                      options={productList}
                      value={product}
                      onChange={(event, newValue) => setProduct(newValue)}
                      onInputChange={(event, newInputValue) => setProduct(newInputValue)}
                      sx={{ width: 400 }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Product"
                          sx={{ minWidth: 150, height: 40 }}
                          disabled={loading}
                        />
                      )}
                    />
                    <Button
                      variant="contained"
                      color="info"
                      onClick={getSuggetionList}
                      sx={{ height: 20 }}
                    >
                      Get
                    </Button>
                    <FormControl sx={{ minWidth: 120 }}>
                      <InputLabel>Frequency</InputLabel>
                      <Select
                        value={freq}
                        onChange={(e) => setFreq(e.target.value)}
                        label="Frequency"
                        disabled={loading}
                        sx={{ padding: "14px" }}
                      >
                        <MenuItem value="D">Daily</MenuItem>
                        <MenuItem value="W">Weekly</MenuItem>
                        <MenuItem value="M">Monthly</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      label="Period"
                      type="number"
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                      sx={{ minWidth: 120, height: 40 }}
                      disabled={loading}
                    />
                  </FormControl>
                  <Button
                    variant="contained"
                    color="info"
                    onClick={fetchQuantityData}
                    disabled={loading}
                    sx={{ height: 40 }}
                  >
                    Search
                  </Button>
                </Box>

                <Box sx={{ flexGrow: 1, marginTop: "20px", width: "100%", overflow: "hidden", justifyContent: "center", alignItems: "center", paddingTop: "50px" }}>
                  {loading ? (
                    <CircularProgress />
                  ) : quantityData ? (
                    <ReportsLineChart
                      color="dark"
                      title="Quantity Forecast - Zoomed In"
                      description={<>Expanded View of Quantity Forecast</>}
                      date="just updated"
                      chart={quantityData}
                      height="25.5rem"
                    />
                  ) : (
                    <Box>No data available</Box>
                  )}
                </Box>
              </Box>
            </Modal>

          </Grid>
        </MDBox>

        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Projects />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default Dashboard;