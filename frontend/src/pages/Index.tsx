import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { setPageTitle } from '../store/themeConfigSlice';
import { useAppDispatch, useAppSelector } from '../store';
import { getUsersCount } from '../store/adminSlice';

const Index = () => {
    const dispatch = useAppDispatch();

    const { data: usersCount } = useAppSelector((state: any) => state.getUsersCount);

    useEffect(() => {
        dispatch(setPageTitle('Dashboard'));
    }, [usersCount]);

    // Get the count of users
    useEffect(() => {
        dispatch(getUsersCount());
    }, [dispatch]);

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/" className="text-primary hover:underline">
                        Dashboard
                    </Link>
                </li>
            </ul>
            <div className="h-1/2">
                <div className="flex justify-center items-center">
                    <img className="w-96" src="assets/images/main-logo.png" alt="main-logo" />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6 text-white mt-6">
                <div className="panel bg-gradient-to-r from-blue-500 to-blue-400">
                    <div className="flex justify-between">
                        <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Total Users</div>
                    </div>
                    <div className="flex items-center mt-5">
                        <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> {usersCount && usersCount.totalCount} </div>
                    </div>
                </div>

                <div className="panel bg-gradient-to-r from-blue-500 to-blue-400">
                    <div className="flex justify-between">
                        <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Verified Users</div>
                    </div>
                    <div className="flex items-center mt-5">
                        <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> {usersCount && usersCount.isVerifiedCount} </div>
                    </div>
                </div>

                <div className="panel bg-gradient-to-r from-blue-500 to-blue-400">
                    <div className="flex justify-between">
                        <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Unverified Users</div>
                    </div>
                    <div className="flex items-center mt-5">
                        <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> {usersCount && usersCount.notVerifiedCount} </div>
                    </div>
                </div>

                <div className="panel bg-gradient-to-r from-blue-500 to-blue-400">
                    <div className="flex justify-between">
                        <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Bounce Rate</div>
                    </div>
                    <div className="flex items-center mt-5">
                        <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> 49.10% </div>
                        <div className="badge bg-white/30">- 0.35% </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Index;
