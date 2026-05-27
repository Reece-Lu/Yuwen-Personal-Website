import React from 'react';
import styles from './SystemArchitecture.module.css';
import dnsIcon from '../../assets/icons/dns.png';
import reactIcon from '../../assets/icons/react.svg';
import vueIcon from '../../assets/icons/Vue.png';
import fastapiIcon from '../../assets/icons/FastAPI.png';
import mysqlIcon from '../../assets/icons/MySQL.png';
import springIcon from '../../assets/Spring.svg';
import githubIcon from '../../assets/github.png';

// ── Coordinate system (all in pixels) ─────────────────────────────────────
//
//  [DNS -380,120]     [Deployment Server 0,0  w=1060 h=680]   [MySQL 1110,80 w=430 h=330]
//                     │  [Docker Compose 20,105 w=1020 h=540] │
//  [GitHub  -430,370] │  │  [NGINX 20,50 w=475 h=420]         │  ┌─ personal_website DB
//  └─ LearningJourney │  │  ├─ React :80                      │  └─ residentialcomplex DB
//                     │  │  └─ Vue   :80      PDS   :9090     │
//                     │  │                    FastAPI:8000     │
//                     │  │                    PMS   :9091      │
//                     │  └──────────────────────────────────── │
//                     └────────────────────────────────────────
// ──────────────────────────────────────────────────────────────────────────

