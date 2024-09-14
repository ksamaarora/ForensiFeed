import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Layout.css'; // Import the CSS file

const Layout = () => {
    const LinksLayout = [
        { link: "/", pageName: "UserDetails" },
        { link: "/UserTweet", pageName: "UserTweets" },
        { link: "/GenerateReport", pageName: "Generate Report" },
        { link: "/contact", pageName: "About Us" },
    ];

    return (
        <>
            <Navbar bg="light" expand="lg">
                <Navbar.Brand href="#home" style={{ color: 'skyblue' }}>TwitterScraper</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        {LinksLayout.map((item, index) => (
                            <Nav.Link as={Link} to={item.link} key={index}>
                                {item.pageName}
                            </Nav.Link>
                        ))}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <hr className="dynamic-hr" />
            <div className="outlet-container">
                <Outlet /> {/* Renders the current path selected */}
            </div>
        </>
    );
}

export default Layout;
