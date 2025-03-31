import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Typography, Grid } from '@mui/material';
import CodeEditor from "../../components/CodeEditor";
import Container from "@mui/material/Container";
import CsvTable from "../../components/CsvTable";
import ProjectFlowChart from "./ProjectFlowChart";


const theme = createTheme({
    typography: {
        fontFamily: 'Avenir, Nunito, Arial, sans-serif',
    },
});

const LaptopPricePrediction = () => {
    const sampleCode = `
    # Core code example (excerpt from crawling_spider.py)
    import scrapy
    
    class LaptopSpider(scrapy.Spider):
        name = "laptop_spider"
        allowed_domains = ["smartprix.com"]
        start_urls = ["https://www.smartprix.com/laptops"]
    
        def parse(self, response):
            # Extract data
            rating = response.xpath('//div[@class="pg-prd-rating"]/text()').get()
            price = response.xpath('//div[@class="pg-prd-pricewrap"]/div[@class="price"]/text()').get()
            specs = response.xpath('//div[@class="sm-fullspecs-grp"]').getall()
    
            yield {
                'rating': rating,
                'price': price,
                'specs': specs
            }
    `;

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="lg">
                <Grid container spacing={2}>
                    {/* Title */}
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'left', marginTop:'20px' }}>
                        <Typography variant="h4" gutterBottom fontWeight="bold">
                            Machine Learning-Based Appraisal for Laptops
                        </Typography>
                    </Grid>

                    {/* Overview Section */}
                    <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: '#9D42AD' }}>
                            Overview
                        </Typography>
                        <Typography variant="body1" paragraph>
                            This section covers the process of data crawling and cleaning using Scrapy, as well as the implementation of prediction models using machine learning algorithms.
                        </Typography>
                        <ProjectFlowChart />
                    </Grid>

                    <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: '#9D42AD' }}>
                            Objectives
                        </Typography>
                        <Typography variant="body1" paragraph>
                            This project, developed as part of the <b>CSC503 Data Mining course at the University of Victoria</b>, aims to create an <b>automated, machine learning-based price prediction model</b> tailored for the rapidly expanding <b>second-hand laptop market</b>.
                            <br /><br />
                            Trading companies face challenges in valuing laptops accurately due to <b>diverse configurations</b> and <b>price fluctuations</b>. Current <b>manual appraisal</b> methods are <b>time-consuming and subjective</b>, often lacking the <b>transparency and accuracy</b> that customers expect.
                            <br /><br />
                            By leveraging this model, companies can conduct <b>online automated appraisals</b>, enhancing <b>efficiency, customer satisfaction</b>, and <b>cost-effectiveness</b> while gaining a <b>competitive edge</b> in the marketplace.
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: '#9D42AD' }}>
                            Data Collection
                        </Typography>
                        {/* Why Smartprix.com Section */}
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" gutterBottom fontWeight="bold">
                                Why Smartprix.com?
                            </Typography>
                            <Typography variant="body1" paragraph>
                                We chose <b>Smartprix.com</b> as our data source because this website is not sensitive to data scraping, making it suitable for efficient data collection. Additionally, Smartprix.com provides comprehensive information on laptops, including various configuration details and prices, which meets the needs of our data analysis and model training.
                            </Typography>
                        </Box>

                        {/* Implementation with Scrapy Section */}
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" gutterBottom fontWeight="bold">
                                Implementation with Scrapy
                            </Typography>
                            <Typography variant="body1" paragraph>
                                The data collection was implemented using Python's <b>Scrapy</b> framework. By leveraging XPath, we located and extracted the required information from the Smartprix.com laptop pages. The spider crawls the pages and retrieves key fields such as <b>rating, price, and configuration details</b>. Below is a sample of the core code showing how data is extracted with XPath:
                            </Typography>
                            <Box sx={{ maxWidth: '900px', width: '100%', mx: 'auto' }}>
                                <CodeEditor code={sampleCode} language="python" readOnly={true} />
                            </Box>
                        </Box>

                        {/* Data Fields Collected Section */}
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" gutterBottom fontWeight="bold">
                                Data Fields Collected
                            </Typography>
                            <Typography variant="body1" paragraph>
                                The following fields were collected to build a detailed dataset of laptop configurations:
                            </Typography>
                            <CsvTable
                                filePath="/data/Laptop_Cleaned_Data.csv"
                                tableTitle="Laptop Data"
                                defaultRowsPerPage={5}
                                primaryColor="#9D42AD"
                            />
                        </Box>

                    </Grid>
                </Grid>
            </Container>
        </ThemeProvider>
    );
};

export default LaptopPricePrediction;