export const initialNodes = [

    // ── Deployment Server (outer container) ───────────────────────────────
    {
        id: 'azure-server',
        type: 'group',
        data: {
            label: (
                <div className={styles['node-label']}>
                    Deployment Server<br />
                    Operation System: Linux (Ubuntu 20.04)<br />
                    Public IP Address: 104.42.29.134
                </div>
            ),
        },
        position: { x: 0, y: 0 },
        style: { width: 1060, height: 680 },
    },

    // ── DNS ───────────────────────────────────────────────────────────────
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
                top:    { source: 0, target: 0 },
                bottom: { source: 0, target: 0 },
                left:   { source: 0, target: 0 },
                right:  { source: 1, target: 0 },
            },
        },
        position: { x: -380, y: 120 },
        style: { width: 310, height: 80, background: 'rgb(208, 192, 247)', color: 'white' },
    },

    // ── Docker Compose (inside server) ────────────────────────────────────
    {
        id: 'docker-compose',
        type: 'group',
        data: { label: <div className={styles['node-label']}>Docker Compose</div> },
        position: { x: 20, y: 105 },
        parentId: 'azure-server',
        extent: 'parent',
        style: {
            width: 1020,
            height: 540,
            backgroundColor: 'rgba(208, 192, 247, 0.08)',
            borderStyle: 'dashed',
        },
    },

    // ── Gateway / NGINX (inside docker-compose) ───────────────────────────
    {
        id: 'nginx',
        type: 'group',
        data: {
            label: (
                <div className={styles['node-label']}>
                    Gateway / NGINX<br />
                    <span className={styles['port-label']}>Port: 80</span>
                </div>
            ),
        },
        position: { x: 20, y: 50 },
        parentId: 'docker-compose',
        extent: 'parent',
        style: { width: 475, height: 420, backgroundColor: 'rgba(208, 192, 247, 0.2)' },
    },

    // ── React (inside nginx) ──────────────────────────────────────────────
    {
        id: 'personal-website',
        type: 'resizer',
        data: {
            label: (
                <div className={styles['node-label']}>
                    Yuwen Personal Website<br />
                    React<br />
                    <span className={styles['port-label']}>Port: 80</span>
                </div>
            ),
            icon: reactIcon,
            handles: {
                top:    { source: 0, target: 0 },
                bottom: { source: 0, target: 0 },
                left:   { source: 0, target: 3 },
                right:  { source: 0, target: 2 },
            },
        },
        position: { x: 15, y: 90 },
        parentId: 'nginx',
        extent: 'parent',
        style: { width: 390, height: 110, background: 'rgb(208, 192, 247)', color: 'white' },
    },

    // ── Vue (inside nginx) ────────────────────────────────────────────────
    {
        id: 'residential-management',
        type: 'resizer',
        data: {
            label: (
                <div className={styles['node-label']}>
                    Residential Complex Management<br />
                    Vue<br />
                    <span className={styles['port-label']}>Port: 80</span>
                </div>
            ),
            icon: vueIcon,
            handles: {
                top:    { source: 0, target: 0 },
                bottom: { source: 0, target: 1 },
                left:   { source: 1, target: 0 },
                right:  { source: 0, target: 0 },
            },
        },
        position: { x: 15, y: 260 },
        parentId: 'nginx',
        extent: 'parent',
        style: { width: 430, height: 110, background: 'rgb(208, 192, 247)', color: 'white' },
    },

    // ── Personal Website Data Service (inside docker-compose) ─────────────
    {
        id: 'personal-website-data',
        type: 'resizer',
        data: {
            label: (
                <div className={styles['node-label']}>
                    Personal Website Data Service<br />
                    Spring Boot · Java 17<br />
                    <span className={styles['port-label']}>Port: 9090</span>
                </div>
            ),
            icon: springIcon,
            handles: {
                top:    { source: 0, target: 0 },
                bottom: { source: 0, target: 0 },
                left:   { source: 1, target: 0 },
                right:  { source: 0, target: 1 },
            },
        },
        position: { x: 515, y: 50 },
        parentId: 'docker-compose',
        extent: 'parent',
        style: { width: 480, height: 130, background: 'rgb(208, 192, 247)', color: 'white' },
    },

    // ── FastAPI (inside docker-compose) ───────────────────────────────────
    {
        id: 'fastapi',
        type: 'resizer',
        data: {
            label: (
                <div className={styles['node-label']}>
                    FastAPI Service<br />
                    Python / FastAPI<br />
                    <span className={styles['port-label']}>Port: 8000</span>
                </div>
            ),
            icon: fastapiIcon,
            handles: {
                top:    { source: 0, target: 0 },
                bottom: { source: 0, target: 0 },
                left:   { source: 1, target: 0 },
                right:  { source: 0, target: 0 },
            },
        },
        position: { x: 515, y: 210 },
        parentId: 'docker-compose',
        extent: 'parent',
        style: { width: 480, height: 120, background: 'rgb(208, 192, 247)', color: 'white' },
    },

    // ── PMS Server (inside docker-compose) ────────────────────────────────
    {
        id: 'residential-management-data',
        type: 'resizer',
        data: {
            label: (
                <div className={styles['node-label']}>
                    Residential Complex Management Data Service<br />
                    Spring Boot · Java 8<br />
                    <span className={styles['port-label']}>Port: 9091</span>
                </div>
            ),
            icon: springIcon,
            handles: {
                top:    { source: 0, target: 0 },
                bottom: { source: 0, target: 0 },
                left:   { source: 1, target: 0 },
                right:  { source: 0, target: 1 },
            },
        },
        position: { x: 515, y: 350 },
        parentId: 'docker-compose',
        extent: 'parent',
        style: { width: 480, height: 175, background: 'rgb(208, 192, 247)', color: 'white' },
    },

    // ── MySQL — external DB server (standalone node, not inside azure-server)
    {
        id: 'mysql',
        type: 'group',
        data: {
            label: (
                <div className={styles['node-label']}>
                    MySQL 8.0<br />
                    External DB Server: 192.3.134.109<br />
                    <span className={styles['port-label']}>Port: 3306</span>
                </div>
            ),
        },
        position: { x: 1110, y: 80 },
        style: { width: 430, height: 330, backgroundColor: 'rgba(208, 192, 247, 0.2)' },
    },
    {
        id: 'mysql-personal-website',
        type: 'resizer',
        data: {
            label: (
                <div className={styles['node-label']}>
                    Personal Website Database
                </div>
            ),
            icon: mysqlIcon,
            handles: {
                top:    { source: 0, target: 0 },
                bottom: { source: 0, target: 0 },
                left:   { source: 1, target: 0 },
                right:  { source: 0, target: 0 },
            },
        },
        position: { x: 20, y: 115 },
        parentId: 'mysql',
        extent: 'parent',
        style: { width: 380, height: 70, background: 'rgb(208, 192, 247)', color: 'white' },
    },
    {
        id: 'mysql-residential-management',
        type: 'resizer',
        data: {
            label: (
                <div className={styles['node-label']}>
                    Complex Management Database
                </div>
            ),
            icon: mysqlIcon,
            handles: {
                top:    { source: 0, target: 0 },
                bottom: { source: 0, target: 0 },
                left:   { source: 1, target: 0 },
                right:  { source: 0, target: 0 },
            },
        },
        position: { x: 20, y: 210 },
        parentId: 'mysql',
        extent: 'parent',
        style: { width: 380, height: 70, background: 'rgb(208, 192, 247)', color: 'white' },
    },

    // ── GitHub Actions (outside, bottom-left) ─────────────────────────────
    {
        id: 'github-actions',
        type: 'group',
        data: { label: <div className={styles['node-label']}>Github Actions</div> },
        position: { x: -430, y: 370 },
        style: { width: 365, height: 160, backgroundColor: 'rgba(208, 192, 247, 0.2)' },
    },
    {
        id: 'intelliJ-writerSide',
        type: 'resizer',
        data: {
            label: (
                <div className={styles['node-label']}>
                    Learning Journey Hub<br />
                    With IntelliJ Writer Side
                </div>
            ),
            icon: githubIcon,
            handles: {
                top:    { source: 1, target: 0 },
                bottom: { source: 0, target: 0 },
                left:   { source: 0, target: 0 },
                right:  { source: 0, target: 0 },
            },
        },
        position: { x: 20, y: 50 },
        parentId: 'github-actions',
        extent: 'parent',
        style: { width: 325, height: 85, background: 'rgb(208, 192, 247)', color: 'white' },
    },
];

