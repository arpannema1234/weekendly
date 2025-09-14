import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import "./Modal.css";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: "small" | "medium" | "large";
    showCloseButton?: boolean;
    closeOnOverlayClick?: boolean;
    footer?: React.ReactNode;
    className?: string;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    size = "medium",
    showCloseButton = true,
    closeOnOverlayClick = true,
    footer,
    className = "",
}) => {
    const modalRef = useRef<HTMLDivElement>(null);

    // Handle escape key press
    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === "Escape" && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscapeKey);
            document.body.style.overflow = "hidden"; // Prevent background scroll
        }

        return () => {
            document.removeEventListener("keydown", handleEscapeKey);
            document.body.style.overflow = ""; // Restore scroll
        };
    }, [isOpen, onClose]);

    // Focus management for accessibility
    useEffect(() => {
        if (isOpen && modalRef.current) {
            modalRef.current.focus();
        }
    }, [isOpen]);

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="modal-overlay"
            onClick={handleOverlayClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
        >
            <div
                ref={modalRef}
                className={`modal-content modal-${size} ${className}`}
                onClick={(e) => e.stopPropagation()}
                tabIndex={-1}
            >
                {(title || showCloseButton) && (
                    <div className="modal-header">
                        {title && (
                            <h2 id="modal-title" className="modal-title">
                                {title}
                            </h2>
                        )}
                        {showCloseButton && (
                            <button
                                className="modal-close-button"
                                onClick={onClose}
                                aria-label="Close modal"
                                type="button"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                )}

                <div className="modal-body">{children}</div>

                {footer && <div className="modal-footer">{footer}</div>}
            </div>
        </div>
    );
};

export default Modal;
