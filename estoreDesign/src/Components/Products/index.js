import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addCartItem } from '../../Redux/Cart/cartSlice';
import { getProducts } from '../../Redux/Product/actions';
import './_products.scss';

const Products = () => {
    const productData = useSelector(state => state.productReducer.products);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getProducts());
    }, [])

    const addToCart = (itemData) => {
        const payload = { ...itemData, quantity: 1 };
        dispatch(addCartItem(payload));
    }

    // console.log("here", productData);

    return (
        <div className='products-container'>
            {
                productData.map((product, key) => {
                    return (
                        <div className='mx-5 p-3 product-card'>
                            <Link
                                state={product}
                                to={`/productdetails`}
                            >
                                <div className='product-image-container'>
                                    <img src={require('../../assets/images/shop/' + product.product_img)} />
                                </div>
                            </Link>

                            {/* <Link
                                to="/productDetails"
                                state={product}
                            >
                                <div className='product-image-container'>
                                    <img src={require('../../assets/images/shop/'+product.product_img)}/>
                                </div>
                            </Link> */}
                            <div className='product-info'>
                                <h5>
                                    <Link
                                        state={product} to={`/productdetails`}
                                    > {product.product_name} </Link>
                                </h5>
                                <p className='product-price'> ${product.price} </p>
                                <div className='product-rating'>
                                    <i className='fa fa-star' />
                                    <i className='fa fa-star' />
                                    <i className='fa fa-star' />
                                    <i className='fa fa-star' />
                                    <i className='fa fa-star' />
                                </div>
                            </div>
                            <div className='my-3' onClick={() => addToCart(product)}>
                                <div className='cart-button'>
                                    <div className='cart-icon-container'>
                                        <i className='fa fa-shopping-cart mx-4' />
                                    </div>
                                    <div className='cart-text-container mx-3'>
                                        <p> Add to Cart </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Products;