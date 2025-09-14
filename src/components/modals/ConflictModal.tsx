import React from "react";
import Modal from "../ui/Modal";
import { AlertTriangle, RotateCcw, X, Check } from "lucide-react";
import "./ConflictModal.css";

interface ConflictModalProps {
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    onSuggestAlternative?: () => void;
    hasAlternative?: boolean;
    confirmButtonText?: string;
}

const ConflictModal: React.FC<ConflictModalProps> = ({
    isOpen,
    message,
    onConfirm,
    onCancel,
    onSuggestAlternative,
    hasAlternative = false,
    confirmButtonText = "Add Anyway",
}) => {
    const footer = (
        <>
            {hasAlternative && onSuggestAlternative && (
                <button
                    className="btn btn-secondary"
                    onClick={onSuggestAlternative}
                >
                    <RotateCcw size={16} className="icon-left" />
                    Suggest Alternative Time
                </button>
            )}
            <button className="btn btn-secondary" onClick={onCancel}>
                <X size={16} className="icon-left" />
                Cancel
            </button>
            <button className="btn btn-primary" onClick={onConfirm}>
                <Check size={16} className="icon-left" />
                {confirmButtonText}
            </button>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onCancel}
            title="Schedule Conflict"
            size="small"
            footer={footer}
            closeOnOverlayClick={false}
        >
            <div className="conflict-content">
                <div className="conflict-icon">
                    <AlertTriangle size={48} color="#f39c12" />
                </div>
                <pre className="conflict-message">{message}</pre>
            </div>
        </Modal>
    );
};

export default ConflictModal;
