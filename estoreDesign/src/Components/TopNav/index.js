import { useSelector } from 'react-redux';
import './_top-nav.scss';
import { Link } from 'react-router-dom';
// import GoogleLogin from 'react-google-login';
import GoogleLogin from 'react-google-login';
import { useState } from 'react';
import { gapi } from 'gapi-script';

const TopNav = () => {
    const cartItemCount = useSelector(state => state.cartReducer.totalItems);
    const [userDetails, setUserDetails] = useState();

    const successHandler = (res) => {
        setUserDetails(res.profileObj);
    }
    console.log("data", userDetails);
    return (
        <div>
            <div className='header bg-dark'>
                <div className='row top-nav-row'>
                    <div className='brand my-1'>
                        <h1> eStore </h1>
                    </div>
                    <div className='inp-container p-0 my-4 w-50 h-25 bg-white'>
                        <div className='dropdown m-0 p-0'>
                            <select className='select-btn w-100 p-0 m-0'>
                                <option> Men </option>
                                <option> Women </option>
                                <option> Kids </option>
                            </select>
                        </div>
                        <input className='form-control ' placeholder='Search...' />
                        <button> <i className='fa fa-search' /> </button>
                    </div>
                    <div className='login-container p-0'>
                        <i className='fa fa-user-circle user-icon' />
                        <h5>
                            {console.log("here",userDetails)}
                            { userDetails === undefined?
                            <GoogleLogin clientId='240900363756-dnbf3ajp2h862m4duqlc072000il5qiu.apps.googleusercontent.com'
                            buttonText='Login'
                            cookiePolicy='single_host_origin'
                            onSuccess={successHandler}
                        />
                             :
                             userDetails.name }
                                  
                        </h5>
                    </div>
                    <div className='cart-wishlist'>
                        <ul className='p-0'>
                            <li className='list-icon'> <i className='fa fa-heart' /></li>
                            <Link to="/cart">
                                <li className='list-icon'>
                                    <i className='fa fa-shopping-cart' />
                                    {
                                        cartItemCount !== 0 ?
                                            <div id='cart-item-count'>
                                                <p> {cartItemCount} </p>
                                            </div>
                                            : <></>
                                    }
                                </li>
                            </Link>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TopNav;