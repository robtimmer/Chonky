import { Nilable, Nullable } from 'tsdef';
import { PayloadAction } from '@reduxjs/toolkit';
import { GenericFileActionHandler } from '../types/action-handler.types';
import { FileActionMenuItem } from '../types/action-menus.types';
import { FileAction } from '../types/action.types';
import { ContextMenuConfig } from '../types/context-menu.types';
import { FileViewConfig } from '../types/file-view.types';
import { FileArray, FileIdTrueMap } from '../types/file.types';
import { OptionMap } from '../types/options.types';
import { RootState } from '../types/redux.types';
import { SortOrder } from '../types/sort.types';
import { ThumbnailGenerator } from '../types/thumbnails.types';
export declare const reduxActions: import("@reduxjs/toolkit").CaseReducerActions<{
    setExternalFileActionHandler(state: RootState, action: PayloadAction<Nilable<GenericFileActionHandler<FileAction>>>): void;
    setRawFileActions(state: RootState, action: PayloadAction<FileAction[] | any>): void;
    setFileActionsErrorMessages(state: RootState, action: PayloadAction<string[]>): void;
    setFileActions(state: RootState, action: PayloadAction<FileAction[]>): void;
    updateFileActionMenuItems(state: RootState, action: PayloadAction<[FileActionMenuItem[], FileActionMenuItem[]]>): void;
    setRawFolderChain(state: RootState, action: PayloadAction<FileArray | any>): void;
    setRawFiles(state: RootState, action: PayloadAction<FileArray | any>): void;
    setSortedFileIds(state: RootState, action: PayloadAction<Nullable<string>[]>): void;
    setHiddenFileIds(state: RootState, action: PayloadAction<FileIdTrueMap>): void;
    setFocusSearchInput(state: RootState, action: PayloadAction<Nullable<() => void>>): void;
    setSearchString(state: RootState, action: PayloadAction<string>): void;
    selectAllFiles(state: RootState): void;
    selectFiles(state: RootState, action: PayloadAction<{
        fileIds: string[];
        reset: boolean;
    }>): void;
    toggleSelection(state: RootState, action: PayloadAction<{
        fileId: string;
        exclusive: boolean;
    }>): void;
    clearSelection(state: RootState): void;
    setSelectionDisabled(state: RootState, action: PayloadAction<boolean>): void;
    setFileViewConfig(state: RootState, action: PayloadAction<FileViewConfig>): void;
    setSort(state: RootState, action: PayloadAction<{
        actionId: string;
        order: SortOrder;
    }>): void;
    setOptionDefaults(state: RootState, action: PayloadAction<OptionMap>): void;
    toggleOption(state: RootState, action: PayloadAction<string>): void;
    setThumbnailGenerator(state: RootState, action: PayloadAction<Nullable<ThumbnailGenerator>>): void;
    setDoubleClickDelay(state: RootState, action: PayloadAction<number>): void;
    setDisableDragAndDrop(state: RootState, action: PayloadAction<boolean>): void;
    setClearSelectionOnOutsideClick(state: RootState, action: PayloadAction<boolean>): void;
    setLastClickIndex(state: RootState, action: PayloadAction<Nullable<{
        index: number;
        fileId: string;
    }>>): void;
    setContextMenuMounted(state: RootState, action: PayloadAction<boolean>): void;
    showContextMenu(state: RootState, action: PayloadAction<ContextMenuConfig>): void;
    hideContextMenu(state: RootState): void;
}>, rootReducer: import("redux").Reducer<RootState, import("redux").AnyAction>;
