import React from 'react';
import styles from './SystemArchitecture.module.css';

export const initialNodes = [
    {
        id: 'azure-server',
        type: 'resizer',
        data: { label: (
                <div className={styles['node-label']}>
                    Microsoft Azure Server<br />
                    Operation System: Linux (ubuntu 20.04)<br />
                    Size: Standard E2s v3 (2 vcpus, 16 GiB memory)<br />
                    Public IP Address: 104.42.29.134
                </div>
            )},
        position: { x: 0, y: 0 },
        style: { width: 1400, height: 650 },
    },
    {
        id: 'dns',
        type: 'resizer',
        data: { label: (
                <div className={styles['node-label']}>
                    DNS From DreamHost<br />
                    meetyuwen.com
                </div>
            )},
        position: { x: -350, y: 200 },
        style: { width: 250, height: 75, background: 'rgb(208, 192, 247)', color: 'white'},
    },
    {
        id: 'nginx',
        type: 'resizer',
        data: { label: <div className={styles['node-label']}>
                NGINX
            </div> },
        position: { x: 40, y: 150 },
        parentNode: 'azure-server',
        extent: 'parent',
        style: { width: 390, height: 300 },
    },
    {
        id: 'personal-website',
        type: 'resizer',
        data: { label: (
                <div className={styles['node-label']}>
                    Yuwen Personal Website<br />
                    React<br />
                    Port: 3000
                </div>
            )},
        position: { x: 20, y: 50 },
        parentNode: 'nginx',
        extent: 'parent',
        style: { width: 350, height: 100, background: 'rgb(208, 192, 247)', color: 'white' },
    },
    {
        id: 'residential-management',
        type: 'resizer',
        data: { label: (
                <div className={styles['node-label']}>
                    Residential Complex Management<br />
                    Vue<br />
                    Port: 8080
                </div>
            )},
        position: { x: 20, y: 170 },
        parentNode: 'nginx',
        extent: 'parent',
        style: { width: 350, height: 100, background: 'rgb(208, 192, 247)', color: 'white' },
    },
    {
        id: 'fastapi',
        type: 'resizer',
        data: { label: (
                <div className={styles['node-label']}>
                    FastAPI<br />
                    Port: 8000
                </div>
            )},
        position: { x: 500, y: 240 },
        parentNode: 'azure-server',
        extent: 'parent',
        style: { width: 350, height: 75, background: 'rgb(208, 192, 247)', color: 'white' },
    },
    {
        id: 'personal-website-data',
        type: 'resizer',
        data: { label: (
                <div className={styles['node-label']}>
                    Personal Website Data Service<br />
                    Spring Boot<br />
                    Java 17<br />
                    Port: 8080
                </div>
            )},
        position: { x: 500, y: 80 },
        parentNode: 'azure-server',
        style: { width: 350, height: 140, background: 'rgb(208, 192, 247)', color: 'white' },
        extent: 'parent',
    },
    {
        id: 'docker',
        type: 'resizer',
        data: { label: (
                <div className={styles['node-label']}>
                    Docker
                </div>
            )},
        position: { x: 500, y: 335 },
        parentNode: 'azure-server',
        style: { width: 350, height: 240 },
        extent: 'parent',
    },
    {
        id: 'residential-management-data',
        type: 'resizer',
        data: { label: (
                <div className={styles['node-label']}>
                    Residential Complex Management Data Service<br />
                    Spring Boot<br />
                    Docker Java 8<br />
                    Port: 8081
                </div>
            )},
        position: { x: 20, y: 45 },
        parentNode: 'docker',
        style: { width: 310, height: 160, background: 'rgb(208, 192, 247)', color: 'white' },
        extent: 'parent',
    },
    {
        id: 'mysql',
        type: 'resizer',
        data: { label: (
                <div className={styles['node-label']}>
                    MySQL 8.0.37-0ubuntu0.20.04.3<br />
                    Port: 3306
                </div>
            )},
        position: { x: 950, y: 180 },
        parentNode: 'azure-server',
        extent: 'parent',
        style: { width: 390, height: 220 },
    },
    {
        id: 'mysql-personal-website',
        type: 'resizer',
        data: { label: (
                <div className={styles['node-label']}>
                    Personal Website Database
                </div>
            )},
        position: { x: 20, y: 80 },
        parentNode: 'mysql',
        extent: 'parent',
        style: { width: 350, height: 50, background: 'rgb(208, 192, 247)', color: 'white' },
    },
    {
        id: 'mysql-residential-management',
        type: 'resizer',
        data: { label: (
                <div className={styles['node-label']}>
                    Complex Management Database
                </div>
            )},
        position: { x: 20, y: 150 },
        parentNode: 'mysql',
        extent: 'parent',
        style: { width: 350, height: 50, background: 'rgb(208, 192, 247)', color: 'white' },
    },
    {
        id: 'github-actions',
        type: 'resizer',
        data: { label: (
                <div className={styles['node-label']}>
                    Github Actions
                </div>
            )},
        position: { x: 0, y: 680 },
        style: { width: 500, height: 130 },
    },
    {
        id: 'intelliJ-writerSide',
        type: 'resizer',
        data: { label: (
                <div className={styles['node-label']}>
                    Learning Journey Hub With IntelliJ Writer Side
                </div>
            )},
        position: { x: 20, y: 50 },
        parentNode: 'github-actions',
        extent: 'parent',
        style: { width: 450, height: 50, background: 'rgb(208, 192, 247)', color: 'white' },
    },
];

export const initialEdges = [
    // Your edges here
];