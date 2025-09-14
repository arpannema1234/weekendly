import React from "react";
import { X } from "lucide-react";
import "./ConfirmationDialog.css";

interface ConfirmationDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    dangerous?: boolean;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = "OK",
    cancelText = "Cancel",
    dangerous = false,
}) => {
    if (!isOpen) return null;

    return (
        <div className="confirmation-dialog-overlay">
            <div className="confirmation-dialog">
                <div className="dialog-header">
                    <h3>{title}</h3>
                    <button
                        className="close-button"
                        onClick={onCancel}
                        aria-label="Close dialog"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="dialog-content">
                    <p>{message}</p>
                </div>

                <div className="dialog-actions">
                    <button className="cancel-button" onClick={onCancel}>
                        {cancelText}
                    </button>
                    <button
                        className={`confirm-button ${
                            dangerous ? "dangerous" : ""
                        }`}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationDialog;
