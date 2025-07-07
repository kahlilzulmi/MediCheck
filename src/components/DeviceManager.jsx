import React, { useState } from 'react';
import api from '../services/api';
import { useUser } from '../context/UserContext';

const DeviceManager = () => {
    const { user, loading, error: userError, fetchUser, registerDevice, unregisterDevice } = useUser();
    const [isScanning, setIsScanning] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isUnregistering, setIsUnregistering] = useState(false);
    const [devices, setDevices] = useState([]);
    const [error, setError] = useState('');

    const handleScan = async () => {
        setIsScanning(true);
        setError('');
        setDevices([]);
        try {
            const response = await api.get('/device/scan');
            setDevices(response.data);
            if (response.data.length === 0) {
                setError('No devices found. Make sure your device is on and discoverable.');
            }
        } catch (err) {
            setError('Failed to scan for devices. Please try again.');
        } finally {
            setIsScanning(false);
        }
    };

    const handleRegister = async (address) => {
        const deviceToRegister = devices.find(d => d.address === address);
        if (!deviceToRegister) {
            setError("Could not find device details to register.");
            return;
        }
        setIsRegistering(true);
        setError('');
        try {
            await registerDevice(deviceToRegister.address, deviceToRegister.name);
            setDevices([]);
        } catch (err) {
            const errorMessage = err.response?.data?.detail || 'Failed to register the device. Please try again.';
            setError(errorMessage);
        } finally {
            setIsRegistering(false);
        }
    };

    const handleUnregister = async () => {
        setIsUnregistering(true);
        setError('');
        try {
            await unregisterDevice();
        } catch (err) {
            const errorMessage = err.response?.data?.detail || 'Failed to unregister the device. Please try again.';
            setError(errorMessage);
        } finally {
            setIsUnregistering(false);
        }
    };

    if (loading) {
        return <div className="text-center p-4">Loading user information...</div>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Manajemen Perangkat</h2>
            {(error || userError) && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{error || userError}</span>
                </div>
            )}
            {user && (user.registered_device || user.device_address) ? (
                <div className="p-4 border rounded-lg bg-gray-50 text-center">
                    <p className="text-gray-600">Perangkat Terpasang:</p>
                    {user.registered_device?.name && (
                        <p className="text-xl font-bold">{user.registered_device.name}</p>
                    )}
                    <p className="font-mono text-lg text-gray-800">{user.registered_device?.address || user.device_address}</p>
                    <button
                        onClick={handleUnregister}
                        disabled={isUnregistering}
                        className="mt-4 w-full bg-red-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-700 transition disabled:bg-gray-400"
                    >
                        {isUnregistering ? 'Melupakan...' : 'Melupakan perangkat...'}
                    </button>
                </div>
            ) : (
                <div className="p-4 border rounded-lg bg-gray-50 text-center">
                    <p className="mb-4">Tiada perangkat terpasang.</p>
                    <button 
                        onClick={handleScan} 
                        disabled={isScanning}
                        className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
                    >
                        {isScanning ? 'Memindai...' : 'Pindai Perangkat Baru'}
                    </button>
                </div>
            )}
            {devices.length > 0 && (
                <div className="mt-6">
                    <h4 className="text-lg font-semibold mb-2">Perangkat Tersedia:</h4>
                    <ul className="space-y-2">
                        {devices.map((device) => (
                            <li key={device.address} className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                    <p className="font-semibold">{device.name || 'Perangkat Tidak Dikenal'}</p>
                                    <p className="text-sm text-gray-500 font-mono">{device.address}</p>
                                </div>
                                <button
                                    onClick={() => handleRegister(device.address)}
                                    disabled={isRegistering}
                                    className="bg-green-600 text-white font-semibold py-1 px-3 rounded-md hover:bg-green-700 transition disabled:bg-gray-400 text-sm"
                                >
                                    {isRegistering ? 'Memasangkan...' : 'Pasang'}
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
