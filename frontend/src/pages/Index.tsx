import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '../store/themeConfigSlice';

const Index = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Dashboard'));
    });

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/" className="text-primary hover:underline">
                        Dashboard
                    </Link>
                </li>
            </ul>
            <div className='h-1/2'>
                <div className="flex justify-center items-center">
                    <img className="w-96" src="assets/images/main-logo.png" alt="main-logo" />
                </div>
            </div>
        </div>
    );
};

export default Index;
