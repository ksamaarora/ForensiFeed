import React ,{useState} from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter , Route,Routes,Link } from 'react-router-dom';


import Layout from './pages/Layout.js';
import App from './pages/Home.js';
import Contact from './pages/Contact.js';
import UserTweets from './pages/UserTweets.js';
import GenerateReport from './pages/GenerateReport.js';
import NoPage from './pages/NoPage.js';

export default function MainApp()
{
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element ={<App/>}></Route>
                    <Route path="/UserTweet" element={<UserTweets />}></Route>
                    <Route path='/GenerateReport' element={<GenerateReport/>}></Route>
                    <Route path="/contact" element ={<Contact/>}></Route>
                    <Route path="*" element = {<NoPage/>}></Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<MainApp />);
