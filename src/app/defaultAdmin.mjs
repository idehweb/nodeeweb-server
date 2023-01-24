// console.log("#f index.mjs", new Date());
import "ignore-styles";
import _ from "lodash";
import express from "express";
import React from 'react';


export default [{
    "path": "/admin",
    "method": "get",
    "access": "admin_user,admin_shopManager",
    "controller": (req, res, next) => {
        console.log('show admin');
        return res.admin()
    },

}, {
    "path": "/admin/login",
    "method": "get",
    "access": "",
    "controller": (req, res, next) => {
        console.log('/admin/login');
        return res.admin()
    },

}, {
    "path": "/admin/routes",
    "method": "get",
    "access": "admin_user,admin_shopManager",
    "controller": (req, res, next) => {
        // console.log('here');
        return res.json({
            success: 'sss'
        })
    },

}, {
    "path": "/admin/:model",
    "method": "get",
    "access": "",
    "controller": (req, res, next) => {
        // console.log('here');
        if (req.headers.response != 'json')
            return res.admin()
    },

}, {
    "path": "/admin/:model/:action",
    "method": "get",
    "access": "",
    "controller": (req, res, next) => {
        // console.log('here');
        if (req.headers.response != 'json')
            return res.admin()
    },

}, {
    "path": "/admin/:model/:action/:id",
    "method": "get",
    "access": "",
    "controller": (req, res, next) => {
        // console.log('here');
        if (req.headers.response != 'json')
            return res.admin()
    },

}]