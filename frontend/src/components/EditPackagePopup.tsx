import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition, Tab } from '@headlessui/react';
import { useAppDispatch, useAppSelector } from '../store';
import { editPackage, getPackageByIdAction } from '../store/packageSlice';

const EditPackagePopup = ({ id, modal22, setModal22 }: any) => {
    const dispatch = useAppDispatch();

    const { data: getSinglePackageData } = useAppSelector((state: any) => state.getPackageById);

    const [packageName, setPackageName] = useState(getSinglePackageData && getSinglePackageData.singlePackage.packageName);
    const [amount, setAmount] = useState(getSinglePackageData && getSinglePackageData.singlePackage.amount);
    const [memberProfit, setMemberProfit] = useState(getSinglePackageData && getSinglePackageData.singlePackage.memberProfit);

    useEffect(() => {
        dispatch(getPackageByIdAction(id));
    }, [dispatch, id]);

    const submitEditHandler = () => {
        const packageId = id;
        dispatch(editPackage({ packageId, packageName, amount, memberProfit }));
    };

    return (
        <>
            {/* Edit package modal */}
            <Transition appear show={modal22} as={Fragment}>
                <Dialog
                    as="div"
                    open={modal22}
                    onClose={() => {
                        setModal22(false);
                    }}
                >
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div id="register_modal" className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                        <div className="flex items-start justify-center min-h-screen px-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="panel border-0 py-1 px-4 rounded-lg overflow-hidden w-full max-w-sm my-8 text-black dark:text-white-dark">
                                    <div className="flex items-center justify-between p-5 font-semibold text-lg dark:text-white">
                                        <h6>Edit Package</h6>
                                    </div>
                                    <div className="p-5">
                                        <form>
                                            <div className="mb-4">
                                                <input
                                                    type="text"
                                                    placeholder={`${getSinglePackageData && getSinglePackageData.singlePackage.packageName}`}
                                                    value={packageName}
                                                    onChange={(e: any) => setPackageName(e.target.value)}
                                                    className="form-input"
                                                    id="name"
                                                    required
                                                />
                                            </div>
                                            <div className="relative mb-4">
                                                <input
                                                    type="number"
                                                    placeholder={`${getSinglePackageData && getSinglePackageData.singlePackage.amount}`}
                                                    value={amount}
                                                    onChange={(e: any) => setAmount(e.target.value)}
                                                    className="form-input"
                                                    id="amount"
                                                    required
                                                />
                                            </div>
                                            <div className="relative mb-4">
                                                <input
                                                    type="number"
                                                    placeholder={`${getSinglePackageData && getSinglePackageData.singlePackage.memberProfit}`}
                                                    value={memberProfit}
                                                    onChange={(e: any) => setMemberProfit(e.target.value)}
                                                    className="form-input"
                                                    id="memberProfit"
                                                />
                                            </div>
                                            <button type="button" onClick={submitEditHandler} className="btn btn-primary w-full">
                                                Submit
                                            </button>
                                        </form>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            {/* Edit package modal */}
        </>
    );
};

export default EditPackagePopup;
