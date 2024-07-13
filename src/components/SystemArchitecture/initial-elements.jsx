import React from 'react';
import styles from './SystemArchitecture.module.css';
import { MarkerType } from "@xyflow/react";

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
        style: { width: 1400, height: 650 },
    },
    {
        id: 'dns',
        type: 'resizer',
        data: {
            label: (
                <div className={styles['node-label']}>
                    DNS From DreamHost<br />
                    meetyuwen.com
                </div>
            ),
            handles: {
                top: { source: 0, target: 0 },
                bottom: { source: 0, target: 0 },
                left: { source: 0, target: 0 },
                right: { source: 1, target: 0 },
            }
        },
        position: { x: -350, y: 200 },
        style: { width: 250, height: 75, background: 'rgb(208, 192, 247)', color: 'white' },
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
        style: { width: 390, height: 300, backgroundColor: 'rgba(208, 192, 247, 0.2)', },
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
            ),
            handles: {
                top: { source: 0, target: 0 },
                bottom: { source: 0, target: 0 },
                left: { source: 0, target: 3 },
                right: { source: 0, target: 2 },
            }},
        position: { x: 20, y: 50 },
        parentId: 'nginx',
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
            ),
            handles: {
                top: { source: 0, target: 0 },
                bottom: { source: 0, target: 1 },
                left: { source: 1, target: 0 },
                right: { source: 0, target: 0 },
            }},
        position: { x: 20, y: 170 },
        parentId: 'nginx',
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
            ),
            handles: {
                top: { source: 0, target: 0 },
                bottom: { source: 0, target: 0 },
                left: { source: 1, target: 0 },
                right: { source: 0, target: 0 },
            }},
        position: { x: 500, y: 240 },
        parentId: 'azure-server',
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
            ),
            handles: {
                top: { source: 0, target: 0 },
                bottom: { source: 0, target: 0 },
                left: { source: 1, target: 0 },
                right: { source: 0, target: 1 },
            }},
        position: { x: 500, y: 80 },
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
        position: { x: 500, y: 335 },
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
                    Port: 8081
                </div>
            ),
            handles: {
                top: { source: 0, target: 0 },
                bottom: { source: 0, target: 0 },
                left: { source: 1, target: 0 },
                right: { source: 0, target: 1 },
            }},
        position: { x: 20, y: 45 },
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
                    Port: 3306
                </div>
            )},
        position: { x: 950, y: 180 },
        parentId: 'azure-server',
        extent: 'parent',
        style: { width: 390, height: 220, backgroundColor: 'rgba(208, 192, 247, 0.2)' },
    },
    {
        id: 'mysql-personal-website',
        type: 'resizer',
        data: { label: (
                <div className={styles['node-label']}>
                    Personal Website Database
                </div>
            ),
            handles: {
                top: { source: 0, target: 0 },
                bottom: { source: 0, target: 0 },
                left: { source: 1, target: 0 },
                right: { source: 0, target: 0 },
            }},
        position: { x: 20, y: 80 },
        parentId: 'mysql',
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
            ),
            handles: {
                top: { source: 0, target: 0 },
                bottom: { source: 0, target: 0 },
                left: { source: 1, target: 0 },
                right: { source: 0, target: 0 },
            }},
        position: { x: 20, y: 150 },
        parentId: 'mysql',
        extent: 'parent',
        style: { width: 350, height: 50, background: 'rgb(208, 192, 247)', color: 'white' },
    },
    {
        id: 'github-actions',
        type: 'group',
        data: { label: (
                <div className={styles['node-label']}>
                    Github Actions
                </div>
            )},
        position: { x: 0, y: 680 },
        style: { width: 500, height: 130, backgroundColor: 'rgba(208, 192, 247, 0.2)' },
    },
    {
        id: 'intelliJ-writerSide',
        type: 'resizer',
        data: { label: (
                <div className={styles['node-label']}>
                    Learning Journey Hub With IntelliJ Writer Side
                </div>
            ),
            handles: {
                top: { source: 1, target: 0 },
                bottom: { source: 0, target: 0 },
                left: { source: 0, target: 0 },
                right: { source: 0, target: 0 },
            }},
        position: { x: 20, y: 50 },
        parentId: 'github-actions',
        extent: 'parent',
        style: { width: 450, height: 50, background: 'rgb(208, 192, 247)', color: 'white' },
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
