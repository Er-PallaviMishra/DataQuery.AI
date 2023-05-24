import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories } from '../../Redux/Category/actions';
import './_cat-nav.scss';

const CatNav = ()=>{
    const categories = useSelector(state=>state.categoryReducer.categories);
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(getCategories());
    },[]);

    return(
        <>
            <div className='cat-nav-container container'>
                <ul>
                    {
                        categories.map((category)=>{
                            if(category.parent_category_id === null){
                                return(
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