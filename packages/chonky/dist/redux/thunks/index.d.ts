import { ChonkyThunk } from '../../types/redux.types';
export declare const reduxThunks: {
    selectRange: (params: {
        rangeStart: number;
        rangeEnd: number;
        reset?: boolean;
    }) => ChonkyThunk;
};
