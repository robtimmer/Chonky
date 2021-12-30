import React, { UIEvent } from 'react';
export interface FileListProps {
    onScroll?: (e: UIEvent<HTMLDivElement>) => void;
}
export declare const FileList: React.FC<FileListProps>;
