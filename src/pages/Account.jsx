import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Assuming an api helper for authenticated requests
import './Account.css'; // We'll create this for styling in the next step

const Account = ({ onLogout }) => {
    const [currentUser, setCurrentUser] = useState({ username: '' });
    const [formData, setFormData] = useState({ username: '' });
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const [notification, setNotification] = useState({ message: '', type: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get('/users/me');
                setCurrentUser(response.data);
                setFormData(response.data);
            } catch (error) {
                console.error("Gagal mengambil data pengguna:", error);
                console.error("Detail kesalahan:", error.response || error.message); // Log response for more details
                if (error.response && error.response.status === 401) {
                    setNotification({ message: 'Sesi Anda telah berakhir. Silakan masuk kembali.', type: 'error' });
                    setTimeout(() => {
                        onLogout();
                        navigate('/login');
                    }, 2000);
                } else {
                    setNotification({ message: 'Gagal memuat data pengguna.', type: 'error' });
                }
            }
        };
        fetchUser();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setNotification({ message: '', type: '' });

        const trimmedUsername = formData.username.trim();

        if (!trimmedUsername) {
            setNotification({ message: 'Nama pengguna tidak boleh kosong.', type: 'error' });
            return;
        }

        // Jika username tidak berubah, tidak perlu memperbarui
        if (trimmedUsername === currentUser.username) {
            setNotification({ message: 'Tidak ada perubahan untuk diperbarui.', type: 'info' });
            return;
        }

        // Buat payload hanya dengan username yang diperbarui
        const payload = { username: trimmedUsername };

        try {
            await api.put('/users/me', payload);
            setNotification({ message: 'Akun berhasil diperbarui! Silakan masuk kembali dengan detail baru Anda.', type: 'success' });
            
            // Paksa logout untuk otentikasi ulang dengan detail baru, terutama jika nama pengguna berubah
            setTimeout(() => {
                onLogout();
                navigate('/login');
            }, 3000);

        } catch (error) {
            const errorMessage = error.response?.data?.detail || 'Terjadi kesalahan saat memperbarui.';
            setNotification({ message: errorMessage, type: 'error' });
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Apakah Anda yakin ingin menghapus akun Anda? Tindakan ini tidak dapat diubah dan akan menghapus semua data Anda.')) {
            try {
                await api.delete('/users/me');
                setNotification({ message: 'Akun berhasil dihapus.', type: 'success' });
                
                // Paksa logout dan arahkan ke beranda
                setTimeout(() => {
                    onLogout();
                    navigate('/');
                }, 2000);

            } catch (error) {
                const errorMessage = error.response?.data?.detail || 'Gagal menghapus akun.';
                setNotification({ message: errorMessage, type: 'error' });
            }
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setNotification({ message: '', type: '' });

        const { currentPassword, newPassword, confirmNewPassword } = passwordForm;

        if (!currentPassword || !newPassword || !confirmNewPassword) {
            setNotification({ message: 'Semua bidang kata sandi harus diisi.', type: 'error' });
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setNotification({ message: 'Kata sandi baru dan konfirmasi kata sandi tidak cocok.', type: 'error' });
            return;
        }

        if (newPassword.length < 6) { // Example: minimum password length
            setNotification({ message: 'Kata sandi baru harus minimal 6 karakter.', type: 'error' });
            return;
        }

        try {
            // Assuming a separate endpoint for password change, e.g., /users/me/password or /auth/change-password
            await api.put('/users/me/password', {
                current_password: currentPassword,
                new_password: newPassword
            });
            setNotification({ message: 'Kata sandi berhasil diperbarui! Silakan masuk kembali dengan kata sandi baru Anda.', type: 'success' });
            
            // Clear password fields
            setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });

            // Force logout for re-authentication with new password
            setTimeout(() => {
                onLogout();
                navigate('/login');
            }, 3000);

        } catch (error) {
            const errorMessage = error.response?.data?.detail || 'Terjadi kesalahan saat memperbarui kata sandi.';
            setNotification({ message: errorMessage, type: 'error' });
        }
    };

    return (
        <div className="account-container">
            <button onClick={() => navigate('/')} className="btn-back">Kembali ke Beranda</button>
            <h2>Manajemen Akun</h2>
            
            {notification.message && (
                <div className={`notification ${notification.type}`}>
                    {notification.message}
                </div>
            )}

            <div className="account-section">
                <h3>Perbarui Detail Anda</h3>
                <form onSubmit={handleUpdate}>
                    <div className="form-group">
                        <label htmlFor="username">Nama Pengguna</label>
                        <input type="text" id="username" name="username" value={formData.username} onChange={handleInputChange} required />
                    </div>
                    <button type="submit" className="btn-update">Perbarui Detail</button>
                </form>
            </div>

            <div className="account-section">
                <h3>Perbarui Kata Sandi</h3>
                <form onSubmit={handlePasswordUpdate}>
                    <div className="form-group">
                        <label htmlFor="currentPassword">Kata Sandi Saat Ini</label>
                        <input type="password" id="currentPassword" name="currentPassword" value={passwordForm.currentPassword} onChange={handlePasswordChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newPassword">Kata Sandi Baru</label>
                        <input type="password" id="newPassword" name="newPassword" value={passwordForm.newPassword} onChange={handlePasswordChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmNewPassword">Konfirmasi Kata Sandi Baru</label>
                        <input type="password" id="confirmNewPassword" name="confirmNewPassword" value={passwordForm.confirmNewPassword} onChange={handlePasswordChange} required />
                    </div>
                    <button type="submit" className="btn-update">Perbarui Kata Sandi</button>
                </form>
            </div>

            <div className="account-section danger-zone">
                <h3>Zona Bahaya</h3>
                <p>Menghapus akun Anda akan secara permanen menghapus semua data Anda, termasuk riwayat prediksi Anda.</p>
                <button onClick={handleDelete} className="btn-delete">Hapus Akun Saya</button>
            </div>
        </div>
    );
};

export default Account;
