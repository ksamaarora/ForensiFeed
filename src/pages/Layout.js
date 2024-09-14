import { Outlet , Link } from "react-router-dom";

const Layout = () =>
    {
        // const myList = [{names:"Home"},{names:"Blogs"},{names:"Contact"}];
        // const myList = ["Home","Blogs","Contact"]
        // const myListLink = ["/","/blogs","/contact"]
        const LinksLayout = [
            {link:"/",pageName:"UserDetails"},
            {link:"/UserTweet",pageName:"UserTweets"},
            {link:"/contact",pageName:"About Us"}    
        ];
        return(
            <>
                <nav>
                    <ul>{LinksLayout.map((item,index)=><li key={index}><Link to={item.link}>{item.pageName}</Link></li>)}</ul>
                </nav>
                <hr></hr>
                <Outlet/> {/*Renders the current path selected*/}
            </>
        );
    }

export default Layout;      