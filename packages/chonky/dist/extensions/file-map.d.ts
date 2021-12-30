/**
 *
 */
/// <reference types="react" />
import { FileActionData } from '../types/action-handler.types';
import { FileAction } from '../types/action.types';
import { FileArray, FileData } from '../types/file.types';
export interface CustomFileData extends FileData {
    parentId?: string;
    childrenIds?: string[];
}
export interface CustomFileMap<FT extends CustomFileData> {
    [fileId: string]: FT;
}
export interface FileMapParams<FT extends CustomFileData> {
    baseFileMap: CustomFileMap<FT>;
    initialFolderId: string;
}
export declare const useFolderChain: <FT extends CustomFileData>(fileMap: CustomFileMap<FT>, currentFolderId: string) => FileArray<FT>;
export declare const useFiles: <FT extends CustomFileData>(fileMap: CustomFileMap<FT>, currentFolderId: string) => FileArray<FT>;
export declare const useFileMapMethods: <FT extends CustomFileData>(baseFileMap: CustomFileMap<FT>, initialFolderId: string) => {
    fileMap: CustomFileMap<FT>;
    currentFolderId: string;
    methods: {
        setFileMap: import("react").Dispatch<import("react").SetStateAction<CustomFileMap<FT>>>;
        setCurrentFolderId: import("react").Dispatch<import("react").SetStateAction<string>>;
        resetFileMap: () => void;
        moveFiles: (files: FT[], source: FT, destination: FT) => void;
    };
};
export declare type FileMethods = ReturnType<typeof useFileMapMethods>['methods'];
export declare const useFileActionHandler: (methods: FileMethods) => (data: FileActionData<FileAction>) => void;
export declare const useFileMap: <FT extends CustomFileData = CustomFileData>({ baseFileMap, initialFolderId, }: FileMapParams<FT>) => {
    data: {
        fileMap: CustomFileMap<FT>;
        currentFolderId: string;
        folderChain: FileArray<FT>;
        files: FileArray<FT>;
    };
    methods: {
        setFileMap: import("react").Dispatch<import("react").SetStateAction<CustomFileMap<FT>>>;
        setCurrentFolderId: import("react").Dispatch<import("react").SetStateAction<string>>;
        resetFileMap: () => void;
        moveFiles: (files: FT[], source: FT, destination: FT) => void;
    };
    fileActionHandler: (data: FileActionData<FileAction>) => void;
};
