
import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import PageLayout from "examples/LayoutContainers/PageLayout";

// Authentication layout components
import Footer from "layouts/authentication/components/Footer";

function CoverLayout({ coverHeight, image, children }) {
  return (
    <PageLayout>
      <MDBox
        width="calc(100% - 2rem)"
        minHeight={coverHeight}
        borderRadius="xl"
        mx={2}
        my={2}
        pt={6}
        pb={10}
        sx={{
          backgroundImage: ({
            functions: { linearGradient, rgba },
            palette: { gradients },
          }) =>
            image &&
            `${linearGradient(
              rgba(gradients.dark.main, 0.4),
              rgba(gradients.dark.state, 0.4),
            )}, url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <MDBox
        mt={{ xs: -20, lg: -18 }}
        px={1}
        width="calc(100% - 2rem)"
        mx="auto"
      >
        <Grid container justifyContent="center">
          <Grid item xs={12} md={8} lg={6}>
            {children}
          </Grid>
        </Grid>
      </MDBox>
      {/* <Footer /> */}
    </PageLayout>
  );
}

// Setting default props for the CoverLayout
CoverLayout.defaultProps = {
  coverHeight: "35vh",
};

// Typechecking props for the CoverLayout
CoverLayout.propTypes = {
  coverHeight: PropTypes.string,
  image: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default CoverLayout;
