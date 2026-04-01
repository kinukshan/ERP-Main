import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

const Alert = ({ type, message, onClose }) => {
    if (!message) return null;

    const isError = type === 'error';
    const bgColor = isError ? 'bg-red-50' : 'bg-green-50';
    const textColor = isError ? 'text-red-800' : 'text-green-800';
    const borderColor = isError ? 'border-red-200' : 'border-green-200';
    const Icon = isError ? AlertCircle : CheckCircle;

    return (
        <div className={`flex items-center justify-between p-4 mb-4 border rounded-lg ${bgColor} ${textColor} ${borderColor}`}>
            <div className="flex items-center gap-3">
                <Icon className="h-5 w-5" />
                <span className="font-medium text-sm">{message}</span>
            </div>
            {onClose && (
                <button onClick={onClose} className={`hover:opacity-75 font-bold ${textColor}`}>
                    ✕
                </button>
            )}
        </div>
    );
};

export default Alert;
