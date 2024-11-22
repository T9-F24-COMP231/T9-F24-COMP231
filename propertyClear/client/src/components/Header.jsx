import React from "react";
import { Link } from "react-router-dom";
import "../assets/styles/header_footer.css";

const Header = () => {
    return (
        <div className="header_component">
            <div className="title">
                <Link to="/"><h3>Property Clear</h3></Link>
            </div>

            <div className="navigation">
                <Link to="/search"><p>Search</p></Link>
                <Link to="/myProperty"><p>My Properties</p></Link>
                <Link to="/account"><p>Account</p></Link>
                <Link to="/help"><p>Help</p></Link>
                <button>
                    <Link to=""><p>Sign In</p></Link>
                </button>
            </div>
        </div>
    )
}

export default Header