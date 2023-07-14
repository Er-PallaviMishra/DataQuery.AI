import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories } from '../../Redux/Category/actions';
import './_cat-nav.scss';

const CatNav = () => {
    const categories = useSelector(state => state.categoryReducer.categories);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getCategories());
    }, []);
    // console.log("cat",categories);
    // console.log('type',typeof(categories))
    return (
        <>
            <div className='cat-nav-container container'>
                <ul>
                    {
                        categories.map((category) => {
                            // console.log("cate",category)
                            if (category.parentcategoryid === 0) {
                                return (
                                    <li className='list-items'> <a href='#'> {category.category} </a> </li>
                                )
                            }
                        })
                    }

                </ul>
            </div>
        </>
    )
}

export default CatNav;