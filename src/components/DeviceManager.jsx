import React, { useState, useEffect } from 'react';
import api from '../services/api'; // Assuming you have a central API service

const DeviceManager = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isScanning, setIsScanning] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isUnregistering, setIsUnregistering] = useState(false);
    const [devices, setDevices] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setIsLoading(true);
                // This function assumes your api service attaches the auth token
                const response = await api.get('/users/me');
                setUser(response.data);
                setError('');
            } catch (err) {
                setError('Failed to fetch user data. Please try logging in again.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, []); // The empty dependency array ensures this runs only once on mount

    const handleScan = async () => {
        setIsScanning(true);
        setError('');
        setDevices([]);
        try {
            const response = await api.get('/device/scan');
            console.log("Scan API response data:", response.data); // Log scan response
            setDevices(response.data);
            if (response.data.length === 0) {
                setError('No devices found. Make sure your device is on and discoverable.');
            }
        } catch (err) {
            setError('Failed to scan for devices. Please try again.');
            console.error(err);
        } finally {
            setIsScanning(false);
        }
    };

    const handleRegister = async (address) => {
        console.log("Attempting to register device with address:", address); // Log address
        console.log("Current devices state:", devices); // Log current devices state
        // Find the full device object from the list to get its name
        const deviceToRegister = devices.find(d => d.address === address);
        console.log("Device found for registration:", deviceToRegister); // Log found device
        if (!deviceToRegister) {
            setError("Could not find device details to register.");
            return;
        }

        setIsRegistering(true);
        setError('');
        try {
            // Send both address and name to the backend
            const response = await api.post('/device/register', {
                address: deviceToRegister.address,
                name: deviceToRegister.name
            });
            // Update user state with the new registered_device object
            setUser(prevUser => ({ ...prevUser, registered_device: response.data.registered_device }));
            // Clear the device list now that registration is complete
            setDevices([]);
        } catch (err) {
            const errorMessage = err.response?.data?.detail || 'Failed to register the device. Please try again.';
            setError(errorMessage);
            console.error(err);
        } finally {
            setIsRegistering(false);
        }
    };

    const handleUnregister = async () => {
        setIsUnregistering(true);
        setError('');
        try {
            await api.delete('/device/unregister');
            // Update user state by creating a new user object without the device properties
            setUser(prevUser => {
                const { registered_device, device_address, ...rest } = prevUser;
                return rest;
            });
        } catch (err) {
            const errorMessage = err.response?.data?.detail || 'Failed to unregister the device. Please try again.';
            setError(errorMessage);
            console.error(err);
        } finally {
            setIsUnregistering(false);
        }
    };

    if (isLoading) {
        return <div className="text-center p-4">Loading user information...</div>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Device Management</h2>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {/* Check for the new `registered_device` object, with a fallback to the old `device_address` */}
            {user && (user.registered_device || user.device_address) ? (
                <div className="p-4 border rounded-lg bg-gray-50 text-center">
                    <p className="text-gray-600">Registered Device:</p>
                    {/* Display name if available */}
                    {user.registered_device?.name && (
                        <p className="text-xl font-bold">{user.registered_device.name}</p>
                    )}
                    <p className="font-mono text-lg text-gray-800">{user.registered_device?.address || user.device_address}</p>
                    <button
                        onClick={handleUnregister}
                        disabled={isUnregistering}
                        className="mt-4 w-full bg-red-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-700 transition disabled:bg-gray-400"
                    >
                        {isUnregistering ? 'Unregistering...' : 'Unregister Device'}
                    </button>
                </div>
            ) : (
                <div className="p-4 border rounded-lg bg-gray-50 text-center">
                    <p className="mb-4">No device is registered.</p>
                    <button 
                        onClick={handleScan} 
                        disabled={isScanning}
                        className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
                    >
                        {isScanning ? 'Scanning...' : 'Scan for New Devices'}
                    </button>
                </div>
            )}

            {devices.length > 0 && (
                <div className="mt-6">
                    <h4 className="text-lg font-semibold mb-2">Available Devices:</h4>
                    <ul className="space-y-2">
                        {devices.map((device) => (
                            <li key={device.address} className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                    <p className="font-semibold">{device.name || 'Unknown Device'}</p>
                                    <p className="text-sm text-gray-500 font-mono">{device.address}</p>
                                </div>
                                <button
                                    onClick={() => handleRegister(device.address)}
                                    disabled={isRegistering}
                                    className="bg-green-600 text-white font-semibold py-1 px-3 rounded-md hover:bg-green-700 transition disabled:bg-gray-400 text-sm"
                                >
                                    {isRegistering ? 'Registering...' : 'Register'}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DeviceManager;
