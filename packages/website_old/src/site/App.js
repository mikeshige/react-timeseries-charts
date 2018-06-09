/**
 *  Copyright (c) 2017, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import "./App.css";
import _ from "lodash";
import React, { Component } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";

import Prism from "prismjs"; // eslint-disable-line
import "prismjs/components/prism-typescript";
import "prismjs/themes/prism.css";

import Guide from "./components/Guide";
import Example from "./components/Example";

import Header from "./Header";
import Sidebar from "./Sidebar";
import ScrollToTop from "./ScrollToTop";

import TsModule from "./api/Module";
import TsClass from "./api/Class";
import TsType from "./api/Type";
import TsObject from "./api/Object";
// import TsEnum from "./api/Enum";
// import TsFunction from "./api/Function";
// import TsFunctionList from "./api/FunctionList";
// import TsInterface from "./api/Interface";
// import TsMethod from "./api/Method";

// Generated pond.js code and documentation as a JSON file. This is what we are
// parsing here to generate the API documentation
import docsJSON from "../doc.json";

const docs = {
    modules: {},
    classes: {},
    functions: {},
    methods: {},
    interfaces: {},
    enums: {},
    objects: {},
    types: {},
    properties: {}
};

function buildTypes(root) {
    _.forEach(root, child => {
        const { name, kindString } = child;
        const n = name.toLowerCase();
        switch (kindString) {
            case "External module":
                docs.modules[n.replace(/['"]+/g, "")] = child;
                break;
            case "Class":
                docs.classes[n] = child;
                break;
            case "Object literal":
                docs.objects[n] = child;
                break;
            case "Function":
                docs.functions[n] = child;
                break;
            case "Interface":
                docs.interfaces[n] = child;
                break;
            case "Type alias":
                docs.types[n] = child;
                break;
            case "Method":
                docs.methods[n] = child;
                break;
            case "Enumeration":
            case "Enumeration member":
                docs.enums[n] = child;
                break;
            case "Property":
                docs.properties[n] = child;
                break;
            default:
        }
        if (_.has(child, "children")) {
            buildTypes(child.children);
        }
    });
}

buildTypes(docsJSON.children);

console.log("docs are ", docs);

export default class extends Component {
    render() {
        const { name } = docs;
        const bodyStyle = {
            marginTop: 100,
            display: "flex",
            minHeight: "100vh",
            flexDirection: "column"
        };
        const mainStyle = {
            display: "flex",
            flex: 1,
            marginLeft: 20,
            marginRight: 40
        };

        const footerStyle = {
            flex: "none",
            height: 10,
            background: "#DDD"
        };
        const contentStyle = {
            flex: 1
        };

        return (
            <Router>
                <div style={bodyStyle}>
                    <Header />
                    <div style={mainStyle}>
                        <div style={contentStyle}>
                            {" "}
                            <Switch>
                                <Route exact path="/" component={Guide} />
                                <Route path="/guide/:doc" component={Guide} />
                                <Route path="/example/:example" component={Example} />
                                <Route
                                    path={`/module/:name`}
                                    render={props => (
                                        <ScrollToTop key={props.match.params.name}>
                                            <TsModule module={docs.modules[props.match.params.name]} />
                                        </ScrollToTop>
                                    )}
                                />
                                <Route
                                    path={`/class/:name`}
                                    render={props => (
                                        <ScrollToTop key={props.match.params.name}>
                                            <TsClass
                                                class={docs.classes[props.match.params.name]}
                                                lookups={docs}
                                            />
                                        </ScrollToTop>
                                    )}
                                />
                                <Route
                                    path={`/type/:name`}
                                    render={props => (
                                        <TsObject object={docs.types[props.match.params.name]} />
                                    )}
                                />
                                <Route
                                    path={`/object/:name`}
                                    render={props => (
                                        <TsObject object={docs.objects[props.match.params.name]} />
                                    )}
                                />
                                <Route
                                    path={`/type/:name`}
                                    render={props => (
                                        <TsType type={docs.types[props.match.params.name]} />
                                    )}
                                />
                            </Switch>
                        </div>
                        <Sidebar docs={docs} />
                    </div>
                    <div style={footerStyle}>…</div>
                </div>
            </Router>
        );
    }
}