import React from "react";
// @ts-ignore
import { DndProvider as ReactDndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface DragDropProviderProps {
    children: React.ReactNode;
}

const DragDropProvider: React.FC<DragDropProviderProps> = ({ children }) => {
    return (
        <ReactDndProvider backend={HTML5Backend}>{children}</ReactDndProvider>
    );
};

export default DragDropProvider;