export const initialEdges = [
    {   // DNS → React
        id: 'e0-1',
        source: 'dns',
        target: 'personal-website',
        sourceHandle: 'right-source-1',
        targetHandle: 'left-target-1',
        type: 'default',
        animated: true,
        style: { stroke: 'rgb(158, 118, 255)', strokeWidth: 2, zIndex: 10 },
    },
    {   // Learning Journey Hub → React
        id: 'e0-2',
        source: 'intelliJ-writerSide',
        target: 'personal-website',
        sourceHandle: 'top-source-1',
        targetHandle: 'left-target-2',
        type: 'default',
        animated: true,
        style: { stroke: 'rgb(158, 118, 255)', strokeWidth: 2, zIndex: 10 },
    },
    {   // Vue → React (linked in main site)
        id: 'e0-3',
        source: 'residential-management',
        target: 'personal-website',
        sourceHandle: 'left-source-1',
        targetHandle: 'left-target-3',
        type: 'default',
        animated: true,
        style: { stroke: 'rgb(158, 118, 255)', strokeWidth: 2, zIndex: 10 },
    },
    {   // Personal Data Service → React
        id: 'e0-4',
        source: 'personal-website-data',
        target: 'personal-website',
        sourceHandle: 'left-source-1',
        targetHandle: 'right-target-1',
        type: 'default',
        animated: true,
        style: { stroke: 'rgb(158, 118, 255)', strokeWidth: 2, zIndex: 10 },
    },
    {   // FastAPI → React
        id: 'e0-5',
        source: 'fastapi',
        target: 'personal-website',
        sourceHandle: 'left-source-1',
        targetHandle: 'right-target-2',
        type: 'default',
        animated: true,
        style: { stroke: 'rgb(158, 118, 255)', strokeWidth: 2, zIndex: 10 },
    },
    {   // PMS Server → Vue
        id: 'e0-7',
        source: 'residential-management-data',
        target: 'residential-management',
        sourceHandle: 'left-source-1',
        targetHandle: 'bottom-target-1',
        type: 'default',
        animated: true,
        style: { stroke: 'rgb(158, 118, 255)', strokeWidth: 2, zIndex: 10 },
    },
    {   // Personal Website DB → Personal Data Service
        id: 'e0-8',
        source: 'mysql-personal-website',
        target: 'personal-website-data',
        sourceHandle: 'left-source-1',
        targetHandle: 'right-target-1',
        type: 'default',
        animated: true,
        style: { stroke: 'rgb(158, 118, 255)', strokeWidth: 2, zIndex: 10 },
    },
    {   // Complex DB → PMS Server
        id: 'e0-9',
        source: 'mysql-residential-management',
        target: 'residential-management-data',
        sourceHandle: 'left-source-1',
        targetHandle: 'right-target-1',
        type: 'default',
        animated: true,
        style: { stroke: 'rgb(158, 118, 255)', strokeWidth: 2, zIndex: 10 },
    },
];
