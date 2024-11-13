import React from 'react';
import styles from './SystemArchitecture.module.css';
import dnsIcon from '../../assets/icons/dns.png';
import reactIcon from '../../assets/icons/react.svg';
import vueIcon from '../../assets/icons/Vue.png';
import fastapiIcon from '../../assets/icons/FastAPI.png';
import mysqlIcon from '../../assets/icons/MySQL.png';
import springIcon from '../../assets/Spring.svg';
import githubIcon from '../../assets/github.png';

export const initialNodes = [
    {
        id: 'azure-server',
        type: 'group',
        data: { label: (
                <div className={styles['node-label']}>
                    Microsoft Azure Server<br />
                    Operation System: Linux (ubuntu 20.04)<br />
                    Size: Standard E2s v3 (2 vcpus, 16 GiB memory)<br />
                    Public IP Address: 104.42.29.134
                </div>
            )},
        position: { x: 0, y: 0 },
        style: { width: 1400, height: 600 },
    },
    {
        id: 'dns',
        type: 'resizer',
        data: {
            label: (
                <div className={styles['node-label']}>
                    DNS From DreamHost<br />
                    www.meetyuwen.com
                </div>
            ),
            icon: dnsIcon,
            handles: {
                top: { source: 0, target: 0 },
                bottom: { source: 0, target: 0 },
                left: { source: 0, target: 0 },
                right: { source: 1, target: 0 },
            }
        },
        position: { x: -350, y: 100 },
        style: { width: 300, height: 75, background: 'rgb(208, 192, 247)', color: 'white' },
    },
    {
        id: 'nginx',
        type: 'group',
        data: { label: <div className={styles['node-label']}>
                NGINX
            </div> },
        position: { x: 40, y: 150 },
        parentId: 'azure-server',
        extent: 'parent',
        style: { width: 470, height: 300, backgroundColor: 'rgba(208, 192, 247, 0.2)', },
    },
    {
        id: 'personal-website',
        type: 'resizer',
        data: { label: (
                <div className={styles['node-label']}>
                    Yuwen Personal Website<br />
                    React<br />
                    <span className={styles['port-label']}>Port: 3000</span>
                </div>
            ),
            icon: reactIcon,
            handles: {
                top: { source: 0, target: 0 },
                bottom: { source: 0, target: 0 },
                left: { source: 0, target: 3 },
                right: { source: 0, target: 2 },
            }},
        position: { x: 20, y: 55 },
        parentId: 'nginx',
        extent: 'parent',
        style: { width: 320, height: 100, background: 'rgb(208, 192, 247)', color: 'white' },
    },
    {
        id: 'residential-management',
        type: 'resizer',
        data: { label: (
                <div className={styles['node-label']}>
                    Residential Complex Management<br />
                    Vue<br />
                    <span className={styles['port-label']}>Port: 8080</span>
                </div>
            ),
            icon: vueIcon,
            handles: {
                top: { source: 0, target: 0 },
                bottom: { source: 0, target: 1 },
                left: { source: 1, target: 0 },
                right: { source: 0, target: 0 },
            }},
        position: { x: 40, y: 175 },
        parentId: 'nginx',
        extent: 'parent',
        style: { width: 400, height: 100, background: 'rgb(208, 192, 247)', color: 'white' },
    },
    {
        id: 'fastapi',
        type: 'resizer',
        data: { label: (
                <div className={styles['node-label']}>
                    Quantum Machine Learning<br />
                    FastAPI<br />
                    <span className={styles['port-label']}>Port: 8000</span>
                </div>
            ),
            icon: fastapiIcon,
            handles: {
                top: { source: 0, target: 0 },
                bottom: { source: 0, target: 0 },
                left: { source: 1, target: 0 },
                right: { source: 0, target: 0 },
            }},
        position: { x: 550, y: 200 },
        parentId: 'azure-server',
        extent: 'parent',
        style: { width: 350, height: 120, background: 'rgb(208, 192, 247)', color: 'white' },
    },
    {
        id: 'personal-website-data',
        type: 'resizer',
        data: { label: (
                <div className={styles['node-label']}>
                    Personal Website Data Service<br />
                    Spring Boot<br />
                    Java 17<br />
                    <span className={styles['port-label']}>Port: 8080</span>
                </div>
            ),
            icon: springIcon,
            handles: {
                top: { source: 0, target: 0 },
                bottom: { source: 0, target: 0 },
                left: { source: 1, target: 0 },
                right: { source: 0, target: 1 },
            }},
        position: { x: 550, y: 40 },
        parentId: 'azure-server',
        style: { width: 350, height: 140, background: 'rgb(208, 192, 247)', color: 'white' },
        extent: 'parent',
    },
    {
        id: 'docker',
        type: 'group',
        data: { label: (
                <div className={styles['node-label']}>
                    Docker
                </div>
            )},
        position: { x: 550, y: 335 },
        parentId: 'azure-server',
        style: { width: 350, height: 240, backgroundColor: 'rgba(208, 192, 247, 0.2)' },
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
                    <span className={styles['port-label']}>Port: 8081</span>
                </div>
            ),
            icon: springIcon,
            handles: {
                top: { source: 0, target: 0 },
                bottom: { source: 0, target: 0 },
                left: { source: 1, target: 0 },
                right: { source: 0, target: 1 },
            }},
        position: { x: 20, y: 55 },
        parentId: 'docker',
        style: { width: 310, height: 160, background: 'rgb(208, 192, 247)', color: 'white' },
        extent: 'parent',
    },
    {
        id: 'mysql',
        type: 'group',
        data: { label: (
                <div className={styles['node-label']}>
                    MySQL 8.0.37-0ubuntu0.20.04.3<br />
                    <span className={styles['port-label']}>Port: 3306</span>
                </div>
            )},
        position: { x: 950, y: 160 },
        parentId: 'azure-server',
        extent: 'parent',
        style: { width: 420, height: 240, backgroundColor: 'rgba(208, 192, 247, 0.2)' },
    },
    {
        id: 'mysql-personal-website',
        type: 'resizer',
        data: { label: (
                <div className={styles['node-label']}>
                    Personal Website Database
                </div>
            ),
            icon: mysqlIcon,
            handles: {
                top: { source: 0, target: 0 },
                bottom: { source: 0, target: 0 },
                left: { source: 1, target: 0 },
                right: { source: 0, target: 0 },
            }},
        position: { x: 20, y: 80 },
        parentId: 'mysql',
        extent: 'parent',
        style: { width: 350, height: 60, background: 'rgb(208, 192, 247)', color: 'white' },
    },
    {
        id: 'mysql-residential-management',
        type: 'resizer',
        data: { label: (
                <div className={styles['node-label']}>
                    Complex Management Database
                </div>
            ),
            icon: mysqlIcon,
            handles: {
                top: { source: 0, target: 0 },
                bottom: { source: 0, target: 0 },
                left: { source: 1, target: 0 },
                right: { source: 0, target: 0 },
            }},
        position: { x: 20, y: 160 },
        parentId: 'mysql',
        extent: 'parent',
        style: { width: 350, height: 60, background: 'rgb(208, 192, 247)', color: 'white' },
    },
    {
        id: 'github-actions',
        type: 'group',
        data: { label: (
                <div className={styles['node-label']}>
                    Github Actions
                </div>
            )},
        position: { x: -420, y: 350 },
        style: { width: 365, height: 150, backgroundColor: 'rgba(208, 192, 247, 0.2)' },
    },
    {
        id: 'intelliJ-writerSide',
        type: 'resizer',
        data: { label: (
                <div className={styles['node-label']}>
                    Learning Journey Hub With IntelliJ Writer Side
                </div>
            ),
            icon: githubIcon,
            handles: {
                top: { source: 1, target: 0 },
                bottom: { source: 0, target: 0 },
                left: { source: 0, target: 0 },
                right: { source: 0, target: 0 },
            }},
        position: { x: 20, y: 50 },
        parentId: 'github-actions',
        extent: 'parent',
        style: { width: 325, height: 75, background: 'rgb(208, 192, 247)', color: 'white' },
    },
];

