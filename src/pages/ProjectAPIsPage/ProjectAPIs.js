import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import "./styles.css";
import { useState } from "react";
import { initialTabs as tabs } from "./ingredients.ts";
import { motion, AnimatePresence } from "framer-motion";
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/joy/Typography';


const theme = createTheme({
    typography: {
        fontFamily: 'Nunito, Arial, sans-serif',
    },
});


const ProjectAPIs = () => {
    const [selectedTab, setSelectedTab] = useState(tabs[0]);

    return (
        <div>
            <Typography level="h2" sx={{ marginBottom: '1rem', marginLeft:'2rem', fontFamily: theme.typography.fontFamily }}>Web Service</Typography>
            <div className="window">
                <nav>
                    <ul>
                        {tabs.map((item) => (
                            <li
                                key={item.label}
                                className={item === selectedTab ? "selected" : ""}
                                onClick={() => setSelectedTab(item)}
                            >
                                {`${item.icon} ${item.label}`}
                                {item === selectedTab ? (
                                    <motion.div className="underline" layoutId="underline" />
                                ) : null}
                            </li>
                        ))}
                    </ul>
                </nav>
                <main>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedTab ? selectedTab.label : "empty"}
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Box sx={{ maxHeight: '80vh', overflow: 'auto' }}>
                                <SwaggerUI url={selectedTab.swagger} />
                            </Box>
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default ProjectAPIs;

