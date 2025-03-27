import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Add useNavigate
import { useSelector } from 'react-redux';
import { useGetEmployeeQuery } from '../../slices/employeeSlice';
import { useGetOrganisationByIdQuery } from '../../slices/organizationSlice';
import { useMakeStkPushRequestMutation } from '../../slices/subscriptionApiSlice';

const Subscribe = () => {
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [subscriptionDetails, setSubscriptionDetails] = useState(null); // Store subscription details

    // Get user and organization info
    const { userInfo } = useSelector((state) => state.auth);
    const { data: employee } = useGetEmployeeQuery(userInfo?.id);
    const organisationId = employee?.data?.employee?.organisationId;
    const { data: organisation } = useGetOrganisationByIdQuery(organisationId);

    // Navigation hook
    const navigate = useNavigate();

    // Get the mutation hook
    const [makeStkPushRequest, { isLoading }] = useMakeStkPushRequestMutation();

    const handlePayment = async () => {
        try {
            setError(null);
            const payload = {
                phoneNumber: organisation?.data?.organisation?.mpesaPhone,
                amount: 1,
            };

            const result = await makeStkPushRequest({ organisationId, payload }).unwrap();
            console.log(result, "results");
            setSuccess(true);
            setSubscriptionDetails(result.subscription); // Store subscription details from backend
        } catch (err) {
            setError(err?.data?.message || err.error || 'An error occurred during payment');
        }
    };

    // Redirect based on role
    const handleRedirect = () => {
        const role = userInfo?.role; // Assuming role is in userInfo from Redux
        if (!role) {
            console.error('Role is undefined or null');
            return;
        }
        switch (role.toLowerCase()) {
            case 'admin':
                navigate('/admin');
                break;
            case 'manager':
                navigate('/manager');
                break;
            case 'employee':
                navigate('/employee');
                break;
            default:
                console.error('Invalid role:', role);
        }

        // TODO: Send email with subscription details
        console.log('TODO: Send email with subscription details:', subscriptionDetails);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Subscribe to Continue
                    </h2>

                    <div className="mb-6">
                        <p className="text-gray-600">
                            Get full access to all features with our monthly subscription
                        </p>
                    </div>

                    <div className="border rounded-lg p-8 hover:shadow-md transition-shadow mb-8">
                        <div className="flex items-center justify-center mb-4">
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                                Best Value
                            </span>
                        </div>

                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            Full Support Plan
                        </h3>

                        <p className="text-4xl font-bold text-gray-900 mb-4">
                            KES 5,000
                            <span className="text-sm text-gray-600">/month</span>
                        </p>

                        <ul className="text-left mb-6 space-y-2">
                            <li className="flex items-center">
                                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                Full Access to All Features
                            </li>
                            <li className="flex items-center">
                                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                Priority Support
                            </li>
                            <li className="flex items-center">
                                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                Unlimited Users
                            </li>
                        </ul>

                        <button
                            onClick={handlePayment}
                            disabled={isLoading || success}
                            className={`w-full py-3 px-4 rounded-lg transition-colors ${isLoading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : success
                                    ? 'bg-green-600 hover:bg-green-700'
                                    : 'bg-blue-600 hover:bg-blue-700'
                                } text-white font-semibold`}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                                    Processing...
                                </div>
                            ) : success ? (
                                'Payment Successful!'
                            ) : (
                                'Pay with M-Pesa'
                            )}
                        </button>

                        {error && (
                            <div className="mt-4 text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        {success && subscriptionDetails && (
                            <div className="mt-4 text-green-600 text-sm">
                                <p>
                                    Payment processed successfully! Your subscription is active and will expire on{' '}
                                    <strong>{new Date(subscriptionDetails.endDate).toLocaleDateString()}</strong>.
                                    You will receive an M-Pesa message shortly.
                                </p>
                                <button
                                    onClick={handleRedirect}
                                    className="mt-4 w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    OK
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="text-sm text-gray-600">
                        <p>Payment processed securely through M-Pesa</p>
                        <p className="mt-2">
                            Need help? Contact support at{' '}
                            <a href="mailto:support@example.com" className="text-blue-600 hover:text-blue-800">
                                support@example.com
                            </a>
                        </p>
                    </div>

                    <Link
                        to="/"
                        className="inline-block mt-6 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        Return to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Subscribe;