export const initialEdges = [
    {
        id: 'e0-1',
        source: 'dns',
        target: 'personal-website',
        sourceHandle: 'right-source-1',
        targetHandle: 'left-target-1',
        type: 'default',
        animated: true,
        style: { stroke: 'rgb(158, 118, 255)', strokeWidth: 2, zIndex: 10}
    },{
        id: 'e0-2',
        source: 'intelliJ-writerSide',
        target: 'personal-website',
        sourceHandle: 'top-source-1',
        targetHandle: 'left-target-2',
        type: 'default',
        animated: true,
        style: { stroke: 'rgb(158, 118, 255)', strokeWidth: 2, zIndex: 10}
    },{
        id: 'e0-3',
        source: 'residential-management',
        target: 'personal-website',
        sourceHandle: 'left-source-1',
        targetHandle: 'left-target-3',
        type: 'default',
        animated: true,
        style: { stroke: 'rgb(158, 118, 255)', strokeWidth: 2, zIndex: 10}
    },{
        id: 'e0-4',
        source: 'personal-website-data',
        target: 'personal-website',
        sourceHandle: 'left-source-1',
        targetHandle: 'right-target-1',
        type: 'default',
        animated: true,
        style: { stroke: 'rgb(158, 118, 255)', strokeWidth: 2, zIndex: 10}
    },{
        id: 'e0-5',
        source: 'fastapi',
        target: 'personal-website',
        sourceHandle: 'left-source-1',
        targetHandle: 'right-target-2',
        type: 'default',
        animated: true,
        style: { stroke: 'rgb(158, 118, 255)', strokeWidth: 2, zIndex: 10}
    },{
        id: 'e0-7',
        source: 'residential-management-data',
        target: 'residential-management',
        sourceHandle: 'left-source-1',
        targetHandle: 'bottom-target-1',
        type: 'default',
        animated: true,
        style: { stroke: 'rgb(158, 118, 255)', strokeWidth: 2, zIndex: 10}
    },{
        id: 'e0-8',
        source: 'mysql-personal-website',
        target: 'personal-website-data',
        sourceHandle: 'left-source-1',
        targetHandle: 'right-target-1',
        type: 'default',
        animated: true,
        style: { stroke: 'rgb(158, 118, 255)', strokeWidth: 2, zIndex: 10}
    },{
        id: 'e0-9',
        source: 'mysql-residential-management',
        target: 'residential-management-data',
        sourceHandle: 'left-source-1',
        targetHandle: 'right-target-1',
        type: 'default',
        animated: true,
        style: { stroke: 'rgb(158, 118, 255)', strokeWidth: 2, zIndex: 10}
    }
];
