import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const PasswordInput = ({ 
    id, 
    name, 
    value, 
    onChange, 
    placeholder, 
    required = false,
    className = '',
    showStrengthIndicator = false 
}) => {
    const { isDark } = useTheme();
    const [showPassword, setShowPassword] = useState(false);

    // Fungsi untuk menghitung kekuatan password
    const calculatePasswordStrength = (password) => {
        if (!password) return 0;
        
        let strength = 0;
        
        // Panjang password
        if (password.length >= 8) strength += 1;
        if (password.length >= 12) strength += 1;
        
        // Kompleksitas
        if (/[A-Z]/.test(password)) strength += 1; // Huruf besar
        if (/[a-z]/.test(password)) strength += 1; // Huruf kecil
        if (/[0-9]/.test(password)) strength += 1; // Angka
        if (/[^A-Za-z0-9]/.test(password)) strength += 1; // Karakter khusus
        
        return strength;
    };

    const getStrengthLabel = (strength) => {
        if (strength <= 2) return { text: 'Lemah', color: 'red' };
        if (strength <= 4) return { text: 'Sedang', color: 'yellow' };
        return { text: 'Kuat', color: 'green' };
    };

    const strength = calculatePasswordStrength(value);
    const strengthInfo = getStrengthLabel(strength);

    return (
        <div className="relative">
            <input
                id={id}
                name={name}
                type={showPassword ? "text" : "password"}
                required={required}
                value={value}
                onChange={onChange}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                    isDark 
                        ? 'border-dark-border bg-dark-bg-primary text-dark-text-primary placeholder-dark-text-secondary' 
                        : 'border-gray-300 placeholder-gray-500 text-gray-900'
                } ${className} focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder={placeholder}
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                    isDark ? 'text-dark-text-secondary hover:text-dark-text-primary' : 'text-gray-500 hover:text-gray-700'
                }`}
            >
                {showPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                )}
            </button>
            
            {showStrengthIndicator && value && (
                <div className="mt-2">
                    <div className="flex items-center">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                                className={`h-full rounded-full transition-all duration-300 ${
                                    strengthInfo.color === 'red' ? 'bg-red-500' :
                                    strengthInfo.color === 'yellow' ? 'bg-yellow-500' :
                                    'bg-green-500'
                                }`}
                                style={{ width: `${(strength / 6) * 100}%` }}
                            />
                        </div>
                        <span className={`ml-2 text-sm ${
                            strengthInfo.color === 'red' ? 'text-red-500' :
                            strengthInfo.color === 'yellow' ? 'text-yellow-500' :
                            'text-green-500'
                        }`}>
                            {strengthInfo.text}
                        </span>
                    </div>
                    <p className={`mt-1 text-xs ${isDark ? 'text-dark-text-secondary' : 'text-gray-500'}`}>
                        {strength <= 2 && "Tambahkan huruf besar, angka, dan karakter khusus untuk meningkatkan keamanan"}
                        {strength > 2 && strength <= 4 && "Tambahkan lebih banyak karakter dan variasi untuk password yang lebih kuat"}
                        {strength > 4 && "Password Anda cukup kuat"}
                    </p>
                </div>
            )}
        </div>
    );
};

export default PasswordInput; 