import { createMuiTheme, ThemeProvider as ThemeProvider$1 } from '@material-ui/core/styles';
import merge from 'deepmerge';
import React, { useRef, useState, useEffect, useCallback, createContext, useMemo, useContext, useImperativeHandle } from 'react';
import { DndContext, useDrop, useDrag, useDragLayer, DndProvider } from 'react-dnd';
import { HTML5Backend, getEmptyImage } from 'react-dnd-html5-backend';
import { useIntl, IntlProvider } from 'react-intl';
import { createUseStyles, ThemeProvider } from 'react-jss';
import { useSelector, useDispatch, useStore, Provider } from 'react-redux';
import shortid from 'shortid';
import { createSelector, createSlice, configureStore } from '@reduxjs/toolkit';
import sort from 'fast-sort';
import FuzzySearch from 'fuzzy-search';
import watch from 'redux-watch';
import filesize from 'filesize';
import ExactTrie from 'exact-trie';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import classnames from 'classnames';
import Box from '@material-ui/core/Box';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import hotkeys from 'hotkeys-js';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import AutoSizer from 'react-virtualized-auto-sizer';
import { VariableSizeGrid, FixedSizeList } from 'react-window';
import ListSubheader from '@material-ui/core/ListSubheader';

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it) return (it = it.call(o)).next.bind(it);

  if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
    if (it) o = it;
    var i = 0;
    return function () {
      if (i >= o.length) return {
        done: true
      };
      return {
        done: false,
        value: o[i++]
      };
    };
  }

  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var useDebounce = function useDebounce(value, delay) {
  var _useState = useState(value),
      debouncedValue = _useState[0],
      setDebouncedValue = _useState[1];

  useEffect(function () {
    var handler = setTimeout(function () {
      setDebouncedValue(value);
    }, delay);
    return function () {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return [debouncedValue, setDebouncedValue];
};
var UNINITIALIZED_SENTINEL = {};
var useStaticValue = function useStaticValue(factory) {
  var valueRef = useRef(UNINITIALIZED_SENTINEL);
  if (valueRef.current === UNINITIALIZED_SENTINEL) valueRef.current = factory();
  return valueRef.current;
};
var useInstanceVariable = function useInstanceVariable(value) {
  var ref = useRef(value);
  useEffect(function () {
    ref.current = value;
  }, [ref, value]);
  return ref;
};

var Logger = /*#__PURE__*/function () {
  function Logger() {}

  Logger.error = function error() {
    var _console;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    // eslint-disable-next-line no-console
    (_console = console).error.apply(_console, ['[Chonky runtime error]'].concat(args));
  };

  Logger.warn = function warn() {
    var _console2;

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    // eslint-disable-next-line no-console
    (_console2 = console).warn.apply(_console2, ['[Chonky runtime warning]'].concat(args));
  };

  Logger.debug = function debug() {
    var _console3;

    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    // eslint-disable-next-line no-console
    (_console3 = console).debug.apply(_console3, ['[Chonky runtime debug]'].concat(args));
  };

  Logger.formatBullets = function formatBullets(bullets) {
    return "\n- " + bullets.join('\n- ');
  };

  return Logger;
}();

var FileHelper = /*#__PURE__*/function () {
  function FileHelper() {}

  FileHelper.isDirectory = function isDirectory(file) {
    // Not a directory by default
    return !!file && file.isDir === true;
  };

  FileHelper.isHidden = function isHidden(file) {
    // Not hidden by default
    return !!file && file.isHidden === true;
  };

  FileHelper.isSymlink = function isSymlink(file) {
    // Not a symlink by default
    return !!file && file.isSymlink === true;
  };

  FileHelper.isEncrypted = function isEncrypted(file) {
    // Not encrypted by default
    return !!file && file.isEncrypted === true;
  };

  FileHelper.isClickable = function isClickable(file) {
    // Clickable by default
    return !!file;
  };

  FileHelper.isOpenable = function isOpenable(file) {
    // Openable by default
    return !!file && file.openable !== false;
  };

  FileHelper.isSelectable = function isSelectable(file) {
    // Selectable by default
    return !!file && file.selectable !== false;
  };

  FileHelper.isDraggable = function isDraggable(file) {
    // File & folders are draggable by default, `null` is not
    return !!file && file.draggable !== false;
  };

  FileHelper.isDroppable = function isDroppable(file) {
    // Folders are droppable by default, files are not
    if (!file) return false;
    if (file.isDir && file.droppable !== false) return true;
    return file.droppable === true;
  };

  FileHelper.isDndOpenable = function isDndOpenable(file) {
    // Folders are DnD openable by default, files are not
    if (!FileHelper.isOpenable(file)) return false;
    if (file.isDir && file.dndOpenable !== false) return true;
    return file.dndOpenable === true;
  };

  FileHelper.getModDate = function getModDate(file) {
    if (!file || file.modDate === null || file.modDate === undefined) return null;
    return FileHelper.parseDate(file.modDate);
  };

  FileHelper.parseDate = function parseDate(maybeDate) {
    if (typeof maybeDate === 'string' || typeof maybeDate === 'number') {
      // We allow users to provide string and numerical representations of dates.
      try {
        return new Date(maybeDate);
      } catch (error) {
        Logger.error("Could not convert provided string/number into a date: " + error.message + " ", 'Invalid value:', maybeDate);
      }
    }

    if (maybeDate instanceof Date && !isNaN(maybeDate.getTime())) {
      // We only allow valid dates objects
      return maybeDate;
    } // If we have an invalid date representation, we just return null.


    Logger.warn('Unsupported date representation:', maybeDate);
    return null;
  };

  FileHelper.getChildrenCount = function getChildrenCount(file) {
    if (!file || typeof file.childrenCount !== 'number') return null;
    return file.childrenCount;
  };

  return FileHelper;
}();

var sanitizeInputArray = function sanitizeInputArray(mode, rawArray) {
  var sanitizedFiles = [];
  var errorMessages = [];

  if ((mode === 'folderChain' || mode === 'fileActions') && !rawArray) ; else if (!Array.isArray(rawArray)) {
    errorMessages.push("Expected \"" + mode + "\" prop to be an array, got \"" + typeof rawArray + "\" instead.");
  } else {
    var nonObjectFileCount = 0;
    var missingFieldFileCount = 0;
    var seenIds = new Set();
    var duplicateIds = new Set();

    for (var i = 0; i < rawArray.length; ++i) {
      var item = rawArray[i];

      if (!item) {
        if (mode === 'fileActions') nonObjectFileCount++;else sanitizedFiles.push(null);
      } else if (typeof item !== 'object') {
        nonObjectFileCount++;
      } else {
        if (!item.id || mode !== 'fileActions' && !item.name) {
          missingFieldFileCount++;
        } else if (seenIds.has(item.id)) {
          duplicateIds.add(item.id);
        } else {
          seenIds.add(item.id);
          sanitizedFiles.push(item);
        }
      }
    }

    if (nonObjectFileCount) {
      errorMessages.push("Detected " + nonObjectFileCount + " file(s) of invalid type. Remember " + "that \"files\" array should contain either objects or nulls.");
    }

    if (missingFieldFileCount) {
      errorMessages.push("Detected " + missingFieldFileCount + " file(s) that are missing the " + "required fields. Remember that file object should define an " + "\"id\" and a \"name\".");
    }

    if (duplicateIds.size > 0) {
      var repeatedIdsString = '"' + Array.from(duplicateIds).join('", "') + '"';
      errorMessages.push("Detected " + duplicateIds.size + " file IDs that are used multiple " + "times. Remember that each file should have a unique IDs. The " + ("following IDs were seen multiple times: " + repeatedIdsString));
    }
  }

  if (errorMessages.length > 0) {
    var errorMessageString = '\n- ' + errorMessages.join('\n- ');
    var arrayString;
    var itemString;

    if (mode === 'folderChain') {
      arrayString = 'folder chain';
      itemString = 'files';
    } else if (mode === 'fileActions') {
      arrayString = 'file actions';
      itemString = 'file actions';
    } else {
      // mode === 'files'
      arrayString = 'files';
      itemString = 'files';
    }

    Logger.error("Errors were detected when sanitizing the " + arrayString + " array. " + ("Offending " + itemString + " were removed from the array. Summary of ") + ("validation errors: " + errorMessageString));
  }

  return {
    sanitizedArray: sanitizedFiles,
    errorMessages: errorMessages
  };
};

/**
 * We have option IDs in a separate file to avoid circular deps...
 */
var OptionIds = {
  ShowHiddenFiles: 'show_hidden_files',
  ShowFoldersFirst: 'show_folders_first',
  DarkMode: 'dark_mode'
};

var SortOrder;

(function (SortOrder) {
  SortOrder["ASC"] = "asc";
  SortOrder["DESC"] = "desc";
})(SortOrder || (SortOrder = {}));

var selectInstanceId = function selectInstanceId(state) {
  return state.instanceId;
};
var selectExternalFileActionHandler = function selectExternalFileActionHandler(state) {
  return state.externalFileActionHandler;
};
var selectFileActionMap = function selectFileActionMap(state) {
  return state.fileActionMap;
};
var selectFileActionIds = function selectFileActionIds(state) {
  return state.fileActionIds;
};
var selectFileActionData = function selectFileActionData(fileActionId) {
  return function (state) {
    return selectFileActionMap(state)[fileActionId];
  };
};
var selectToolbarItems = function selectToolbarItems(state) {
  return state.toolbarItems;
};
var selectContextMenuItems = function selectContextMenuItems(state) {
  return state.contextMenuItems;
};
var selectFolderChain = function selectFolderChain(state) {
  return state.folderChain;
};
var selectCurrentFolder = function selectCurrentFolder(state) {
  var folderChain = selectFolderChain(state);
  var currentFolder = folderChain.length > 0 ? folderChain[folderChain.length - 1] : null;
  return currentFolder;
};
var selectParentFolder = function selectParentFolder(state) {
  var folderChain = selectFolderChain(state);
  var parentFolder = folderChain.length > 1 ? folderChain[folderChain.length - 2] : null;
  return parentFolder;
};
var selectFileMap = function selectFileMap(state) {
  return state.fileMap;
};
var selectCleanFileIds = function selectCleanFileIds(state) {
  return state.cleanFileIds;
};
var selectFileData = function selectFileData(fileId) {
  return function (state) {
    return fileId ? selectFileMap(state)[fileId] : null;
  };
};
var selectHiddenFileIdMap = function selectHiddenFileIdMap(state) {
  return state.hiddenFileIdMap;
};
var selectHiddenFileCount = function selectHiddenFileCount(state) {
  return Object.keys(selectHiddenFileIdMap(state)).length;
};
var selectFocusSearchInput = function selectFocusSearchInput(state) {
  return state.focusSearchInput;
};
var selectSearchString = function selectSearchString(state) {
  return state.searchString;
};
var selectSelectionMap = function selectSelectionMap(state) {
  return state.selectionMap;
};
var selectSelectedFileIds = function selectSelectedFileIds(state) {
  return Object.keys(selectSelectionMap(state));
};
var selectSelectionSize = function selectSelectionSize(state) {
  return selectSelectedFileIds(state).length;
};
var selectIsFileSelected = function selectIsFileSelected(fileId) {
  return function (state) {
    return !!fileId && !!selectSelectionMap(state)[fileId];
  };
};
var selectSelectedFiles = function selectSelectedFiles(state) {
  var fileMap = selectFileMap(state);
  return Object.keys(selectSelectionMap(state)).map(function (id) {
    return fileMap[id];
  });
};
var selectSelectedFilesForAction = function selectSelectedFilesForAction(fileActionId) {
  return function (state) {
    var fileActionMap = state.fileActionMap;
    var action = fileActionMap[fileActionId];
    if (!action || !action.requiresSelection) return undefined;
    return getSelectedFiles(state, action.fileFilter);
  };
};
var selectSelectedFilesForActionCount = function selectSelectedFilesForActionCount(fileActionId) {
  return function (state) {
    var _getSelectedFilesForA;

    return (_getSelectedFilesForA = getSelectedFilesForAction(state, fileActionId)) == null ? void 0 : _getSelectedFilesForA.length;
  };
};
var selectDisableSelection = function selectDisableSelection(state) {
  return state.disableSelection;
};
var selectFileViewConfig = function selectFileViewConfig(state) {
  return state.fileViewConfig;
};
var selectSortActionId = function selectSortActionId(state) {
  return state.sortActionId;
};
var selectSortOrder = function selectSortOrder(state) {
  return state.sortOrder;
};
var selectOptionMap = function selectOptionMap(state) {
  return state.optionMap;
};
var selectOptionValue = function selectOptionValue(optionId) {
  return function (state) {
    return selectOptionMap(state)[optionId];
  };
};
var selectThumbnailGenerator = function selectThumbnailGenerator(state) {
  return state.thumbnailGenerator;
};
var selectDoubleClickDelay = function selectDoubleClickDelay(state) {
  return state.doubleClickDelay;
};
var selectIsDnDDisabled = function selectIsDnDDisabled(state) {
  return state.disableDragAndDrop;
};
var selectClearSelectionOnOutsideClick = function selectClearSelectionOnOutsideClick(state) {
  return state.clearSelectionOnOutsideClick;
};
var selectContextMenuMounted = function selectContextMenuMounted(state) {
  return state.contextMenuMounted;
};
var selectContextMenuConfig = function selectContextMenuConfig(state) {
  return state.contextMenuConfig;
};
var selectContextMenuTriggerFile = function selectContextMenuTriggerFile(state) {
  var _fileMap$config$trigg;

  var config = selectContextMenuConfig(state);
  if (!config || !config.triggerFileId) return null;
  var fileMap = selectFileMap(state);
  return (_fileMap$config$trigg = fileMap[config.triggerFileId]) != null ? _fileMap$config$trigg : null;
}; // Raw selectors

var getFileActionMap = function getFileActionMap(state) {
  return state.fileActionMap;
};

var getOptionMap = function getOptionMap(state) {
  return state.optionMap;
};

var getFileMap = function getFileMap(state) {
  return state.fileMap;
};

var getFileIds = function getFileIds(state) {
  return state.fileIds;
};

var getCleanFileIds = function getCleanFileIds(state) {
  return state.cleanFileIds;
};

var getSortActionId = function getSortActionId(state) {
  return state.sortActionId;
};

var getSortOrder = function getSortOrder(state) {
  return state.sortOrder;
};

var getSearchString = function getSearchString(state) {
  return state.searchString;
};

var _getLastClick = function _getLastClick(state) {
  return state.lastClick;
}; // Memoized selectors


var makeGetAction = function makeGetAction(fileActionSelector) {
  return createSelector([getFileActionMap, fileActionSelector], function (fileActionMap, fileActionId) {
    return fileActionId && fileActionMap[fileActionId] ? fileActionMap[fileActionId] : null;
  });
};

var makeGetOptionValue = function makeGetOptionValue(optionId, defaultValue) {
  if (defaultValue === void 0) {
    defaultValue = undefined;
  }

  return createSelector([getOptionMap], function (optionMap) {
    var value = optionMap[optionId];

    if (value === undefined) {
      return defaultValue;
    }

    return value;
  });
};

var makeGetFiles = function makeGetFiles(fileIdsSelector) {
  return createSelector([getFileMap, fileIdsSelector], function (fileMap, fileIds) {
    return fileIds.map(function (fileId) {
      return fileId && fileMap[fileId] ? fileMap[fileId] : null;
    });
  });
};

var getSortedFileIds = /*#__PURE__*/createSelector([getFileIds, getSortOrder, /*#__PURE__*/makeGetFiles(getFileIds), /*#__PURE__*/makeGetAction(getSortActionId), /*#__PURE__*/makeGetOptionValue(OptionIds.ShowFoldersFirst, false)], function (fileIds, sortOrder, files, sortAction, showFolderFirst) {
  if (!sortAction) {
    // We allow users to set the sort action ID to `null` if they want to use their
    // own sorting mechanisms instead of relying on Chonky built-in sort.
    return fileIds;
  }

  var prepareSortKeySelector = function prepareSortKeySelector(selector) {
    return function (file) {
      return selector(file);
    };
  };

  var sortFunctions = [];

  if (showFolderFirst) {
    // If option is undefined (relevant actions is not enabled), we don't show
    // folders first.
    sortFunctions.push({
      desc: prepareSortKeySelector(FileHelper.isDirectory)
    });
  }

  if (sortAction.sortKeySelector) {
    var _sortFunctions$push;

    var configKeyName = sortOrder === SortOrder.ASC ? 'asc' : 'desc';
    sortFunctions.push((_sortFunctions$push = {}, _sortFunctions$push[configKeyName] = prepareSortKeySelector(sortAction.sortKeySelector), _sortFunctions$push));
  }

  if (sortFunctions.length === 0) return fileIds; // We copy the array because `fast-sort` mutates it

  var sortedFileIds = sort([].concat(files)).by(sortFunctions).map(function (file) {
    return file ? file.id : null;
  });
  return sortedFileIds;
});
var getSearcher = /*#__PURE__*/createSelector([/*#__PURE__*/makeGetFiles(getCleanFileIds)], function (cleanFiles) {
  return new FuzzySearch(cleanFiles, ['name'], {
    caseSensitive: false
  });
});
var getSearchFilteredFileIds = /*#__PURE__*/createSelector([getCleanFileIds, getSearchString, getSearcher], function (cleanFileIds, searchString, searcher) {
  return searchString ? searcher.search(searchString).map(function (f) {
    return f.id;
  }) : cleanFileIds;
});
var getHiddenFileIdMap = /*#__PURE__*/createSelector([getSearchFilteredFileIds, /*#__PURE__*/makeGetFiles(getCleanFileIds), /*#__PURE__*/makeGetOptionValue(OptionIds.ShowHiddenFiles)], function (searchFilteredFileIds, cleanFiles, showHiddenFiles) {
  var searchFilteredFileIdsSet = new Set(searchFilteredFileIds);
  var hiddenFileIdMap = {};
  cleanFiles.forEach(function (file) {
    if (!file) return;else if (!searchFilteredFileIdsSet.has(file.id)) {
      // Hidden by seach
      hiddenFileIdMap[file.id] = true;
    } else if (!showHiddenFiles && FileHelper.isHidden(file)) {
      // Hidden by options
      hiddenFileIdMap[file.id] = true;
    }
  });
  return hiddenFileIdMap;
});
var getDisplayFileIds = /*#__PURE__*/createSelector([getSortedFileIds, getHiddenFileIdMap],
/** Returns files that will actually be shown to the user. */
function (sortedFileIds, hiddenFileIdMap) {
  return sortedFileIds.filter(function (id) {
    return !id || !hiddenFileIdMap[id];
  });
});
var getLastClickIndex = /*#__PURE__*/createSelector([_getLastClick, getSortedFileIds],
/** Returns the last click index after ensuring it is actually still valid. */
function (lastClick, displayFileIds) {
  if (!lastClick || lastClick.index > displayFileIds.length - 1 || lastClick.fileId != displayFileIds[lastClick.index]) {
    return null;
  }

  return lastClick.index;
});
var selectors = {
  // Raw selectors
  getFileActionMap: getFileActionMap,
  getOptionMap: getOptionMap,
  getFileMap: getFileMap,
  getFileIds: getFileIds,
  getCleanFileIds: getCleanFileIds,
  getSortActionId: getSortActionId,
  getSortOrder: getSortOrder,
  getSearchString: getSearchString,
  _getLastClick: _getLastClick,
  // Memoized selectors
  getSortedFileIds: getSortedFileIds,
  getSearcher: getSearcher,
  getSearchFilteredFileIds: getSearchFilteredFileIds,
  getHiddenFileIdMap: getHiddenFileIdMap,
  getDisplayFileIds: getDisplayFileIds,
  getLastClickIndex: getLastClickIndex,
  // Parametrized selectors
  makeGetAction: makeGetAction,
  makeGetOptionValue: makeGetOptionValue,
  makeGetFiles: makeGetFiles
}; // Selectors meant to be used outside of Redux code

var getFileData = function getFileData(state, fileId) {
  return fileId ? selectFileMap(state)[fileId] : null;
};
var getIsFileSelected = function getIsFileSelected(state, file) {
  // !!! We deliberately don't use `FileHelper.isSelectable` here as we want to
  //     reflect the state of Redux store accurately.
  return !!selectSelectionMap(state)[file.id];
};
var getSelectedFiles = function getSelectedFiles(state) {
  var fileMap = state.fileMap,
      selectionMap = state.selectionMap;
  var selectedFiles = Object.keys(selectionMap).map(function (id) {
    return fileMap[id];
  });

  for (var _len = arguments.length, filters = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    filters[_key - 1] = arguments[_key];
  }

  var filteredSelectedFiles = filters.reduce(function (prevFiles, filter) {
    return filter ? prevFiles.filter(filter) : prevFiles;
  }, selectedFiles);
  return filteredSelectedFiles;
};
var getSelectedFilesForAction = function getSelectedFilesForAction(state, fileActionId) {
  return selectSelectedFilesForAction(fileActionId)(state);
};

/**
 * Merges multiple file action arrays into one while removing duplicates
 */

var mergeFileActionsArrays = function mergeFileActionsArrays() {
  var _Array;

  var seenActionIds = new Set();

  var addToSeen = function addToSeen(a) {
    return !!seenActionIds.add(a.id);
  };

  var wasNotSeen = function wasNotSeen(a) {
    return !seenActionIds.has(a.id);
  };

  for (var _len = arguments.length, fileActionArrays = new Array(_len), _key = 0; _key < _len; _key++) {
    fileActionArrays[_key] = arguments[_key];
  }

  var duplicateFreeArrays = fileActionArrays.map(function (arr) {
    var duplicateFreeArray = arr.filter(wasNotSeen);
    duplicateFreeArray.map(addToSeen);
    return duplicateFreeArray;
  });
  return (_Array = new Array()).concat.apply(_Array, duplicateFreeArrays);
};

var thunkUpdateRawFileActions = function thunkUpdateRawFileActions(rawFileActions, disableDefaultFileActions) {
  return function (dispatch) {
    var _sanitizeInputArray = sanitizeInputArray('fileActions', rawFileActions),
        sanitizedArray = _sanitizeInputArray.sanitizedArray,
        errorMessages = _sanitizeInputArray.errorMessages; // Add default actions unless user disabled them


    var defaultActionsToAdd;

    if (Array.isArray(disableDefaultFileActions)) {
      var disabledActionIds = new Set(disableDefaultFileActions);
      defaultActionsToAdd = DefaultFileActions.filter(function (action) {
        return !disabledActionIds.has(action.id);
      });
    } else if (disableDefaultFileActions) {
      defaultActionsToAdd = [];
    } else {
      defaultActionsToAdd = DefaultFileActions;
    }

    var fileActions = mergeFileActionsArrays(sanitizedArray, EssentialFileActions, defaultActionsToAdd);
    var optionDefaults = {};
    fileActions.map(function (a) {
      return a.option ? optionDefaults[a.option.id] = a.option.defaultValue : null;
    });
    dispatch(reduxActions.setRawFileActions(rawFileActions));
    dispatch(reduxActions.setFileActionsErrorMessages(errorMessages));
    dispatch(reduxActions.setFileActions(fileActions));
    dispatch(reduxActions.setOptionDefaults(optionDefaults));
    dispatch(thunkUpdateToolbarNContextMenuItems(fileActions));
  };
};
var thunkUpdateToolbarNContextMenuItems = function thunkUpdateToolbarNContextMenuItems(fileActions) {
  return function (dispatch) {
    var excludedToolbarFileActionIds = new Set([// TODO: Move decision to exclude actions somewhere else, as users' custom
    //  components might not give these actions special treatment like Chonky does.
    ChonkyActions.OpenParentFolder.id]);
    var toolbarItems = [];
    var seenToolbarGroups = {};
    var contextMenuItems = [];
    var seenContextMenuGroups = {};

    var getGroup = function getGroup(itemArray, seenMap, groupName) {
      if (seenMap[groupName]) return seenMap[groupName];
      var group = {
        name: groupName,
        fileActionIds: []
      };
      itemArray.push(group);
      seenMap[groupName] = group;
      return group;
    };

    for (var _iterator = _createForOfIteratorHelperLoose(fileActions), _step; !(_step = _iterator()).done;) {
      var action = _step.value;
      var button = action.button;
      if (!button) continue;

      if (button.toolbar && !excludedToolbarFileActionIds.has(action.id)) {
        if (button.group) {
          var group = getGroup(toolbarItems, seenToolbarGroups, button.group);
          group.fileActionIds.push(action.id);
        } else {
          toolbarItems.push(action.id);
        }
      }

      if (button.contextMenu) {
        if (button.group) {
          var _group = getGroup(contextMenuItems, seenContextMenuGroups, button.group);

          _group.fileActionIds.push(action.id);
        } else {
          contextMenuItems.push(action.id);
        }
      }
    }

    dispatch(reduxActions.updateFileActionMenuItems([toolbarItems, contextMenuItems]));
  };
};
var thunkUpdateDefaultFileViewActionId = function thunkUpdateDefaultFileViewActionId(fileActionId) {
  return function (dispatch, getState) {
    var _getState = getState(),
        fileActionMap = _getState.fileActionMap;

    var action = fileActionId ? fileActionMap[fileActionId] : null;

    if (action && action.fileViewConfig) {
      dispatch(reduxActions.setFileViewConfig(action.fileViewConfig));
    }
  };
};
var thunkActivateSortAction = function thunkActivateSortAction(fileActionId) {
  return function (dispatch, getState) {
    if (!fileActionId) return;

    var _getState2 = getState(),
        oldActionId = _getState2.sortActionId,
        oldOrder = _getState2.sortOrder,
        fileActionMap = _getState2.fileActionMap;

    var action = fileActionMap[fileActionId];
    if (!action || !action.sortKeySelector) return;
    var order = oldOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;

    if (oldActionId !== fileActionId) {
      order = SortOrder.ASC;
    }

    dispatch(reduxActions.setSort({
      actionId: fileActionId,
      order: order
    }));
  };
};
var thunkApplySelectionTransform = function thunkApplySelectionTransform(action) {
  return function (dispatch, getState) {
    var selectionTransform = action.selectionTransform;
    if (!selectionTransform) return;
    var state = getState();
    var prevSelection = new Set(Object.keys(selectSelectionMap(state)));
    var hiddenFileIds = new Set(Object.keys(selectHiddenFileIdMap(state)));
    var newSelection = selectionTransform({
      prevSelection: prevSelection,
      fileIds: selectCleanFileIds(state),
      fileMap: selectFileMap(state),
      hiddenFileIds: hiddenFileIds
    });
    if (!newSelection) return;

    if (newSelection.size === 0) {
      dispatch(reduxActions.clearSelection());
    } else {
      dispatch(reduxActions.selectFiles({
        fileIds: Array.from(newSelection),
        reset: true
      }));
    }
  };
};

/**
 * Thunk that dispatches actions to the external (user-provided) action handler.
 */

var thunkDispatchFileAction = function thunkDispatchFileAction(data) {
  return function (_dispatch, getState) {
    Logger.debug("FILE ACTION DISPATCH: [" + data.id + "]", 'data:', data);
    var state = getState();
    var action = selectFileActionMap(state)[data.id];
    var externalFileActionHandler = selectExternalFileActionHandler(state);

    if (action) {
      if (externalFileActionHandler) {
        Promise.resolve(externalFileActionHandler(data))["catch"](function (error) {
          return Logger.error("User-defined file action handler threw an error: " + error.message);
        });
      }
    } else {
      Logger.warn("Internal components dispatched the \"" + data.id + "\" file action, but such " + "action was not registered.");
    }
  };
};
/**
 * Thunk that is used by internal components (and potentially the user) to "request"
 * actions. When action is requested, Chonky "prepares" the action data by extracting it
 * from Redux state. Once action data is ready, Chonky executes some side effect and/or
 * dispatches the action to the external action handler.
 */

var thunkRequestFileAction = function thunkRequestFileAction(action, payload) {
  return function (dispatch, getState) {
    Logger.debug("FILE ACTION REQUEST: [" + action.id + "]", 'action:', action, 'payload:', payload);
    var state = getState();
    var instanceId = selectInstanceId(state);

    if (!selectFileActionMap(state)[action.id]) {
      Logger.warn("The action \"" + action.id + "\" was requested, but it is not registered. The " + "action will still be dispatched, but this might indicate a bug in " + "the code. Please register your actions by passing them to " + "\"fileActions\" prop.");
    } // Determine files for the action if action requires selection


    var selectedFiles = selectSelectedFiles(state);
    var selectedFilesForAction = action.fileFilter ? selectedFiles.filter(action.fileFilter) : selectedFiles;

    if (action.requiresSelection && selectedFilesForAction.length === 0) {
      Logger.warn("Internal components requested the \"" + action.id + "\" file " + "action, but the selection for this action was empty. This " + "might a bug in the code of the presentational components.");
      return;
    }

    var contextMenuTriggerFile = selectContextMenuTriggerFile(state);
    var actionState = {
      instanceId: instanceId,
      selectedFiles: selectedFiles,
      selectedFilesForAction: selectedFilesForAction,
      contextMenuTriggerFile: contextMenuTriggerFile
    }; // === Update sort state if necessary

    var sortKeySelector = action.sortKeySelector;
    if (sortKeySelector) dispatch(thunkActivateSortAction(action.id)); // === Update file view state if necessary

    var fileViewConfig = action.fileViewConfig;
    if (fileViewConfig) dispatch(reduxActions.setFileViewConfig(fileViewConfig)); // === Update option state if necessary

    var option = action.option;
    if (option) dispatch(reduxActions.toggleOption(option.id)); // === Apply selection transform if necessary

    var selectionTransform = action.selectionTransform;
    if (selectionTransform) dispatch(thunkApplySelectionTransform(action)); // Apply the effect

    var effect = action.effect;
    var maybeEffectPromise = undefined;

    if (effect) {
      try {
        maybeEffectPromise = effect({
          action: action,
          payload: payload,
          state: actionState,
          reduxDispatch: dispatch,
          getReduxState: getState
        });
      } catch (error) {
        Logger.error("User-defined effect function for action " + action.id + " threw an " + ("error: " + error.message));
      }
    } // Dispatch the action to user code. Deliberately call it after all other
    // operations are over.


    return Promise.resolve(maybeEffectPromise).then(function (effectResult) {
      var data = {
        id: action.id,
        action: action,
        payload: payload,
        state: actionState
      };
      triggerDispatchAfterEffect(dispatch, data, effectResult);
    })["catch"](function (error) {
      Logger.error("User-defined effect function for action " + action.id + " returned a " + ("promise that was rejected: " + error.message));
      var data = {
        id: action.id,
        action: action,
        payload: payload,
        state: actionState
      };
      triggerDispatchAfterEffect(dispatch, data, undefined);
    });
  };
};
var triggerDispatchAfterEffect = function triggerDispatchAfterEffect(dispatch, data, effectResult) {
  var preventDispatch = effectResult === true;
  if (!preventDispatch) dispatch(thunkDispatchFileAction(data));
};

var FileViewMode;

(function (FileViewMode) {
  FileViewMode["List"] = "list";
  FileViewMode["Compact"] = "compact";
  FileViewMode["Grid"] = "grid";
})(FileViewMode || (FileViewMode = {}));

var ChonkyIconName;

(function (ChonkyIconName) {
  // Misc
  ChonkyIconName["loading"] = "loading";
  ChonkyIconName["dropdown"] = "dropdown";
  ChonkyIconName["placeholder"] = "placeholder"; // File Actions: Drag & drop

  ChonkyIconName["dndDragging"] = "dndDragging";
  ChonkyIconName["dndCanDrop"] = "dndCanDrop";
  ChonkyIconName["dndCannotDrop"] = "dndCannotDrop"; // File Actions: File operations

  ChonkyIconName["openFiles"] = "openFiles";
  ChonkyIconName["openParentFolder"] = "openParentFolder";
  ChonkyIconName["copy"] = "copy";
  ChonkyIconName["paste"] = "paste";
  ChonkyIconName["share"] = "share";
  ChonkyIconName["search"] = "search";
  ChonkyIconName["selectAllFiles"] = "selectAllFiles";
  ChonkyIconName["clearSelection"] = "clearSelection"; // File Actions: Sorting & options

  ChonkyIconName["sortAsc"] = "sortAsc";
  ChonkyIconName["sortDesc"] = "sortDesc";
  ChonkyIconName["toggleOn"] = "toggleOn";
  ChonkyIconName["toggleOff"] = "toggleOff"; // File Actions: File Views

  ChonkyIconName["list"] = "list";
  ChonkyIconName["compact"] = "compact";
  ChonkyIconName["smallThumbnail"] = "smallThumbnail";
  ChonkyIconName["largeThumbnail"] = "largeThumbnail"; // File Actions: Unsorted

  ChonkyIconName["folder"] = "folder";
  ChonkyIconName["folderCreate"] = "folderCreate";
  ChonkyIconName["folderOpen"] = "folderOpen";
  ChonkyIconName["folderChainSeparator"] = "folderChainSeparator";
  ChonkyIconName["download"] = "download";
  ChonkyIconName["upload"] = "upload";
  ChonkyIconName["trash"] = "trash";
  ChonkyIconName["fallbackIcon"] = "fallbackIcon"; // File modifiers

  ChonkyIconName["symlink"] = "symlink";
  ChonkyIconName["hidden"] = "hidden"; // Generic file types

  ChonkyIconName["file"] = "file";
  ChonkyIconName["license"] = "license";
  ChonkyIconName["code"] = "code";
  ChonkyIconName["config"] = "config";
  ChonkyIconName["model"] = "model";
  ChonkyIconName["database"] = "database";
  ChonkyIconName["text"] = "text";
  ChonkyIconName["archive"] = "archive";
  ChonkyIconName["image"] = "image";
  ChonkyIconName["video"] = "video";
  ChonkyIconName["info"] = "info";
  ChonkyIconName["key"] = "key";
  ChonkyIconName["lock"] = "lock";
  ChonkyIconName["music"] = "music";
  ChonkyIconName["terminal"] = "terminal";
  ChonkyIconName["users"] = "users"; // OS file types

  ChonkyIconName["linux"] = "linux";
  ChonkyIconName["ubuntu"] = "ubuntu";
  ChonkyIconName["windows"] = "windows"; // Programming language file types

  ChonkyIconName["rust"] = "rust";
  ChonkyIconName["python"] = "python";
  ChonkyIconName["nodejs"] = "nodejs";
  ChonkyIconName["php"] = "php"; // Development tools file types

  ChonkyIconName["git"] = "git"; // Brands file types

  ChonkyIconName["adobe"] = "adobe"; // Other program file types

  ChonkyIconName["pdf"] = "pdf";
  ChonkyIconName["excel"] = "excel";
  ChonkyIconName["word"] = "word";
  ChonkyIconName["flash"] = "flash";
})(ChonkyIconName || (ChonkyIconName = {}));

var defineFileAction = function defineFileAction(action, effect) {
  if (action.__payloadType !== undefined && (action.hotkeys || action.button)) {
    var errorMessage = "Invalid definition was provided for file action \"" + action.id + "\". Actions " + "that specify hotkeys or buttons cannot define a payload type. If " + "your application requires this functionality, define two actions " + "and chain them using effects.";
    Logger.error(errorMessage);
    throw new Error(errorMessage);
  }

  action.effect = effect;
  return action;
};
/**
 * Recursively check the current element and the parent elements, going bottom-up.
 * Returns the first element to match the predicate, otherwise returns null if such
 * element is not found.
 */

var findElementAmongAncestors = function findElementAmongAncestors(maybeElement, predicate) {
  if (!maybeElement) return maybeElement;
  if (predicate(maybeElement)) return maybeElement;

  if (maybeElement.parentElement) {
    return findElementAmongAncestors(maybeElement.parentElement, predicate);
  }

  return null;
};
var elementIsInsideButton = function elementIsInsideButton(buttonCandidate) {
  return !!findElementAmongAncestors(buttonCandidate, function (element) {
    return element.tagName && element.tagName.toLowerCase() === 'button';
  });
};
var getValueOrFallback = function getValueOrFallback(value, fallback, desiredType) {
  if (desiredType) {
    return typeof value === desiredType ? value : fallback;
  }

  return value !== undefined ? value : fallback;
};

var reduxThunks = {
  selectRange: function selectRange(params) {
    return function (dispatch, getState) {
      var state = getState();
      if (state.disableSelection) return;
      var displayFileIds = selectors.getDisplayFileIds(state);
      var fileIdsToSelect = displayFileIds.slice(params.rangeStart, params.rangeEnd + 1).filter(function (id) {
        return id && FileHelper.isSelectable(state.fileMap[id]);
      });
      dispatch(reduxActions.selectFiles({
        fileIds: fileIdsToSelect,
        reset: !!params.reset
      }));
    };
  }
};

var EssentialActions = {
  /**
   * Action that is dispatched when the user clicks on a file entry using their mouse.
   * Both single clicks and double clicks trigger this action.
   */
  MouseClickFile: /*#__PURE__*/defineFileAction({
    id: 'mouse_click_file',
    __payloadType: {}
  }, function (_ref) {
    var payload = _ref.payload,
        reduxDispatch = _ref.reduxDispatch,
        getReduxState = _ref.getReduxState;

    if (payload.clickType === 'double') {
      if (FileHelper.isOpenable(payload.file)) {
        reduxDispatch(thunkRequestFileAction(ChonkyActions.OpenFiles, {
          targetFile: payload.file,
          // To simulate Windows Explorer and Nautilus behaviour,
          // a double click on a file only opens that file even if
          // there is a selection.
          files: [payload.file]
        }));
      }
    } else {
      // We're dealing with a single click
      var disableSelection = selectDisableSelection(getReduxState());

      if (FileHelper.isSelectable(payload.file) && !disableSelection) {
        if (payload.ctrlKey) {
          // Multiple selection
          reduxDispatch(reduxActions.toggleSelection({
            fileId: payload.file.id,
            exclusive: false
          }));
          reduxDispatch(reduxActions.setLastClickIndex({
            index: payload.fileDisplayIndex,
            fileId: payload.file.id
          }));
        } else if (payload.shiftKey) {
          // Range selection
          var lastClickIndex = selectors.getLastClickIndex(getReduxState());

          if (typeof lastClickIndex === 'number') {
            // We have the index of the previous click
            var rangeStart = lastClickIndex;
            var rangeEnd = payload.fileDisplayIndex;

            if (rangeStart > rangeEnd) {
              var _ref2 = [rangeEnd, rangeStart];
              rangeStart = _ref2[0];
              rangeEnd = _ref2[1];
            }

            reduxDispatch(reduxThunks.selectRange({
              rangeStart: rangeStart,
              rangeEnd: rangeEnd
            }));
          } else {
            // Since we can't do a range selection, do a
            // multiple selection
            reduxDispatch(reduxActions.toggleSelection({
              fileId: payload.file.id,
              exclusive: false
            }));
            reduxDispatch(reduxActions.setLastClickIndex({
              index: payload.fileDisplayIndex,
              fileId: payload.file.id
            }));
          }
        } else {
          // Exclusive selection
          reduxDispatch(reduxActions.toggleSelection({
            fileId: payload.file.id,
            exclusive: true
          }));
          reduxDispatch(reduxActions.setLastClickIndex({
            index: payload.fileDisplayIndex,
            fileId: payload.file.id
          }));
        }
      } else {
        if (!payload.ctrlKey && !disableSelection) {
          reduxDispatch(reduxActions.clearSelection());
        }

        reduxDispatch(reduxActions.setLastClickIndex({
          index: payload.fileDisplayIndex,
          fileId: payload.file.id
        }));
      }
    }
  }),

  /**
   * Action that is dispatched when the user "clicks" on a file using their keyboard.
   * Using Space and Enter keys counts as clicking.
   */
  KeyboardClickFile: /*#__PURE__*/defineFileAction({
    id: 'keyboard_click_file',
    __payloadType: {}
  }, function (_ref3) {
    var payload = _ref3.payload,
        reduxDispatch = _ref3.reduxDispatch,
        getReduxState = _ref3.getReduxState;
    reduxDispatch(reduxActions.setLastClickIndex({
      index: payload.fileDisplayIndex,
      fileId: payload.file.id
    }));

    if (payload.enterKey) {
      // We only dispatch the Open Files action here when the selection is
      // empty. Otherwise, `Enter` key presses are handled by the
      // hotkey manager for the Open Files action.
      if (selectSelectionSize(getReduxState()) === 0) {
        reduxDispatch(thunkRequestFileAction(ChonkyActions.OpenFiles, {
          targetFile: payload.file,
          files: [payload.file]
        }));
      }
    } else if (payload.spaceKey && FileHelper.isSelectable(payload.file)) {
      reduxDispatch(reduxActions.toggleSelection({
        fileId: payload.file.id,
        exclusive: payload.ctrlKey
      }));
    }
  }),

  /**
   * Action that is dispatched when user starts dragging some file.
   */
  StartDragNDrop: /*#__PURE__*/defineFileAction({
    id: 'start_drag_n_drop',
    __payloadType: {}
  }, function (_ref4) {
    var payload = _ref4.payload,
        reduxDispatch = _ref4.reduxDispatch,
        getReduxState = _ref4.getReduxState;
    var file = payload.draggedFile;

    if (!getIsFileSelected(getReduxState(), file)) {
      if (FileHelper.isSelectable(file)) {
        reduxDispatch(reduxActions.selectFiles({
          fileIds: [file.id],
          reset: true
        }));
      }
    }
  }),

  /**
   * Action that is dispatched when user either cancels the drag & drop interaction,
   * or drops a file somewhere.
   */
  EndDragNDrop: /*#__PURE__*/defineFileAction({
    id: 'end_drag_n_drop',
    __payloadType: {}
  }, function (_ref5) {
    var payload = _ref5.payload,
        reduxDispatch = _ref5.reduxDispatch,
        getReduxState = _ref5.getReduxState;

    if (getIsFileSelected(getReduxState(), payload.destination)) {
      // Can't drop a selection into itself
      return;
    }

    var draggedFile = payload.draggedFile,
        selectedFiles = payload.selectedFiles;
    var droppedFiles = selectedFiles.length > 0 ? selectedFiles : [draggedFile];
    reduxDispatch(thunkRequestFileAction(ChonkyActions.MoveFiles, _extends({}, payload, {
      files: droppedFiles
    })));
  }),

  /**
   * Action that is dispatched when user moves files from one folder to another,
   * usually by dragging & dropping some files into the folder.
   */
  MoveFiles: /*#__PURE__*/defineFileAction({
    id: 'move_files',
    __payloadType: {}
  }),

  /**
   * Action that is dispatched when the selection changes for any reason.
   */
  ChangeSelection: /*#__PURE__*/defineFileAction({
    id: 'change_selection',
    __payloadType: {}
  }),

  /**
   * Action that is dispatched when user wants to open some files. This action is
   * often triggered by other actions.
   */
  OpenFiles: /*#__PURE__*/defineFileAction({
    id: 'open_files',
    __payloadType: {}
  }),

  /**
   * Action that is triggered when user wants to go up a directory.
   */
  OpenParentFolder: /*#__PURE__*/defineFileAction({
    id: 'open_parent_folder',
    hotkeys: ['backspace'],
    button: {
      name: 'Go up a directory',
      toolbar: true,
      contextMenu: false,
      icon: ChonkyIconName.openParentFolder,
      iconOnly: true
    }
  }, function (_ref6) {
    var reduxDispatch = _ref6.reduxDispatch,
        getReduxState = _ref6.getReduxState;
    var parentFolder = selectParentFolder(getReduxState());

    if (FileHelper.isOpenable(parentFolder)) {
      reduxDispatch(thunkRequestFileAction(ChonkyActions.OpenFiles, {
        targetFile: parentFolder,
        files: [parentFolder]
      }));
    } else {
      Logger.warn('Open parent folder effect was triggered  even though the parent folder' + ' is not openable. This indicates a bug in presentation components.');
    }
  }),

  /**
   * Action that is dispatched when user opens the context menu, either by right click
   * on something or using the context menu button on their keyboard.
   */
  OpenFileContextMenu: /*#__PURE__*/defineFileAction({
    id: 'open_file_context_menu',
    __payloadType: {}
  }, function (_ref7) {
    var payload = _ref7.payload,
        reduxDispatch = _ref7.reduxDispatch,
        getReduxState = _ref7.getReduxState;
    // TODO: Check if the context menu component is actually enabled. There is a
    //  chance it doesn't matter if it is enabled or not - if it is not mounted,
    //  the action will simply have no effect. It also allows users to provide
    //  their own components - however, users could also flip the "context menu
    //  component mounted" switch...
    var triggerFile = getFileData(getReduxState(), payload.triggerFileId);

    if (triggerFile) {
      var fileSelected = getIsFileSelected(getReduxState(), triggerFile);

      if (!fileSelected) {
        // If file is selected, we leave the selection as is. If it is not
        // selected, it means user right clicked the file with no selection.
        // We simulate the Windows Explorer/Nautilus behaviour of moving
        // selection to this file.
        if (FileHelper.isSelectable(triggerFile)) {
          reduxDispatch(reduxActions.selectFiles({
            fileIds: [payload.triggerFileId],
            reset: true
          }));
        } else {
          reduxDispatch(reduxActions.clearSelection());
        }
      }
    }

    reduxDispatch(reduxActions.showContextMenu({
      triggerFileId: payload.triggerFileId,
      mouseX: payload.clientX - 2,
      mouseY: payload.clientY - 4
    }));
  })
};

var DefaultActions = {
  /**
   * Action that can be used to open currently selected files.
   */
  OpenSelection: /*#__PURE__*/defineFileAction({
    id: 'open_selection',
    hotkeys: ['enter'],
    requiresSelection: true,
    fileFilter: FileHelper.isOpenable,
    button: {
      name: 'Open selection',
      toolbar: true,
      contextMenu: true,
      group: 'Actions',
      icon: ChonkyIconName.openFiles
    }
  }, function (_ref) {
    var state = _ref.state,
        reduxDispatch = _ref.reduxDispatch;
    reduxDispatch(thunkRequestFileAction(EssentialActions.OpenFiles, {
      files: state.selectedFilesForAction
    }));
    return undefined;
  }),

  /**
   * Action that selects all files.
   */
  SelectAllFiles: /*#__PURE__*/defineFileAction({
    id: 'select_all_files',
    hotkeys: ['ctrl+a'],
    button: {
      name: 'Select all files',
      toolbar: true,
      contextMenu: true,
      group: 'Actions',
      icon: ChonkyIconName.selectAllFiles
    },
    selectionTransform: function selectionTransform(_ref2) {
      var fileIds = _ref2.fileIds,
          hiddenFileIds = _ref2.hiddenFileIds;
      var newSelection = new Set();
      fileIds.map(function (fileId) {
        // We don't need to check if file is selectable because Chonky does
        // it own checks internally.
        if (!hiddenFileIds.has(fileId)) newSelection.add(fileId);
      });
      return newSelection;
    }
  }),

  /**
   * Action that clear the file selection.
   */
  ClearSelection: /*#__PURE__*/defineFileAction({
    id: 'clear_selection',
    hotkeys: ['escape'],
    button: {
      name: 'Clear selection',
      toolbar: true,
      contextMenu: true,
      group: 'Actions',
      icon: ChonkyIconName.clearSelection
    },
    selectionTransform: function selectionTransform(_ref3) {
      var prevSelection = _ref3.prevSelection;
      if (prevSelection.size === 0) return null;
      return new Set();
    }
  }),

  /**
   * Action that enables List view.
   */
  EnableListView: /*#__PURE__*/defineFileAction({
    id: 'enable_list_view',
    fileViewConfig: {
      mode: FileViewMode.List,
      entryHeight: 30
    },
    button: {
      name: 'Switch to List view',
      toolbar: true,
      icon: ChonkyIconName.list,
      iconOnly: true
    }
  }),

  /**
   * Action that enables Compact view. Note that compact view is still
   * experimental and should not be used in production.
   */
  EnableCompactView: /*#__PURE__*/defineFileAction({
    // TODO: Don't enable until compact view is fully supported
    id: 'enable_compact_view',
    fileViewConfig: {
      mode: FileViewMode.Compact,
      entryHeight: 40,
      entryWidth: 220
    },
    button: {
      name: 'Switch to Compact view',
      toolbar: true,
      icon: ChonkyIconName.compact,
      iconOnly: true
    }
  }),

  /**
   * Action that enables Grid view.
   */
  EnableGridView: /*#__PURE__*/defineFileAction({
    id: 'enable_grid_view',
    fileViewConfig: {
      mode: FileViewMode.Grid,
      entryWidth: 165,
      entryHeight: 130
    },
    button: {
      name: 'Switch to Grid view',
      toolbar: true,
      icon: ChonkyIconName.smallThumbnail,
      iconOnly: true
    }
  }),

  /**
   * Action that sorts files by `file.name`.
   */
  SortFilesByName: /*#__PURE__*/defineFileAction({
    id: 'sort_files_by_name',
    sortKeySelector: function sortKeySelector(file) {
      return file ? file.name.toLowerCase() : undefined;
    },
    button: {
      name: 'Sort by name',
      toolbar: true,
      group: 'Options'
    }
  }),

  /**
   * Action that sorts files by `file.size`.
   */
  SortFilesBySize: /*#__PURE__*/defineFileAction({
    id: 'sort_files_by_size',
    sortKeySelector: function sortKeySelector(file) {
      return file ? file.size : undefined;
    },
    button: {
      name: 'Sort by size',
      toolbar: true,
      group: 'Options'
    }
  }),

  /**
   * Action that sorts files by `file.modDate`.
   */
  SortFilesByDate: /*#__PURE__*/defineFileAction({
    id: 'sort_files_by_date',
    sortKeySelector: function sortKeySelector(file) {
      return file ? file.modDate : undefined;
    },
    button: {
      name: 'Sort by date',
      toolbar: true,
      group: 'Options'
    }
  }),

  /**
   * Action that toggles whether hidden files are shown to the user or not.
   */
  ToggleHiddenFiles: /*#__PURE__*/defineFileAction({
    id: 'toggle_hidden_files',
    hotkeys: ['ctrl+h'],
    option: {
      id: OptionIds.ShowHiddenFiles,
      defaultValue: true
    },
    button: {
      name: 'Show hidden files',
      toolbar: true,
      group: 'Options'
    }
  }),

  /**
   * Action that toggles whether folders should appear before files regardless of
   * current sort function.
   */
  ToggleShowFoldersFirst: /*#__PURE__*/defineFileAction({
    id: 'toggle_show_folders_first',
    option: {
      id: OptionIds.ShowFoldersFirst,
      defaultValue: true
    },
    button: {
      name: 'Show folders first',
      toolbar: true,
      group: 'Options'
    }
  }),

  /**
   * Action that focuses the search input when it is dispatched.
   */
  FocusSearchInput: /*#__PURE__*/defineFileAction({
    id: 'focus_search_input',
    hotkeys: ['ctrl+f']
  }, function (_ref4) {
    var getReduxState = _ref4.getReduxState;
    var focusSearchInput = selectFocusSearchInput(getReduxState());
    if (focusSearchInput) focusSearchInput();
  }),

  /**
   * Action that enables List view.
   */
  ToggleDarkMode: /*#__PURE__*/defineFileAction({
    id: 'enable_dark_mode',
    option: {
      id: OptionIds.DarkMode,
      defaultValue: false
    },
    button: {
      name: 'Enable dark mode',
      toolbar: true,
      icon: ChonkyIconName.list,
      iconOnly: true
    }
  })
};

var ExtraActions = {
  /**
   * Action that adds a button and shortcut to copy files.
   */
  CopyFiles: /*#__PURE__*/defineFileAction({
    id: 'copy_files',
    requiresSelection: true,
    hotkeys: ['ctrl+c'],
    button: {
      name: 'Copy selection',
      toolbar: true,
      contextMenu: true,
      group: 'Actions',
      icon: ChonkyIconName.copy
    }
  }),

  /**
   * Action that adds a button to create a new folder.
   */
  CreateFolder: /*#__PURE__*/defineFileAction({
    id: 'create_folder',
    button: {
      name: 'Create folder',
      toolbar: true,
      tooltip: 'Create a folder',
      icon: ChonkyIconName.folderCreate
    }
  }),

  /**
   * Action that adds a button to upload files.
   */
  UploadFiles: /*#__PURE__*/defineFileAction({
    id: 'upload_files',
    button: {
      name: 'Upload files',
      toolbar: true,
      tooltip: 'Upload files',
      icon: ChonkyIconName.upload
    }
  }),

  /**
   * Action that adds a button to download files.
   */
  DownloadFiles: /*#__PURE__*/defineFileAction({
    id: 'download_files',
    requiresSelection: true,
    button: {
      name: 'Download files',
      toolbar: true,
      contextMenu: true,
      group: 'Actions',
      icon: ChonkyIconName.download
    }
  }),

  /**
   * Action that adds a button and shortcut to delete files.
   */
  DeleteFiles: /*#__PURE__*/defineFileAction({
    id: 'delete_files',
    requiresSelection: true,
    hotkeys: ['delete'],
    button: {
      name: 'Delete files',
      toolbar: true,
      contextMenu: true,
      group: 'Actions',
      icon: ChonkyIconName.trash
    }
  })
};

var ChonkyActions = /*#__PURE__*/_extends({}, EssentialActions, DefaultActions, ExtraActions);
var EssentialFileActions = [ChonkyActions.MouseClickFile, ChonkyActions.KeyboardClickFile, ChonkyActions.StartDragNDrop, ChonkyActions.EndDragNDrop, ChonkyActions.MoveFiles, ChonkyActions.ChangeSelection, ChonkyActions.OpenFiles, ChonkyActions.OpenParentFolder, ChonkyActions.OpenFileContextMenu];
var DefaultFileActions = [ChonkyActions.OpenSelection, ChonkyActions.SelectAllFiles, ChonkyActions.ClearSelection, ChonkyActions.EnableListView, // TODO: Don't enable until compact view is fully supported
// ChonkyActions.EnableCompactView,
ChonkyActions.EnableGridView, ChonkyActions.SortFilesByName, ChonkyActions.SortFilesBySize, ChonkyActions.SortFilesByDate, ChonkyActions.ToggleHiddenFiles, ChonkyActions.ToggleShowFoldersFirst, ChonkyActions.FocusSearchInput];

var initialRootState = {
  instanceId: 'CHONKY_INVALID_ID',
  externalFileActionHandler: null,
  rawFileActions: [],
  fileActionsErrorMessages: [],
  fileActionMap: {},
  fileActionIds: [],
  toolbarItems: [],
  contextMenuItems: [],
  rawFolderChain: null,
  folderChainErrorMessages: [],
  folderChain: [],
  rawFiles: [],
  filesErrorMessages: [],
  fileMap: {},
  fileIds: [],
  cleanFileIds: [],
  sortedFileIds: [],
  hiddenFileIdMap: {},
  focusSearchInput: null,
  searchString: '',
  searchMode: 'currentFolder',
  selectionMap: {},
  disableSelection: false,
  fileViewConfig: ChonkyActions.EnableGridView.fileViewConfig,
  sortActionId: null,
  sortOrder: SortOrder.ASC,
  optionMap: {},
  thumbnailGenerator: null,
  doubleClickDelay: 300,
  disableDragAndDrop: false,
  clearSelectionOnOutsideClick: true,
  lastClick: null,
  contextMenuMounted: false,
  contextMenuConfig: null
};

var reducers = {
  setExternalFileActionHandler: function setExternalFileActionHandler(state, action) {
    var _action$payload;

    state.externalFileActionHandler = (_action$payload = action.payload) != null ? _action$payload : null;
  },
  setRawFileActions: function setRawFileActions(state, action) {
    state.rawFileActions = action.payload;
  },
  setFileActionsErrorMessages: function setFileActionsErrorMessages(state, action) {
    state.fileActionsErrorMessages = action.payload;
  },
  setFileActions: function setFileActions(state, action) {
    var fileActionMap = {};
    action.payload.map(function (a) {
      return fileActionMap[a.id] = a;
    });
    var fileIds = action.payload.map(function (a) {
      return a.id;
    });
    state.fileActionMap = fileActionMap;
    state.fileActionIds = fileIds;
  },
  updateFileActionMenuItems: function updateFileActionMenuItems(state, action) {
    var _action$payload2 = action.payload;
    state.toolbarItems = _action$payload2[0];
    state.contextMenuItems = _action$payload2[1];
  },
  setRawFolderChain: function setRawFolderChain(state, action) {
    var rawFolderChain = action.payload;

    var _sanitizeInputArray = sanitizeInputArray('folderChain', rawFolderChain),
        folderChain = _sanitizeInputArray.sanitizedArray,
        errorMessages = _sanitizeInputArray.errorMessages;

    state.rawFolderChain = rawFolderChain;
    state.folderChain = folderChain;
    state.folderChainErrorMessages = errorMessages;
  },
  setRawFiles: function setRawFiles(state, action) {
    var rawFiles = action.payload;

    var _sanitizeInputArray2 = sanitizeInputArray('files', rawFiles),
        files = _sanitizeInputArray2.sanitizedArray,
        errorMessages = _sanitizeInputArray2.errorMessages;

    state.rawFiles = rawFiles;
    state.filesErrorMessages = errorMessages;
    var fileMap = {};
    files.forEach(function (f) {
      if (f) fileMap[f.id] = f;
    });
    var fileIds = files.map(function (f) {
      return f ? f.id : null;
    });
    var cleanFileIds = fileIds.filter(function (f) {
      return !!f;
    });
    state.fileMap = fileMap;
    state.fileIds = fileIds;
    state.cleanFileIds = cleanFileIds; // Cleanup selection

    for (var _i = 0, _Object$keys = Object.keys(state.selectionMap); _i < _Object$keys.length; _i++) {
      var selectedFileId = _Object$keys[_i];

      if (!fileMap[selectedFileId]) {
        delete state.selectionMap[selectedFileId];
      }
    }
  },
  setSortedFileIds: function setSortedFileIds(state, action) {
    state.sortedFileIds = action.payload;
  },
  setHiddenFileIds: function setHiddenFileIds(state, action) {
    state.hiddenFileIdMap = action.payload; // Cleanup selection

    for (var _i2 = 0, _Object$keys2 = Object.keys(state.selectionMap); _i2 < _Object$keys2.length; _i2++) {
      var selectedFileId = _Object$keys2[_i2];

      if (state.hiddenFileIdMap[selectedFileId]) {
        delete state.selectionMap[selectedFileId];
      }
    }
  },
  setFocusSearchInput: function setFocusSearchInput(state, action) {
    state.focusSearchInput = action.payload;
  },
  setSearchString: function setSearchString(state, action) {
    state.searchString = action.payload;
  },
  selectAllFiles: function selectAllFiles(state) {
    state.fileIds.filter(function (id) {
      return id && FileHelper.isSelectable(state.fileMap[id]);
    }).map(function (id) {
      return id ? state.selectionMap[id] = true : null;
    });
  },
  selectFiles: function selectFiles(state, action) {
    if (state.disableSelection) return;
    if (action.payload.reset) state.selectionMap = {};
    action.payload.fileIds.filter(function (id) {
      return id && FileHelper.isSelectable(state.fileMap[id]);
    }).map(function (id) {
      return state.selectionMap[id] = true;
    });
  },
  toggleSelection: function toggleSelection(state, action) {
    if (state.disableSelection) return;
    var oldValue = !!state.selectionMap[action.payload.fileId];
    if (action.payload.exclusive) state.selectionMap = {};
    if (oldValue) delete state.selectionMap[action.payload.fileId];else if (FileHelper.isSelectable(state.fileMap[action.payload.fileId])) {
      state.selectionMap[action.payload.fileId] = true;
    }
  },
  clearSelection: function clearSelection(state) {
    if (state.disableSelection) return;
    if (Object.keys(state.selectionMap).length !== 0) state.selectionMap = {};
  },
  setSelectionDisabled: function setSelectionDisabled(state, action) {
    state.disableSelection = action.payload;
    if (Object.keys(state.selectionMap).length !== 0) state.selectionMap = {};
  },
  setFileViewConfig: function setFileViewConfig(state, action) {
    state.fileViewConfig = action.payload;
  },
  setSort: function setSort(state, action) {
    state.sortActionId = action.payload.actionId;
    state.sortOrder = action.payload.order;
  },
  setOptionDefaults: function setOptionDefaults(state, action) {
    for (var _i3 = 0, _Object$keys3 = Object.keys(action.payload); _i3 < _Object$keys3.length; _i3++) {
      var optionId = _Object$keys3[_i3];
      if (optionId in state.optionMap) continue;
      state.optionMap[optionId] = action.payload[optionId];
    }
  },
  toggleOption: function toggleOption(state, action) {
    state.optionMap[action.payload] = !state.optionMap[action.payload];
  },
  setThumbnailGenerator: function setThumbnailGenerator(state, action) {
    state.thumbnailGenerator = action.payload;
  },
  setDoubleClickDelay: function setDoubleClickDelay(state, action) {
    state.doubleClickDelay = action.payload;
  },
  setDisableDragAndDrop: function setDisableDragAndDrop(state, action) {
    state.disableDragAndDrop = action.payload;
  },
  setClearSelectionOnOutsideClick: function setClearSelectionOnOutsideClick(state, action) {
    state.clearSelectionOnOutsideClick = action.payload;
  },
  setLastClickIndex: function setLastClickIndex(state, action) {
    state.lastClick = action.payload;
  },
  setContextMenuMounted: function setContextMenuMounted(state, action) {
    state.contextMenuMounted = action.payload;
  },
  showContextMenu: function showContextMenu(state, action) {
    state.contextMenuConfig = action.payload;
  },
  hideContextMenu: function hideContextMenu(state) {
    if (!state.contextMenuConfig) return;
    state.contextMenuConfig = null;
  }
};

var _createSlice = /*#__PURE__*/createSlice({
  name: 'root',
  initialState: initialRootState,
  reducers: reducers
}),
    reduxActions = _createSlice.actions,
    rootReducer = _createSlice.reducer;

var useStoreWatchers = function useStoreWatchers(store) {
  useEffect(function () {
    var selectionWatcher = watch(function () {
      return selectSelectionMap(store.getState());
    });

    var onSelectionChange = function onSelectionChange(newSelection, oldSelection) {
      // We don't check for deep equality here as we expect the
      // reducers to prevent all unnecessary updates.
      if (newSelection === oldSelection) return; // Notify users the selection has changed.

      var selectedFilesIds = selectSelectedFileIds(store.getState());
      var selection = new Set(selectedFilesIds);
      store.dispatch(thunkRequestFileAction(ChonkyActions.ChangeSelection, {
        selection: selection
      }));
    };

    var unsubscribeCallbacks = [store.subscribe(selectionWatcher(onSelectionChange))];
    return function () {
      for (var _iterator = _createForOfIteratorHelperLoose(unsubscribeCallbacks), _step; !(_step = _iterator()).done;) {
        var unsubscribe = _step.value;
        unsubscribe();
      }
    };
  }, [store]);
};

var useChonkyStore = function useChonkyStore(chonkyInstanceId) {
  var store = useStaticValue(function () {
    var preloadedState = _extends({}, initialRootState, {
      instanceId: chonkyInstanceId
    });

    return configureStore({
      preloadedState: preloadedState,
      reducer: rootReducer,
      middleware: function middleware(getDefaultMiddleware) {
        return getDefaultMiddleware({
          serializableCheck: false
        });
      },
      devTools: {
        name: "chonky_" + chonkyInstanceId
      }
    });
  });
  useStoreWatchers(store);
  return store;
};
/**
 * Hook that can be used with parametrized selectors.
 */

var useParamSelector = function useParamSelector(parametrizedSelector) {
  for (var _len = arguments.length, selectorParams = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    selectorParams[_key - 1] = arguments[_key];
  }

  var selector = useCallback(function (state) {
    return parametrizedSelector.apply(void 0, selectorParams)(state);
  }, // eslint-disable-next-line
  [parametrizedSelector].concat(selectorParams));
  return useSelector(selector);
};
/**
 * DTE - DispatchThunkEffect. This method is used to decrease code duplication in
 * main Chonky method.
 */

var useDTE = function useDTE(actionCreator) {
  for (var _len2 = arguments.length, selectorParams = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    selectorParams[_key2 - 1] = arguments[_key2];
  }

  var dispatch = useDispatch();
  useEffect(function () {
    dispatch(actionCreator.apply(void 0, selectorParams));
  }, // eslint-disable-next-line
  [dispatch, actionCreator].concat(selectorParams));
};
var usePropReduxUpdate = function usePropReduxUpdate(actionCreator, payload) {
  var dispatch = useDispatch();
  useEffect(function () {
    return dispatch(actionCreator(payload));
  }, [dispatch, actionCreator, payload]);
};

/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */
var ChonkyIconPlaceholder = function ChonkyIconPlaceholder() {
  // This component should not be rendered unless the user has misconfigured Chonky
  var title = 'No icon component found. Please follow Chonky installation instructions to ' + 'provide a pre-made icon component (or a custom icon).';
  return React.createElement("span", {
    title: title
  }, "\u26A0\uFE0F");
};

var defaultConfig = {
  fileActions: null,
  onFileAction: null,
  thumbnailGenerator: null,
  doubleClickDelay: 300,
  disableSelection: false,
  disableDefaultFileActions: false,
  disableDragAndDrop: false,
  disableDragAndDropProvider: false,
  defaultSortActionId: ChonkyActions.SortFilesByName.id,
  defaultFileViewActionId: ChonkyActions.EnableGridView.id,
  clearSelectionOnOutsideClick: true,
  iconComponent: ChonkyIconPlaceholder,
  darkMode: false,
  i18n: {}
};
var setChonkyDefaults = function setChonkyDefaults(config) {
  for (var _i = 0, _Object$keys = Object.keys(defaultConfig); _i < _Object$keys.length; _i++) {
    var key = _Object$keys[_i];

    if (key in config) {
      defaultConfig[key] = config[key];
    }
  }
};

var I18nNamespace;

(function (I18nNamespace) {
  I18nNamespace["Toolbar"] = "toolbar";
  I18nNamespace["FileList"] = "fileList";
  I18nNamespace["FileEntry"] = "fileEntry";
  I18nNamespace["FileContextMenu"] = "contextMenu";
  I18nNamespace["FileActions"] = "actions";
  I18nNamespace["FileActionGroups"] = "actionGroups";
})(I18nNamespace || (I18nNamespace = {}));

var getI18nId = function getI18nId(namespace, stringId) {
  return "chonky." + namespace + "." + stringId;
};
var getActionI18nId = function getActionI18nId(actionId, stringId) {
  return "chonky." + I18nNamespace.FileActions + "." + actionId + "." + stringId;
};
var useLocalizedFileActionGroup = function useLocalizedFileActionGroup(groupName) {
  var intl = useIntl();
  return useMemo(function () {
    return intl.formatMessage({
      id: getI18nId(I18nNamespace.FileActionGroups, groupName),
      defaultMessage: groupName
    });
  }, [groupName, intl]);
};
var useLocalizedFileActionStrings = function useLocalizedFileActionStrings(action) {
  var intl = useIntl();
  return useMemo(function () {
    var _action$button, _action$button2;

    if (!action) {
      return {
        buttonName: '',
        buttonTooltip: undefined
      };
    }

    var buttonName = intl.formatMessage({
      id: getActionI18nId(action.id, 'button.name'),
      defaultMessage: (_action$button = action.button) == null ? void 0 : _action$button.name
    });
    var buttonTooltip = undefined;

    if ((_action$button2 = action.button) != null && _action$button2.tooltip) {
      var _action$button3;

      // We only translate the tooltip if the original action has a tooltip.
      buttonTooltip = intl.formatMessage({
        id: getActionI18nId(action.id, 'button.tooltip'),
        defaultMessage: (_action$button3 = action.button) == null ? void 0 : _action$button3.tooltip
      });
    }

    return {
      buttonName: buttonName,
      buttonTooltip: buttonTooltip
    };
  }, [action, intl]);
};
var useLocalizedFileEntryStrings = function useLocalizedFileEntryStrings(file) {
  var intl = useIntl();
  var formatters = useContext(ChonkyFormattersContext);
  return useMemo(function () {
    return {
      fileModDateString: formatters.formatFileModDate(intl, file),
      fileSizeString: formatters.formatFileSize(intl, file)
    };
  }, [file, formatters, intl]);
};
var defaultFormatters = {
  formatFileModDate: function formatFileModDate(intl, file) {
    var safeModDate = FileHelper.getModDate(file);

    if (safeModDate) {
      return intl.formatDate(safeModDate, {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
    } else {
      return null;
    }
  },
  formatFileSize: function formatFileSize(_intl, file) {
    if (!file || typeof file.size !== 'number') return null;
    var size = file.size;
    var sizeData = filesize(size, {
      bits: false,
      output: 'object'
    });

    if (sizeData.symbol === 'B') {
      return Math.round(sizeData.value / 10) / 100.0 + " KB";
    } else if (sizeData.symbol === 'KB') {
      return Math.round(sizeData.value) + " " + sizeData.symbol;
    }

    return sizeData.value + " " + sizeData.symbol;
  }
};
var ChonkyFormattersContext = /*#__PURE__*/createContext(defaultFormatters);

/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */
var ChonkyIconContext = /*#__PURE__*/createContext(ChonkyIconPlaceholder);
var VideoExtensions = ['3g2', '3gp', '3gpp', 'asf', 'asx', 'avi', 'dvb', 'f4v', 'fli', 'flv', 'fvt', 'h261', 'h263', 'h264', 'jpgm', 'jpgv', 'jpm', 'm1v', 'm2v', 'm4u', 'm4v', 'mj2', 'mjp2', 'mk3d', 'mks', 'mkv', 'mng', 'mov', 'movie', 'mp4', 'mp4v', 'mpe', 'mpeg', 'mpg', 'mpg4', 'mxu', 'ogv', 'pyv', 'qt', 'smv', 'ts', 'uvh', 'uvm', 'uvp', 'uvs', 'uvu', 'uvv', 'uvvh', 'uvvm', 'uvvp', 'uvvs', 'uvvu', 'uvvv', 'viv', 'vob', 'webm', 'wm', 'wmv', 'wmx', 'wvx'];
var ImageExtensions = ['3ds', 'apng', 'azv', 'bmp', 'bmp', 'btif', 'cgm', 'cmx', 'djv', 'djvu', 'drle', 'dwg', 'dxf', 'emf', 'exr', 'fbs', 'fh', 'fh4', 'fh5', 'fh7', 'fhc', 'fits', 'fpx', 'fst', 'g3', 'gif', 'heic', 'heics', 'heif', 'heifs', 'ico', 'ico', 'ief', 'jls', 'jng', 'jp2', 'jpe', 'jpeg', 'jpf', 'jpg', 'jpg2', 'jpm', 'jpx', 'jxr', 'ktx', 'mdi', 'mmr', 'npx', 'pbm', 'pct', 'pcx', 'pcx', 'pgm', 'pic', 'png', 'pnm', 'ppm', 'psd', 'pti', 'ras', 'rgb', 'rlc', 'sgi', 'sid', 'sub', 'svg', 'svgz', 't38', 'tap', 'tfx', 'tga', 'tif', 'tiff', 'uvg', 'uvi', 'uvvg', 'uvvi', 'vtf', 'wbmp', 'wdp', 'webp', 'wmf', 'xbm', 'xif', 'xpm', 'xwd'];
var AudioExtensions = ['3gpp', 'aac', 'adp', 'aif', 'aifc', 'aiff', 'au', 'caf', 'dra', 'dts', 'dtshd', 'ecelp4800', 'ecelp7470', 'ecelp9600', 'eol', 'flac', 'kar', 'lvp', 'm2a', 'm3a', 'm3u', 'm4a', 'm4a', 'mid', 'midi', 'mka', 'mp2', 'mp2a', 'mp3', 'mp3', 'mp4a', 'mpga', 'oga', 'ogg', 'pya', 'ra', 'ra', 'ram', 'rip', 'rmi', 'rmp', 's3m', 'sil', 'snd', 'spx', 'uva', 'uvva', 'wav', 'wav', 'wav', 'wax', 'weba', 'wma', 'xm'];
var ColorsLight = ['#bbbbbb', '#d65c5c', '#d6665c', '#d6705c', '#d67a5c', '#d6855c', '#d68f5c', '#d6995c', '#d6a35c', '#d6ad5c', '#d6b85c', '#d6c25c', '#d6cc5c', '#d6d65c', '#ccd65c', '#c2d65c', '#b8d65c', '#add65c', '#a3d65c', '#99d65c', '#8fd65c', '#85d65c', '#7ad65c', '#70d65c', '#66d65c', '#5cd65c', '#5cd666', '#5cd670', '#5cd67a', '#5cd685', '#5cd68f', '#5cd699', '#5cd6a3', '#5cd6ad', '#5cd6b8', '#5cd6c2', '#5cd6cc', '#5cd6d6', '#5cccd6', '#5cc2d6', '#5cb8d6', '#5cadd6', '#5ca3d6', '#5c99d6', '#5c8fd6', '#5c85d6', '#5c7ad6', '#5c70d6', '#5c66d6', '#5c5cd6', '#665cd6', '#705cd6', '#7a5cd6', '#855cd6', '#8f5cd6', '#995cd6', '#a35cd6', '#ad5cd6', '#b85cd6', '#c25cd6', '#cc5cd6', '#d65cd6', '#d65ccc', '#d65cc2', '#d65cb8', '#d65cad', '#d65ca3', '#d65c99', '#d65c8f', '#d65c85', '#d65c7a', '#d65c70', '#d65c66'];
var ColorsDark = ['#777', '#8f3d3d', '#8f443d', '#8f4b3d', '#8f523d', '#8f583d', '#8f5f3d', '#8f663d', '#8f6d3d', '#8f743d', '#8f7a3d', '#8f813d', '#8f883d', '#8f8f3d', '#888f3d', '#818f3d', '#7a8f3d', '#748f3d', '#6d8f3d', '#668f3d', '#5f8f3d', '#588f3d', '#528f3d', '#4b8f3d', '#448f3d', '#3d8f3d', '#3d8f44', '#3d8f4b', '#3d8f52', '#3d8f58', '#3d8f5f', '#3d8f66', '#3d8f6d', '#3d8f74', '#3d8f7a', '#3d8f81', '#3d8f88', '#3d8f8f', '#3d888f', '#3d818f', '#3d7a8f', '#3d748f', '#3d6d8f', '#3d668f', '#3d5f8f', '#3d588f', '#3d528f', '#3d4b8f', '#3d448f', '#3d3d8f', '#443d8f', '#4b3d8f', '#523d8f', '#583d8f', '#5f3d8f', '#663d8f', '#6d3d8f', '#743d8f', '#7a3d8f', '#813d8f', '#883d8f', '#8f3d8f', '#8f3d88', '#8f3d81', '#8f3d7a', '#8f3d74', '#8f3d6d', '#8f3d66', '#8f3d5f', '#8f3d58', '#8f3d52', '#8f3d4b', '#8f3d44'];

var getIconTrie = function getIconTrie() {
  var colourIndex = 0;
  var step = 5;
  var IconsToExtensions = [// Generic file types
  [ChonkyIconName.license, ['license']], [ChonkyIconName.config, ['sfk', 'ini', 'yml', 'toml', 'iml']], [ChonkyIconName.model, ['3ds', 'obj', 'ply', 'fbx']], [ChonkyIconName.database, ['csv', 'json', 'sql', 'sqlite', 'sqlite3', 'npy', 'npz', 'rec', 'idx', 'hdf5']], [ChonkyIconName.text, ['txt', 'md', 'mdx']], [ChonkyIconName.archive, ['zip', 'rar', 'tar', 'tar.gz', '7z']], [ChonkyIconName.image, ImageExtensions], [ChonkyIconName.video, VideoExtensions], [ChonkyIconName.code, ['html', 'php', 'css', 'sass', 'scss', 'less', 'cpp', 'h', 'hpp', 'c', 'xml']], [ChonkyIconName.info, ['bib', 'readme', 'nfo']], [ChonkyIconName.key, ['pem', 'pub']], [ChonkyIconName.lock, ['lock', 'lock.json', 'shrinkwrap.json']], [ChonkyIconName.music, AudioExtensions], [ChonkyIconName.terminal, ['run', 'sh']], [ChonkyIconName.trash, ['.Trashes']], [ChonkyIconName.users, ['authors', 'contributors']], // OS file types
  [ChonkyIconName.linux, ['AppImage']], [ChonkyIconName.ubuntu, ['deb']], [ChonkyIconName.windows, ['exe']], // Programming language file types
  [ChonkyIconName.rust, ['rs', 'rlib']], [ChonkyIconName.python, ['py', 'ipynb']], [ChonkyIconName.nodejs, ['js', 'jsx', 'ts', 'tsx', 'd.ts']], [ChonkyIconName.php, ['php']], // Development tools file types
  [ChonkyIconName.git, ['.gitignore']], // Brands file types
  [ChonkyIconName.adobe, ['psd']], // Other program file types
  [ChonkyIconName.pdf, ['pdf']], [ChonkyIconName.excel, ['xls', 'xlsx']], [ChonkyIconName.word, ['doc', 'docx', 'odt']], [ChonkyIconName.flash, ['swf']]];
  var exactTrie = new ExactTrie({
    ignoreCase: true
  });

  for (var _i = 0, _IconsToExtensions = IconsToExtensions; _i < _IconsToExtensions.length; _i++) {
    var pair = _IconsToExtensions[_i];
    var icon = pair[0],
        extensions = pair[1];

    for (var i = 0; i < extensions.length; ++i) {
      colourIndex += step;
      var colorCode = colourIndex % (ColorsLight.length - 1) + 1;
      var iconData = {
        icon: icon,
        colorCode: colorCode
      };
      exactTrie.put(extensions[i], iconData, true);
    }
  }

  return exactTrie;
};

var iconTrie = /*#__PURE__*/getIconTrie();
var useIconData = function useIconData(file) {
  return useMemo(function () {
    if (!file) return {
      icon: ChonkyIconName.loading,
      colorCode: 0
    };
    if (file.isDir === true) return {
      icon: ChonkyIconName.folder,
      colorCode: 0
    };
    var match = iconTrie.getWithCheckpoints(file.name, '.', true);
    return match ? match : {
      icon: ChonkyIconName.file,
      colorCode: 32
    };
  }, [file]);
};

var lightTheme = {
  colors: {
    debugRed: '#fabdbd',
    debugBlue: '#bdd8fa',
    debugGreen: '#d2fabd',
    debugPurple: '#d2bdfa',
    debugYellow: '#fae9bd',
    textActive: '#09f'
  },
  fontSizes: {
    rootPrimary: 15
  },
  margins: {
    rootLayoutMargin: 8
  },
  toolbar: {
    size: 30,
    lineHeight: '30px',
    fontSize: 15,
    buttonRadius: 4
  },
  dnd: {
    canDropColor: 'green',
    cannotDropColor: 'red',
    canDropMask: 'rgba(180, 235, 180, 0.75)',
    cannotDropMask: 'rgba(235, 180, 180, 0.75)',
    fileListCanDropMaskOne: 'rgba(180, 235, 180, 0.1)',
    fileListCanDropMaskTwo: 'rgba(180, 235, 180, 0.2)',
    fileListCannotDropMaskOne: 'rgba(235, 180, 180, 0.1)',
    fileListCannotDropMaskTwo: 'rgba(235, 180, 180, 0.2)'
  },
  dragLayer: {
    border: 'solid 2px #09f',
    padding: '7px 10px',
    borderRadius: 2
  },
  fileList: {
    desktopGridGutter: 8,
    mobileGridGutter: 5
  },
  gridFileEntry: {
    childrenCountSize: '1.6em',
    iconColorFocused: '#000',
    iconSize: '2.4em',
    iconColor: '#fff',
    borderRadius: 5,
    fontSize: 14,
    fileColorTint: 'rgba(255, 255, 255, 0.4)',
    folderBackColorTint: 'rgba(255, 255, 255, 0.1)',
    folderFrontColorTint: 'rgba(255, 255, 255, 0.4)'
  },
  listFileEntry: {
    propertyFontSize: 14,
    iconFontSize: '1.1em',
    iconBorderRadius: 5,
    fontSize: 14
  }
};
var darkThemeOverride = {
  gridFileEntry: {
    fileColorTint: 'rgba(50, 50, 50, 0.4)',
    folderBackColorTint: 'rgba(50, 50, 50, 0.4)',
    folderFrontColorTint: 'rgba(50, 50, 50, 0.15)'
  }
};
var mobileThemeOverride = {
  fontSizes: {
    rootPrimary: 13
  },
  margins: {
    rootLayoutMargin: 4
  },
  toolbar: {
    size: 28,
    lineHeight: '28px',
    fontSize: 13
  },
  gridFileEntry: {
    fontSize: 13
  },
  listFileEntry: {
    propertyFontSize: 12,
    iconFontSize: '1em',
    fontSize: 13
  }
};
var useIsMobileBreakpoint = function useIsMobileBreakpoint() {
  return useMediaQuery('(max-width:480px)');
};
var getStripeGradient = function getStripeGradient(colorOne, colorTwo) {
  return 'repeating-linear-gradient(' + '45deg,' + (colorOne + ",") + (colorOne + " 10px,") + (colorTwo + " 0,") + (colorTwo + " 20px") + ')';
};
var makeLocalChonkyStyles = function makeLocalChonkyStyles(styles // @ts-ignore
) {
  return createUseStyles(styles);
};
var makeGlobalChonkyStyles = function makeGlobalChonkyStyles(makeStyles) {
  var selectorMapping = {};

  var makeGlobalStyles = function makeGlobalStyles(theme) {
    var localStyles = makeStyles(theme);
    var globalStyles = {};
    var localSelectors = Object.keys(localStyles);
    localSelectors.map(function (localSelector) {
      var globalSelector = "chonky-" + localSelector;
      var jssSelector = "@global ." + globalSelector; // @ts-ignore

      globalStyles[jssSelector] = localStyles[localSelector]; // @ts-ignore

      selectorMapping[localSelector] = globalSelector;
    });
    return globalStyles;
  }; // @ts-ignore


  var useStyles = createUseStyles(makeGlobalStyles);
  return function () {
    var styles = useStyles.apply(void 0, arguments);
    var classes = {};
    Object.keys(selectorMapping).map(function (localSelector) {
      // @ts-ignore
      classes[localSelector] = selectorMapping[localSelector];
    });
    return _extends({}, classes, styles);
  };
};
var important = function important(value) {
  return [value, '!important'];
};
var c = classnames;

var useFileBrowserHandle = function useFileBrowserHandle(ref) {
  var store = useStore();
  var dispatch = useDispatch();
  useImperativeHandle(ref, function () {
    return {
      getFileSelection: function getFileSelection() {
        var selectionMap = selectSelectionMap(store.getState());
        var selectionSet = new Set(Object.keys(selectionMap));
        return selectionSet;
      },
      setFileSelection: function setFileSelection(selection, reset) {
        if (reset === void 0) {
          reset = true;
        }

        var fileIds = Array.from(selection);
        dispatch(reduxActions.selectFiles({
          fileIds: fileIds,
          reset: reset
        }));
      },
      requestFileAction: function requestFileAction(action, payload) {
        return Promise.resolve(dispatch(thunkRequestFileAction(action, payload))).then();
      }
    };
  }, [store, dispatch]);
};

/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */
var ChonkyBusinessLogicInner = /*#__PURE__*/React.memo( /*#__PURE__*/React.forwardRef(function (props, ref) {
  var _props$files;

  // ==== Update Redux state
  usePropReduxUpdate(reduxActions.setRawFiles, (_props$files = props.files) != null ? _props$files : initialRootState.rawFiles);
  usePropReduxUpdate(reduxActions.setRawFolderChain, props.folderChain);
  useDTE(thunkUpdateRawFileActions, getValueOrFallback(props.fileActions, defaultConfig.fileActions), getValueOrFallback(props.disableDefaultFileActions, defaultConfig.disableDefaultFileActions));
  useDTE(reduxActions.setExternalFileActionHandler, getValueOrFallback(props.onFileAction, defaultConfig.onFileAction));
  useDTE(reduxActions.setSelectionDisabled, getValueOrFallback(props.disableSelection, defaultConfig.disableSelection, 'boolean'));
  useDTE(thunkActivateSortAction, getValueOrFallback(props.defaultSortActionId, defaultConfig.defaultSortActionId));
  useDTE(thunkUpdateDefaultFileViewActionId, getValueOrFallback(props.defaultFileViewActionId, defaultConfig.defaultFileViewActionId, 'string'));
  useDTE(reduxActions.setThumbnailGenerator, getValueOrFallback(props.thumbnailGenerator, defaultConfig.thumbnailGenerator));
  useDTE(reduxActions.setDoubleClickDelay, getValueOrFallback(props.doubleClickDelay, defaultConfig.doubleClickDelay, 'number'));
  useDTE(reduxActions.setDisableDragAndDrop, getValueOrFallback(props.disableDragAndDrop, defaultConfig.disableDragAndDrop, 'boolean'));
  useDTE(reduxActions.setClearSelectionOnOutsideClick, getValueOrFallback(props.clearSelectionOnOutsideClick, defaultConfig.clearSelectionOnOutsideClick, 'boolean')); // ==== Setup the imperative handle for external use

  useFileBrowserHandle(ref);
  return null;
}));
ChonkyBusinessLogicInner.displayName = 'ChonkyBusinessLogicInner';
var ChonkyBusinessLogic = /*#__PURE__*/React.memo(ChonkyBusinessLogicInner);
ChonkyBusinessLogic.displayName = 'ChonkyBusinessLogic';

var useDndContextAvailable = function useDndContextAvailable() {
  var dndContext = useContext(DndContext);
  var dragDropManager = dndContext.dragDropManager;
  return !!dragDropManager;
};
var useDragIfAvailable = function useDragIfAvailable() {
  // This is an ugly hack to make `useDrag` not throw if a `DndContext` is not available.
  // See: https://github.com/react-dnd/react-dnd/issues/2212
  var dndContextAvailable = useDndContextAvailable();
  var mockHook = useCallback(function () {
    return [{}, function () {
      return null;
    }, function () {
      return null;
    }];
  }, []); // @ts-ignore

  var useHook = dndContextAvailable ? useDrag : mockHook;
  return useHook.apply(void 0, arguments);
};
var useDropIfAvailable = function useDropIfAvailable() {
  var dndContextAvailable = useDndContextAvailable();
  var mockHook = useCallback(function () {
    return [{}, function () {
      return null;
    }];
  }, []); // @ts-ignore

  var useHook = dndContextAvailable ? useDrop : mockHook;
  return useHook.apply(void 0, arguments);
};

var findClosestChonkyFileId = function findClosestChonkyFileId(element) {
  var fileEntryWrapperDiv = findElementAmongAncestors(element, function (element) {
    return element.tagName && element.tagName.toLowerCase() === 'div' && element.dataset && element.dataset.chonkyFileId;
  });
  return fileEntryWrapperDiv ? fileEntryWrapperDiv.dataset.chonkyFileId : null;
};
var useContextMenuTrigger = function useContextMenuTrigger() {
  var dispatch = useDispatch();
  var contextMenuMountedRef = useInstanceVariable(useSelector(selectContextMenuMounted));
  return useCallback(function (event) {
    // Use default browser context menu when Chonky context menu component
    // is not mounted.
    if (!contextMenuMountedRef.current) return; // Users can use Alt+Right Click to bring up browser's default
    // context menu instead of Chonky's context menu.

    if (event.altKey) return;
    event.preventDefault();
    var triggerFileId = findClosestChonkyFileId(event.target);
    dispatch(thunkRequestFileAction(ChonkyActions.OpenFileContextMenu, {
      clientX: event.clientX,
      clientY: event.clientY,
      triggerFileId: triggerFileId
    }));
  }, [contextMenuMountedRef, dispatch]);
};
var useContextMenuDismisser = function useContextMenuDismisser() {
  var dispatch = useDispatch();
  return useCallback(function () {
    return dispatch(reduxActions.hideContextMenu());
  }, [dispatch]);
};

var ChonkyDndFileEntryType = 'dnd-chonky-file-entry';

/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */
var layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%'
};

var getItemStyles = function getItemStyles(initialCursorOffset, initialFileOffset, currentFileOffset) {
  if (!initialCursorOffset || !initialFileOffset || !currentFileOffset) {
    return {
      display: 'none'
    };
  }

  var x = initialCursorOffset.x + (currentFileOffset.x - initialFileOffset.x);
  var y = initialCursorOffset.y + (currentFileOffset.y - initialFileOffset.y);
  var transform = "translate(" + x + "px, " + y + "px)";
  return {
    transform: transform,
    WebkitTransform: transform
  };
};

var DnDFileListDragLayer = function DnDFileListDragLayer() {
  var classes = useStyles();

  var _useDragLayer = useDragLayer(function (monitor) {
    return {
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      initialCursorOffset: monitor.getInitialClientOffset(),
      initialFileOffset: monitor.getInitialSourceClientOffset(),
      currentFileOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging()
    };
  }),
      itemType = _useDragLayer.itemType,
      item = _useDragLayer.item,
      initialCursorOffset = _useDragLayer.initialCursorOffset,
      initialFileOffset = _useDragLayer.initialFileOffset,
      currentFileOffset = _useDragLayer.currentFileOffset,
      isDragging = _useDragLayer.isDragging;

  if (!isDragging || itemType !== ChonkyDndFileEntryType || !item.payload) {
    return null;
  }

  var selectionSize = item.payload.selectedFiles.length;
  return React.createElement("div", {
    style: layerStyles
  }, React.createElement("div", {
    style: getItemStyles(initialCursorOffset, initialFileOffset, currentFileOffset)
  }, React.createElement("div", {
    className: classes.fileDragPreview
  }, React.createElement("b", null, item.payload.draggedFile.name), selectionSize > 1 && React.createElement(React.Fragment, null, ' and ', React.createElement("strong", null, selectionSize - 1, " other file", selectionSize - 1 !== 1 ? 's' : '')))));
};
var useStyles = /*#__PURE__*/makeGlobalChonkyStyles(function (theme) {
  return {
    fileDragPreview: {
      boxShadow: "2px 2px 5px " + theme.palette.divider,
      backgroundColor: theme.palette.background["default"],
      borderRadius: theme.dragLayer.borderRadius,
      fontSize: theme.fontSizes.rootPrimary,
      color: theme.palette.text.primary,
      padding: theme.dragLayer.padding,
      border: theme.dragLayer.border,
      display: 'inline-block'
    }
  };
});

/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */
var HotkeyListener = /*#__PURE__*/React.memo(function (props) {
  var fileActionId = props.fileActionId;
  var dispatch = useDispatch();
  var fileAction = useParamSelector(selectFileActionData, fileActionId);
  useEffect(function () {
    if (!fileAction || !fileAction.hotkeys || fileAction.hotkeys.length === 0) {
      return;
    }

    var hotkeysStr = fileAction.hotkeys.join(',');

    var hotkeyCallback = function hotkeyCallback(event) {
      event.preventDefault();
      dispatch(thunkRequestFileAction(fileAction, undefined));
    };

    hotkeys(hotkeysStr, hotkeyCallback);
    return function () {
      return hotkeys.unbind(hotkeysStr, hotkeyCallback);
    };
  }, [dispatch, fileAction]);
  return null;
});

/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */
var ChonkyPresentationLayer = function ChonkyPresentationLayer(_ref) {
  var children = _ref.children;
  var dispatch = useDispatch();
  var fileActionIds = useSelector(selectFileActionIds);
  var dndDisabled = useSelector(selectIsDnDDisabled);
  var clearSelectionOnOutsideClick = useSelector(selectClearSelectionOnOutsideClick); // Deal with clicks outside of Chonky

  var handleClickAway = useCallback(function (event) {
    if (!clearSelectionOnOutsideClick || elementIsInsideButton(event.target)) {
      // We only clear out the selection on outside click if the click target
      // was not a button. We don't want to clear out the selection when a
      // button is clicked because Chonky users might want to trigger some
      // selection-related action on that button click.
      return;
    }

    dispatch(reduxActions.clearSelection());
  }, [dispatch, clearSelectionOnOutsideClick]); // Generate necessary components

  var hotkeyListenerComponents = useMemo(function () {
    return fileActionIds.map(function (actionId) {
      return React.createElement(HotkeyListener, {
        key: "file-action-listener-" + actionId,
        fileActionId: actionId
      });
    });
  }, [fileActionIds]);
  var dndContextAvailable = useDndContextAvailable();
  var showContextMenu = useContextMenuTrigger();
  var classes = useStyles$1();
  return React.createElement(ClickAwayListener, {
    onClickAway: handleClickAway
  }, React.createElement(Box, {
    className: classes.chonkyRoot,
    onContextMenu: showContextMenu
  }, !dndDisabled && dndContextAvailable && React.createElement(DnDFileListDragLayer, null), hotkeyListenerComponents, children ? children : null));
};
var useStyles$1 = /*#__PURE__*/makeGlobalChonkyStyles(function (theme) {
  return {
    chonkyRoot: {
      backgroundColor: theme.palette.background.paper,
      border: "solid 1px " + theme.palette.divider,
      padding: theme.margins.rootLayoutMargin,
      fontSize: theme.fontSizes.rootPrimary,
      color: theme.palette.text.primary,
      touchAction: 'manipulation',
      fontFamily: 'sans-serif',
      flexDirection: 'column',
      boxSizing: 'border-box',
      textAlign: 'left',
      borderRadius: 4,
      display: 'flex',
      height: '100%',
      // Disabling select
      webkitTouchCallout: 'none',
      webkitUserSelect: 'none',
      mozUserSelect: 'none',
      msUserSelect: 'none',
      userSelect: 'none'
    }
  };
});

//     const whyDidYouRender = require('@welldone-software/why-did-you-render');
//     whyDidYouRender(React, {
//         trackAllPureComponents: true,
//     });
// }

var FileBrowser = /*#__PURE__*/React.forwardRef(function (props, ref) {
  var _ref;

  var instanceId = props.instanceId,
      iconComponent = props.iconComponent,
      children = props.children;
  var disableDragAndDrop = getValueOrFallback(props.disableDragAndDrop, defaultConfig.disableDragAndDrop, 'boolean');
  var disableDragAndDropProvider = getValueOrFallback(props.disableDragAndDropProvider, defaultConfig.disableDragAndDropProvider, 'boolean');
  var darkMode = getValueOrFallback(props.darkMode, defaultConfig.darkMode, 'boolean');
  var i18n = getValueOrFallback(props.i18n, defaultConfig.i18n);
  var formatters = useMemo(function () {
    return _extends({}, defaultFormatters, i18n == null ? void 0 : i18n.formatters);
  }, [i18n]);
  var chonkyInstanceId = useStaticValue(function () {
    return instanceId != null ? instanceId : shortid.generate();
  });
  var store = useChonkyStore(chonkyInstanceId);
  var isMobileBreakpoint = useIsMobileBreakpoint();
  var theme = useMemo(function () {
    var muiTheme = createMuiTheme({
      palette: {
        type: darkMode ? 'dark' : 'light'
      }
    });
    var theme = merge(lightTheme, darkMode ? darkThemeOverride : {});
    var combinedTheme = merge(muiTheme, merge(theme, props.customTheme ? props.customTheme : {}));
    return isMobileBreakpoint ? merge(combinedTheme, mobileThemeOverride) : combinedTheme;
  }, [darkMode, isMobileBreakpoint]);
  var chonkyComps = React.createElement(React.Fragment, null, React.createElement(ChonkyBusinessLogic, Object.assign({
    ref: ref
  }, props)), React.createElement(ChonkyPresentationLayer, null, children));
  return React.createElement(IntlProvider, Object.assign({
    locale: "en",
    defaultLocale: "en"
  }, i18n), React.createElement(ChonkyFormattersContext.Provider, {
    value: formatters
  }, React.createElement(Provider, {
    store: store
  }, React.createElement(ThemeProvider, {
    theme: theme
  }, React.createElement(ThemeProvider$1, {
    theme: theme
  }, React.createElement(ChonkyIconContext.Provider, {
    value: (_ref = iconComponent != null ? iconComponent : defaultConfig.iconComponent) != null ? _ref : ChonkyIconPlaceholder
  }, disableDragAndDrop || disableDragAndDropProvider ? chonkyComps : React.createElement(DndProvider, {
    backend: HTML5Backend
  }, chonkyComps)))))));
});
FileBrowser.displayName = 'FileBrowser';

var useFolderChainItems = function useFolderChainItems() {
  var folderChain = useSelector(selectFolderChain);
  var dispatch = useDispatch();
  var folderChainItems = useMemo(function () {
    var items = [];
    if (!folderChain) return items;

    var _loop = function _loop(i) {
      var file = folderChain[i];
      items.push({
        file: file,
        disabled: !file,
        onClick: !FileHelper.isOpenable(file) || i === folderChain.length - 1 ? undefined : function () {
          return dispatch(thunkRequestFileAction(ChonkyActions.OpenFiles, {
            targetFile: file,
            files: [file]
          }));
        }
      });
    };

    for (var i = 0; i < folderChain.length; ++i) {
      _loop(i);
    }

    return items;
  }, [dispatch, folderChain]);
  return folderChainItems;
};

var useFileDrag = function useFileDrag(file) {
  // Prepare the dnd payload
  var store = useStore();
  var fileRef = useInstanceVariable(file);
  var getDndStartPayload = useCallback(function () {
    var reduxState = store.getState();
    return {
      sourceInstanceId: selectInstanceId(reduxState),
      source: selectCurrentFolder(reduxState),
      // We force non-null type below because by convention, if drag & drop for
      // this file was possible, it must have been non-null.
      draggedFile: fileRef.current,
      selectedFiles: selectSelectedFiles(reduxState)
    };
  }, [store, fileRef]); // For drag source

  var dispatch = useDispatch();
  var canDrag = useCallback(function () {
    return FileHelper.isDraggable(fileRef.current);
  }, [fileRef]);
  var onDragStart = useCallback(function () {
    var item = {
      type: ChonkyDndFileEntryType,
      payload: getDndStartPayload()
    };
    dispatch(thunkRequestFileAction(ChonkyActions.StartDragNDrop, item.payload));
    return item;
  }, [dispatch, getDndStartPayload]);
  var onDragEnd = useCallback(function (item, monitor) {
    var dropResult = monitor.getDropResult();

    if (!FileHelper.isDraggable(item.payload.draggedFile) || !dropResult || !dropResult.dropTarget) {
      return;
    }

    dispatch(thunkRequestFileAction(ChonkyActions.EndDragNDrop, _extends({}, item.payload, {
      destination: dropResult.dropTarget,
      copy: dropResult.dropEffect === 'copy'
    })));
  }, [dispatch]); // Create refs for react-dnd hooks

  var item = useMemo(function () {
    return {
      type: ChonkyDndFileEntryType,
      // Payload is actually added in `onDragStart`
      payload: {}
    };
  }, []);
  var collect = useCallback(function (monitor) {
    return {
      isDragging: monitor.isDragging()
    };
  }, []);

  var _useDragIfAvailable = useDragIfAvailable({
    item: item,
    canDrag: canDrag,
    begin: onDragStart,
    // @ts-ignore
    end: onDragEnd,
    collect: collect
  }),
      dndIsDragging = _useDragIfAvailable[0].isDragging,
      drag = _useDragIfAvailable[1],
      preview = _useDragIfAvailable[2];

  useEffect(function () {
    // Set drag preview to an empty image because `DnDFileListDragLayer` will
    // provide its own preview.
    preview(getEmptyImage(), {
      captureDraggingState: true
    });
  }, [preview]);
  return {
    dndIsDragging: dndIsDragging,
    drag: drag
  };
};
var useFileDrop = function useFileDrop(_ref) {
  var file = _ref.file,
      forceDisableDrop = _ref.forceDisableDrop,
      includeChildrenDrops = _ref.includeChildrenDrops;
  var folderChainRef = useInstanceVariable(useSelector(selectFolderChain));
  var onDrop = useCallback(function (_item, monitor) {
    if (!monitor.canDrop()) return;
    var customDropResult = {
      dropTarget: file
    };
    return customDropResult;
  }, [file]);
  var canDrop = useCallback(function (item, monitor) {
    if (forceDisableDrop || !FileHelper.isDroppable(file) || !monitor.isOver({
      shallow: true
    }) && !includeChildrenDrops) {
      return false;
    }

    var _item$payload = item.payload,
        source = _item$payload.source,
        draggedFile = _item$payload.draggedFile,
        selectedFiles = _item$payload.selectedFiles; // We prevent folders from being dropped into themselves. We also prevent
    // any folder from current folder chain being moved - we can't move the
    // folder that we are currently in.

    var prohibitedFileIds = new Set();
    prohibitedFileIds.add(file.id);
    folderChainRef.current.map(function (folder) {
      if (folder) prohibitedFileIds.add(folder.id);
    });
    var movedFiles = [draggedFile].concat(selectedFiles);

    for (var _iterator = _createForOfIteratorHelperLoose(movedFiles), _step; !(_step = _iterator()).done;) {
      var currFile = _step.value;
      if (prohibitedFileIds.has(currFile.id)) return false;
    } // Finally, prohibit files from being moved into their parent folder
    // (which is a no-op).


    return file.id !== (source == null ? void 0 : source.id);
  }, [forceDisableDrop, file, includeChildrenDrops, folderChainRef]);
  var collect = useCallback(function (monitor) {
    return {
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({
        shallow: true
      }),
      canDrop: monitor.canDrop()
    };
  }, []);

  var _useDropIfAvailable = useDropIfAvailable({
    accept: ChonkyDndFileEntryType,
    drop: onDrop,
    canDrop: canDrop,
    collect: collect
  }),
      _useDropIfAvailable$ = _useDropIfAvailable[0],
      dndIsOver = _useDropIfAvailable$.isOver,
      dndIsOverCurrent = _useDropIfAvailable$.isOverCurrent,
      dndCanDrop = _useDropIfAvailable$.canDrop,
      drop = _useDropIfAvailable[1];

  return {
    dndIsOver: dndIsOver,
    dndIsOverCurrent: dndIsOverCurrent,
    dndCanDrop: dndCanDrop,
    drop: drop
  };
};
var useFileEntryDnD = function useFileEntryDnD(file) {
  var _useFileDrag = useFileDrag(file),
      dndIsDragging = _useFileDrag.dndIsDragging,
      drag = _useFileDrag.drag;

  var _useFileDrop = useFileDrop({
    file: file
  }),
      dndIsOver = _useFileDrop.dndIsOver,
      dndCanDrop = _useFileDrop.dndCanDrop,
      drop = _useFileDrop.drop;

  var dndState = useMemo(function () {
    return {
      dndIsDragging: dndIsDragging,
      dndIsOver: dndIsOver,
      dndCanDrop: dndCanDrop
    };
  }, [dndCanDrop, dndIsDragging, dndIsOver]);
  return {
    drop: drop,
    drag: drag,
    dndState: dndState
  };
};
var useDndHoverOpen = function useDndHoverOpen(file, dndState) {
  var dispatch = useDispatch();
  var currentFolderRef = useInstanceVariable(useSelector(selectCurrentFolder));
  useEffect(function () {
    var _currentFolderRef$cur;

    var timeout = null;

    if (dndState.dndIsOver && FileHelper.isDndOpenable(file) && file.id !== ((_currentFolderRef$cur = currentFolderRef.current) == null ? void 0 : _currentFolderRef$cur.id)) {
      timeout = setTimeout(function () {
        return dispatch(thunkRequestFileAction(EssentialActions.OpenFiles, {
          targetFile: file,
          files: [file]
        }));
      }, // TODO: Make this timeout configurable
      1500);
    }

    return function () {
      if (timeout) clearTimeout(timeout);
    };
  }, [dispatch, file, dndState.dndIsOver, currentFolderRef]);
};

/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

var getRandomInt = function getRandomInt(min, max) {
  return min + Math.floor(Math.random() * Math.floor(max - min));
};

var TextPlaceholder = /*#__PURE__*/React.memo(function (props) {
  var minLength = props.minLength,
      maxLength = props.maxLength;
  var placeholderLength = getRandomInt(minLength, maxLength);
  var whitespace = '&nbsp;'.repeat(placeholderLength);
  var classes = useStyles$2();
  return React.createElement("span", {
    className: classes.textPlaceholder,
    dangerouslySetInnerHTML: {
      __html: whitespace
    }
  });
});
var useStyles$2 = /*#__PURE__*/makeLocalChonkyStyles(function () {
  return {
    '@keyframes loading-placeholder': {
      '0%': {
        opacity: 0.2
      },
      '50%': {
        opacity: 0.4
      },
      '100%': {
        opacity: 0.2
      }
    },
    textPlaceholder: {
      animationName: '$loading-placeholder',
      animationIterationCount: 'infinite',
      animationTimingFunction: 'linear',
      animationDuration: '1.5s',
      backgroundColor: '#ccc',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      borderRadius: 4,
      maxWidth: '40%',
      minWidth: 20
    }
  };
});

var useFileEntryHtmlProps = function useFileEntryHtmlProps(file) {
  return useMemo(function () {
    var dataProps = {
      'data-test-id': 'file-entry',
      'data-chonky-file-id': file ? file.id : undefined
    };
    return _extends({
      role: 'listitem'
    }, dataProps);
  }, [file]);
};
var useFileEntryState = function useFileEntryState(file, selected, focused) {
  var iconData = useIconData(file);

  var _useThumbnailUrl = useThumbnailUrl(file),
      thumbnailUrl = _useThumbnailUrl.thumbnailUrl,
      thumbnailLoading = _useThumbnailUrl.thumbnailLoading;

  return useMemo(function () {
    var fileColor = thumbnailUrl ? ColorsDark[iconData.colorCode] : ColorsLight[iconData.colorCode];
    var iconSpin = thumbnailLoading || !file;
    var icon = thumbnailLoading ? ChonkyIconName.loading : iconData.icon;
    return {
      childrenCount: FileHelper.getChildrenCount(file),
      icon: file && file.icon !== undefined ? file.icon : icon,
      iconSpin: iconSpin,
      thumbnailUrl: thumbnailUrl,
      color: file && file.color !== undefined ? file.color : fileColor,
      selected: selected,
      focused: !!focused
    };
  }, [file, focused, iconData, selected, thumbnailLoading, thumbnailUrl]);
};
var useDndIcon = function useDndIcon(dndState) {
  var dndIconName = null;

  if (dndState.dndIsOver) {
    var showDropIcon = dndState.dndCanDrop;
    dndIconName = showDropIcon ? ChonkyIconName.dndCanDrop : ChonkyIconName.dndCannotDrop;
  } else if (dndState.dndIsDragging) {
    dndIconName = ChonkyIconName.dndDragging;
  }

  return dndIconName;
};
var useModifierIconComponents = function useModifierIconComponents(file) {
  var modifierIcons = useMemo(function () {
    var modifierIcons = [];
    if (FileHelper.isHidden(file)) modifierIcons.push(ChonkyIconName.hidden);
    if (FileHelper.isSymlink(file)) modifierIcons.push(ChonkyIconName.symlink);
    if (FileHelper.isEncrypted(file)) modifierIcons.push(ChonkyIconName.lock);
    return modifierIcons;
  }, [file]);
  var ChonkyIcon = useContext(ChonkyIconContext);
  var modifierIconComponents = useMemo(function () {
    return modifierIcons.map(function (icon, index) {
      return React.createElement(ChonkyIcon, {
        key: "file-modifier-" + index,
        icon: icon
      });
    });
  }, // For some reason ESLint marks `ChonkyIcon` as an unnecessary dependency,
  // but we expect it can change at runtime so we disable the check.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [ChonkyIcon, modifierIcons]);
  return modifierIconComponents;
};

var _extname = function _extname(fileName) {
  var parts = fileName.split('.');

  if (parts.length) {
    return "." + parts[parts.length - 1];
  }

  return '';
};

var useFileNameComponent = function useFileNameComponent(file) {
  return useMemo(function () {
    if (!file) return React.createElement(TextPlaceholder, {
      minLength: 15,
      maxLength: 20
    });
    var name;
    var extension = null;
    var isDir = FileHelper.isDirectory(file);

    if (isDir) {
      name = file.name;
    } else {
      var _file$ext;

      extension = (_file$ext = file.ext) != null ? _file$ext : _extname(file.name);
      name = file.name.substr(0, file.name.length - extension.length);
    }

    return React.createElement(React.Fragment, null, name, extension && React.createElement("span", {
      className: "chonky-file-entry-description-title-extension"
    }, extension));
  }, [file]);
};
var useThumbnailUrl = function useThumbnailUrl(file) {
  var thumbnailGenerator = useSelector(selectThumbnailGenerator);

  var _useState = useState(null),
      thumbnailUrl = _useState[0],
      setThumbnailUrl = _useState[1];

  var _useState2 = useState(false),
      thumbnailLoading = _useState2[0],
      setThumbnailLoading = _useState2[1];

  var loadingAttempts = useRef(0);
  useEffect(function () {
    var loadingCancelled = false;

    if (file) {
      if (thumbnailGenerator) {
        if (loadingAttempts.current === 0) {
          setThumbnailLoading(true);
        }

        loadingAttempts.current++;
        Promise.resolve().then(function () {
          return thumbnailGenerator(file);
        }).then(function (thumbnailUrl) {
          if (loadingCancelled) return;
          setThumbnailLoading(false);

          if (thumbnailUrl && typeof thumbnailUrl === 'string') {
            setThumbnailUrl(thumbnailUrl);
          }
        })["catch"](function (error) {
          if (!loadingCancelled) setThumbnailLoading(false);
          Logger.error("User-defined \"thumbnailGenerator\" handler threw an error: " + error.message);
        });
      } else if (file.thumbnailUrl) {
        setThumbnailUrl(file.thumbnailUrl);
      }
    }

    return function () {
      loadingCancelled = true;
    };
  }, [file, setThumbnailUrl, setThumbnailLoading, thumbnailGenerator]);
  return {
    thumbnailUrl: thumbnailUrl,
    thumbnailLoading: thumbnailLoading
  };
};
var useFileClickHandlers = function useFileClickHandlers(file, displayIndex) {
  var dispatch = useDispatch(); // Prepare base handlers

  var onMouseClick = useCallback(function (event, clickType) {
    if (!file) return;
    dispatch(thunkRequestFileAction(ChonkyActions.MouseClickFile, {
      clickType: clickType,
      file: file,
      fileDisplayIndex: displayIndex,
      altKey: event.altKey,
      ctrlKey: event.ctrlKey,
      shiftKey: event.shiftKey
    }));
  }, [dispatch, file, displayIndex]);
  var onKeyboardClick = useCallback(function (event) {
    if (!file) return;
    dispatch(thunkRequestFileAction(ChonkyActions.KeyboardClickFile, {
      file: file,
      fileDisplayIndex: displayIndex,
      enterKey: event.enterKey,
      spaceKey: event.spaceKey,
      altKey: event.altKey,
      ctrlKey: event.ctrlKey,
      shiftKey: event.shiftKey
    }));
  }, [dispatch, file, displayIndex]); // Prepare single/double click handlers

  var onSingleClick = useCallback(function (event) {
    return onMouseClick(event, 'single');
  }, [onMouseClick]);
  var onDoubleClick = useCallback(function (event) {
    return onMouseClick(event, 'double');
  }, [onMouseClick]);
  return {
    onSingleClick: onSingleClick,
    onDoubleClick: onDoubleClick,
    onKeyboardClick: onKeyboardClick
  };
};

var CustomVisibilityState;

(function (CustomVisibilityState) {
  CustomVisibilityState[CustomVisibilityState["Hidden"] = 0] = "Hidden";
  CustomVisibilityState[CustomVisibilityState["Disabled"] = 1] = "Disabled";
  CustomVisibilityState[CustomVisibilityState["Default"] = 2] = "Default";
  CustomVisibilityState[CustomVisibilityState["Active"] = 3] = "Active";
})(CustomVisibilityState || (CustomVisibilityState = {}));

var useFileActionTrigger = function useFileActionTrigger(fileActionId) {
  var dispatch = useDispatch();
  var fileAction = useParamSelector(selectFileActionData, fileActionId);
  return useCallback(function () {
    return dispatch(thunkRequestFileAction(fileAction, undefined));
  }, [dispatch, fileAction]);
};
var useFileActionProps = function useFileActionProps(fileActionId) {
  var _action$option;

  var parentFolder = useSelector(selectParentFolder);
  var fileViewConfig = useSelector(selectFileViewConfig);
  var sortActionId = useSelector(selectSortActionId);
  var sortOrder = useSelector(selectSortOrder);
  var action = useParamSelector(selectFileActionData, fileActionId); // @ts-ignore

  var optionValue = useParamSelector(selectOptionValue, action == null ? void 0 : (_action$option = action.option) == null ? void 0 : _action$option.id);
  var actionSelectionSize = useParamSelector(selectSelectedFilesForActionCount, fileActionId);
  var actionSelectionEmpty = actionSelectionSize === 0;
  return useMemo(function () {
    var _action$button$icon, _action$button;

    if (!action) return {
      icon: null,
      active: false,
      disabled: true
    };
    var icon = (_action$button$icon = (_action$button = action.button) == null ? void 0 : _action$button.icon) != null ? _action$button$icon : null;

    if (action.sortKeySelector) {
      if (sortActionId === action.id) {
        if (sortOrder === SortOrder.ASC) {
          icon = ChonkyIconName.sortAsc;
        } else {
          icon = ChonkyIconName.sortDesc;
        }
      } else {
        icon = ChonkyIconName.placeholder;
      }
    } else if (action.option) {
      if (optionValue) {
        icon = ChonkyIconName.toggleOn;
      } else {
        icon = ChonkyIconName.toggleOff;
      }
    }

    var isSortButtonAndCurrentSort = action.id === sortActionId;
    var isFileViewButtonAndCurrentView = action.fileViewConfig === fileViewConfig;
    var isOptionAndEnabled = action.option ? !!optionValue : false;
    var customDisabled = false;
    var customActive = false;

    if (action.customVisibility !== undefined) {
      customDisabled = action.customVisibility() === CustomVisibilityState.Disabled;
      customActive = action.customVisibility() === CustomVisibilityState.Active;
    }

    var active = isSortButtonAndCurrentSort || isFileViewButtonAndCurrentView || isOptionAndEnabled || customActive;
    var disabled = !!action.requiresSelection && actionSelectionEmpty || customDisabled;

    if (action.id === ChonkyActions.OpenParentFolder.id) {
      // We treat `open_parent_folder` file action as a special case as it
      // requires the parent folder to be present to work...
      disabled = disabled || !FileHelper.isOpenable(parentFolder);
    }

    return {
      icon: icon,
      active: active,
      disabled: disabled
    };
  }, [parentFolder, fileViewConfig, sortActionId, sortOrder, action, optionValue, actionSelectionEmpty]);
};

/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */
var ToolbarButton = /*#__PURE__*/React.memo(function (props) {
  var _c;

  var externalClassName = props.className,
      text = props.text,
      tooltip = props.tooltip,
      active = props.active,
      icon = props.icon,
      iconOnly = props.iconOnly,
      onClick = props.onClick,
      disabled = props.disabled,
      dropdown = props.dropdown;
  var classes = useStyles$3();
  var ChonkyIcon = useContext(ChonkyIconContext);
  var iconComponent = icon || iconOnly ? React.createElement("div", {
    className: iconOnly ? '' : classes.iconWithText
  }, React.createElement(ChonkyIcon, {
    icon: icon ? icon : ChonkyIconName.fallbackIcon,
    fixedWidth: true
  })) : null;
  var className = c((_c = {}, _c[externalClassName != null ? externalClassName : ''] = true, _c[classes.baseButton] = true, _c[classes.iconOnlyButton] = iconOnly, _c[classes.activeButton] = !!active, _c));
  return React.createElement(Button, {
    className: className,
    onClick: onClick,
    title: tooltip ? tooltip : text,
    disabled: disabled || !onClick
  }, iconComponent, text && !iconOnly && React.createElement("span", null, text), dropdown && React.createElement("div", {
    className: classes.iconDropdown
  }, React.createElement(ChonkyIcon, {
    icon: icon ? icon : ChonkyIconName.dropdown,
    fixedWidth: true
  })));
});
var useStyles$3 = /*#__PURE__*/makeGlobalChonkyStyles(function (theme) {
  return {
    baseButton: {
      fontSize: important(theme.toolbar.fontSize),
      textTransform: important('none'),
      letterSpacing: important(0),
      minWidth: important('auto'),
      lineHeight: theme.toolbar.lineHeight,
      height: theme.toolbar.size,
      paddingBottom: important(0),
      paddingTop: important(0)
    },
    iconWithText: {
      marginRight: 8
    },
    iconOnlyButton: {
      width: theme.toolbar.size,
      textAlign: 'center'
    },
    iconDropdown: {
      fontSize: '0.7em',
      marginLeft: 2,
      marginTop: 1
    },
    activeButton: {
      color: important(theme.colors.textActive)
    }
  };
});
var SmartToolbarButton = /*#__PURE__*/React.memo(function (props) {
  var fileActionId = props.fileActionId;
  var action = useParamSelector(selectFileActionData, fileActionId);
  var triggerAction = useFileActionTrigger(fileActionId);

  var _useFileActionProps = useFileActionProps(fileActionId),
      icon = _useFileActionProps.icon,
      active = _useFileActionProps.active,
      disabled = _useFileActionProps.disabled;

  var _useLocalizedFileActi = useLocalizedFileActionStrings(action),
      buttonName = _useLocalizedFileActi.buttonName,
      buttonTooltip = _useLocalizedFileActi.buttonTooltip;

  if (!action) return null;
  var button = action.button;
  if (!button) return null;
  if (action.customVisibility !== undefined && action.customVisibility() === CustomVisibilityState.Hidden) return null;
  return React.createElement(ToolbarButton, {
    text: buttonName,
    tooltip: buttonTooltip,
    icon: icon,
    iconOnly: button.iconOnly,
    active: active,
    onClick: triggerAction,
    disabled: disabled
  });
});

/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */
var FolderChainButton = /*#__PURE__*/React.memo(function (_ref) {
  var _c;

  var first = _ref.first,
      current = _ref.current,
      item = _ref.item;
  var file = item.file,
      disabled = item.disabled,
      onClick = item.onClick;

  var _useFileDrop = useFileDrop({
    file: file,
    forceDisableDrop: !file || current
  }),
      dndIsOver = _useFileDrop.dndIsOver,
      dndCanDrop = _useFileDrop.dndCanDrop,
      drop = _useFileDrop.drop;

  var dndState = useMemo(function () {
    return {
      dndIsOver: dndIsOver,
      dndCanDrop: dndCanDrop,
      dndIsDragging: false
    };
  }, [dndCanDrop, dndIsOver]);
  useDndHoverOpen(file, dndState);
  var dndIconName = useDndIcon(dndState);
  var ChonkyIcon = useContext(ChonkyIconContext);
  var classes = useStyles$4(dndState);
  var className = c((_c = {}, _c[classes.baseBreadcrumb] = true, _c[classes.disabledBreadcrumb] = disabled, _c[classes.currentBreadcrumb] = current, _c));
  var text = file ? file.name : 'Loading...';
  var icon = first && (file == null ? void 0 : file.folderChainIcon) === undefined ? ChonkyIconName.folder : file == null ? void 0 : file.folderChainIcon;
  return React.createElement("div", {
    className: classes.buttonContainer,
    ref: file ? drop : null
  }, file && dndIconName && React.createElement("div", {
    className: classes.dndIndicator
  }, React.createElement(ChonkyIcon, {
    icon: dndIconName,
    fixedWidth: true
  })), React.createElement(ToolbarButton, {
    icon: icon,
    className: className,
    text: text,
    disabled: disabled,
    onClick: onClick
  }));
});
var useStyles$4 = /*#__PURE__*/makeLocalChonkyStyles(function (theme) {
  return {
    buttonContainer: {
      position: 'relative'
    },
    baseBreadcrumb: {
      color: function color(dndState) {
        var color = theme.palette.text.primary;

        if (dndState.dndIsOver) {
          color = dndState.dndCanDrop ? theme.dnd.canDropColor : theme.dnd.cannotDropColor;
        }

        return important(color);
      }
    },
    disabledBreadcrumb: {
      // Constant function here is on purpose. Without the function, the color here
      // does not override the `baseBreadcrumb` color from above.
      color: function color() {
        return important(theme.palette.text.disabled);
      }
    },
    currentBreadcrumb: {
      textDecoration: important('underline')
    },
    dndIndicator: {
      color: function color(dndState) {
        return dndState.dndCanDrop ? theme.dnd.canDropColor : theme.dnd.cannotDropColor;
      },
      backgroundColor: function backgroundColor(dndState) {
        return dndState.dndCanDrop ? theme.dnd.canDropMask : theme.dnd.cannotDropMask;
      },
      lineHeight: "calc(" + theme.toolbar.lineHeight + " - 6px)",
      transform: 'translateX(-50%) translateY(-50%)',
      borderRadius: theme.toolbar.buttonRadius,
      height: theme.toolbar.size - 6,
      width: theme.toolbar.size - 6,
      boxSizing: 'border-box',
      position: 'absolute',
      textAlign: 'center',
      left: '50%',
      top: '50%',
      zIndex: 5
    }
  };
});

/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */
var FileNavbar = /*#__PURE__*/React.memo(function () {
  var classes = useStyles$5();
  var folderChainItems = useFolderChainItems();
  var folderChainComponents = useMemo(function () {
    var components = [];

    for (var i = 0; i < folderChainItems.length; ++i) {
      var key = "folder-chain-" + i;
      var component = React.createElement(FolderChainButton, {
        key: key,
        first: i === 0,
        current: i === folderChainItems.length - 1,
        item: folderChainItems[i]
      });
      components.push(component);
    }

    return components;
  }, [folderChainItems]);
  return React.createElement(Box, {
    className: classes.navbarWrapper
  }, React.createElement(Box, {
    className: classes.navbarContainer
  }, React.createElement(SmartToolbarButton, {
    fileActionId: ChonkyActions.OpenParentFolder.id
  }), React.createElement(Breadcrumbs, {
    className: classes.navbarBreadcrumbs,
    classes: {
      separator: classes.separator
    }
  }, folderChainComponents)));
});
var useStyles$5 = /*#__PURE__*/makeGlobalChonkyStyles(function (theme) {
  return {
    navbarWrapper: {
      paddingBottom: theme.margins.rootLayoutMargin
    },
    navbarContainer: {
      display: 'flex'
    },
    upDirectoryButton: {
      fontSize: important(theme.toolbar.fontSize),
      height: theme.toolbar.size,
      width: theme.toolbar.size,
      padding: '0px !important'
    },
    navbarBreadcrumbs: {
      fontSize: important(theme.toolbar.fontSize),
      flexGrow: 100
    },
    separator: {
      marginRight: important(4),
      marginLeft: important(4)
    }
  };
});

/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */
var ToolbarDropdownButton = /*#__PURE__*/React.forwardRef(function (props, ref) {
  var _c;

  var text = props.text,
      active = props.active,
      icon = props.icon,
      onClick = props.onClick,
      disabled = props.disabled;
  var classes = useStyles$6();
  var ChonkyIcon = useContext(ChonkyIconContext);
  var className = c((_c = {}, _c[classes.baseButton] = true, _c[classes.activeButton] = active, _c));
  return React.createElement(MenuItem, {
    ref: ref,
    className: className,
    onClick: onClick,
    disabled: disabled
  }, icon && React.createElement(ListItemIcon, {
    className: classes.icon
  }, React.createElement(ChonkyIcon, {
    icon: icon,
    fixedWidth: true
  })), React.createElement(ListItemText, {
    primaryTypographyProps: {
      className: classes.text
    }
  }, text));
});
var useStyles$6 = /*#__PURE__*/makeGlobalChonkyStyles(function (theme) {
  return {
    baseButton: {
      lineHeight: important(theme.toolbar.lineHeight),
      height: important(theme.toolbar.size),
      minHeight: important('auto'),
      minWidth: important('auto'),
      padding: important(20)
    },
    icon: {
      fontSize: important(theme.toolbar.fontSize),
      minWidth: important('auto'),
      color: important('inherit'),
      marginRight: 8
    },
    text: {
      fontSize: important(theme.toolbar.fontSize)
    },
    activeButton: {
      color: important(theme.colors.textActive)
    }
  };
});
var SmartToolbarDropdownButton = /*#__PURE__*/React.forwardRef(function (props, ref) {
  var fileActionId = props.fileActionId,
      onClickFollowUp = props.onClickFollowUp;
  var action = useParamSelector(selectFileActionData, fileActionId);
  var triggerAction = useFileActionTrigger(fileActionId);

  var _useFileActionProps = useFileActionProps(fileActionId),
      icon = _useFileActionProps.icon,
      active = _useFileActionProps.active,
      disabled = _useFileActionProps.disabled;

  var _useLocalizedFileActi = useLocalizedFileActionStrings(action),
      buttonName = _useLocalizedFileActi.buttonName; // Combine external click handler with internal one


  var handleClick = useCallback(function () {
    triggerAction();
    if (onClickFollowUp) onClickFollowUp();
  }, [onClickFollowUp, triggerAction]);
  if (!action) return null;
  var button = action.button;
  if (!button) return null;
  if (action.customVisibility !== undefined && action.customVisibility() === CustomVisibilityState.Hidden) return null;
  return React.createElement(ToolbarDropdownButton, {
    ref: ref,
    text: buttonName,
    icon: icon,
    onClick: handleClick,
    active: active,
    disabled: disabled
  });
});

/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */
var ToolbarDropdown = /*#__PURE__*/React.memo(function (props) {
  var name = props.name,
      fileActionIds = props.fileActionIds;

  var _React$useState = React.useState(null),
      anchor = _React$useState[0],
      setAnchor = _React$useState[1];

  var handleClick = useCallback(function (event) {
    return setAnchor(event.currentTarget);
  }, [setAnchor]);
  var handleClose = useCallback(function () {
    return setAnchor(null);
  }, [setAnchor]);
  var menuItemComponents = useMemo(function () {
    return fileActionIds.map(function (id) {
      return React.createElement(SmartToolbarDropdownButton, {
        key: "menu-item-" + id,
        fileActionId: id,
        onClickFollowUp: handleClose
      });
    });
  }, [fileActionIds, handleClose]);
  var localizedName = useLocalizedFileActionGroup(name);
  var classes = useStyles$7();
  return React.createElement(React.Fragment, null, React.createElement(ToolbarButton, {
    text: localizedName,
    onClick: handleClick,
    dropdown: true
  }), React.createElement(Menu, {
    autoFocus: true,
    keepMounted: true,
    elevation: 2,
    anchorEl: anchor,
    onClose: handleClose,
    open: Boolean(anchor),
    transitionDuration: 150,
    classes: {
      list: classes.dropdownList
    }
  }, menuItemComponents));
});
var useStyles$7 = /*#__PURE__*/makeGlobalChonkyStyles(function () {
  return {
    dropdownList: {
      paddingBottom: important(0),
      paddingTop: important(0)
    }
  };
});

/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */
var ToolbarInfo = /*#__PURE__*/React.memo(function () {
  var classes = useStyles$8();
  var displayFileIds = useSelector(selectors.getDisplayFileIds);
  var selectionSize = useSelector(selectSelectionSize);
  var hiddenCount = useSelector(selectHiddenFileCount);
  var intl = useIntl();
  var fileCountString = intl.formatMessage({
    id: getI18nId(I18nNamespace.Toolbar, 'visibleFileCount'),
    defaultMessage: "{fileCount, plural,\n                =0 {# items}\n                one {# item}\n                other {# items}\n            }"
  }, {
    fileCount: displayFileIds.length
  });
  var selectedString = intl.formatMessage({
    id: getI18nId(I18nNamespace.Toolbar, 'selectedFileCount'),
    defaultMessage: "{fileCount, plural,\n                =0 {}\n                other {# selected}\n            }"
  }, {
    fileCount: selectionSize
  });
  var hiddenString = intl.formatMessage({
    id: getI18nId(I18nNamespace.Toolbar, 'hiddenFileCount'),
    defaultMessage: "{fileCount, plural,\n                =0 {}\n                other {# hidden}\n            }"
  }, {
    fileCount: hiddenCount
  });
  return React.createElement("div", {
    className: classes.infoContainer
  }, React.createElement(Typography, {
    className: classes.infoText,
    variant: "body1"
  }, fileCountString, (selectedString || hiddenString) && React.createElement("span", {
    className: classes.extraInfoSpan
  }, "(", React.createElement("span", {
    className: classes.selectionSizeText
  }, selectedString), selectedString && hiddenString && ', ', React.createElement("span", {
    className: classes.hiddenCountText
  }, hiddenString), ")")));
});
var useStyles$8 = /*#__PURE__*/makeGlobalChonkyStyles(function (theme) {
  return {
    infoContainer: {
      height: theme.toolbar.size,
      display: 'flex'
    },
    infoText: {
      lineHeight: important(theme.toolbar.lineHeight),
      fontSize: important(theme.toolbar.fontSize),
      marginLeft: important(12),
      height: theme.toolbar.size
    },
    extraInfoSpan: {
      marginRight: important(8),
      marginLeft: important(8),
      opacity: 0.8
    },
    selectionSizeText: {
      color: theme.colors.textActive
    },
    hiddenCountText: {}
  };
});

/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */
var ToolbarSearch = /*#__PURE__*/React.memo(function () {
  var intl = useIntl();
  var searchPlaceholderString = intl.formatMessage({
    id: getI18nId(I18nNamespace.Toolbar, 'searchPlaceholder'),
    defaultMessage: 'Search'
  });
  var classes = useStyles$9();
  var ChonkyIcon = useContext(ChonkyIconContext);
  var searchInputRef = useRef();
  var dispatch = useDispatch();
  var reduxSearchString = useSelector(selectSearchString);

  var _useState = useState(reduxSearchString),
      localSearchString = _useState[0],
      setLocalSearchString = _useState[1];

  var _useDebounce = useDebounce(localSearchString, 300),
      debouncedLocalSearchString = _useDebounce[0];

  var _useState2 = useState(false),
      showLoadingIndicator = _useState2[0],
      setShowLoadingIndicator = _useState2[1];

  useEffect(function () {
    dispatch(reduxActions.setFocusSearchInput(function () {
      if (searchInputRef.current) searchInputRef.current.focus();
    }));
    return function () {
      dispatch(reduxActions.setFocusSearchInput(null));
    };
  }, [dispatch]);
  useEffect(function () {
    setShowLoadingIndicator(false);
    dispatch(reduxActions.setSearchString(debouncedLocalSearchString));
  }, [debouncedLocalSearchString, dispatch]);
  var handleChange = useCallback(function (event) {
    setShowLoadingIndicator(true);
    setLocalSearchString(event.currentTarget.value);
  }, []);
  var handleKeyUp = useCallback(function (event) {
    // Remove focus from the search input field when user presses escape.
    // Note: We use KeyUp instead of KeyPress because some browser plugins can
    //       intercept KeyPress events with Escape key.
    //       @see https://stackoverflow.com/a/37461974
    if (event.key === 'Escape') {
      setLocalSearchString('');
      dispatch(reduxActions.setSearchString(''));
      if (searchInputRef.current) searchInputRef.current.blur();
    }
  }, [dispatch]);
  return React.createElement(TextField, {
    className: classes.searchFieldContainer,
    size: "small",
    variant: "outlined",
    value: localSearchString,
    placeholder: searchPlaceholderString,
    onChange: handleChange,
    inputRef: searchInputRef,
    InputProps: {
      onKeyUp: handleKeyUp,
      startAdornment: React.createElement(InputAdornment, {
        className: classes.searchIcon,
        position: "start"
      }, React.createElement(ChonkyIcon, {
        icon: showLoadingIndicator ? ChonkyIconName.loading : ChonkyIconName.search,
        spin: showLoadingIndicator
      })),
      className: classes.searchFieldInput
    },
    inputProps: {
      className: classes.searchFieldInputInner
    }
  });
});
var useStyles$9 = /*#__PURE__*/makeGlobalChonkyStyles(function (theme) {
  return {
    searchFieldContainer: {
      height: theme.toolbar.size,
      width: 150
    },
    searchIcon: {
      fontSize: '0.9em',
      opacity: 0.75
    },
    searchFieldInput: {
      lineHeight: important(0),
      padding: important(0),
      margin: important(0),
      fontSize: important(theme.toolbar.fontSize),
      borderRadius: theme.toolbar.buttonRadius,
      height: theme.toolbar.size - 4,
      paddingLeft: important(8),
      marginTop: 2
    },
    searchFieldInputInner: {
      lineHeight: important(theme.toolbar.size - 4 + "px"),
      fontSize: important(theme.toolbar.fontSize),
      height: important(theme.toolbar.size - 4),
      padding: important([0, 8, 0, 0]),
      margin: important(0),
      '-webkit-appearance': 'none'
    }
  };
});

var FileToolbar = /*#__PURE__*/React.memo(function () {
  var classes = useStyles$a();
  var toolbarItems = useSelector(selectToolbarItems);
  var toolbarItemComponents = useMemo(function () {
    var components = [];

    for (var i = 0; i < toolbarItems.length; ++i) {
      var item = toolbarItems[i];
      var key = "toolbar-item-" + (typeof item === 'string' ? item : item.name);
      var component = typeof item === 'string' ? React.createElement(SmartToolbarButton, {
        key: key,
        fileActionId: item
      }) : React.createElement(ToolbarDropdown, {
        key: key,
        name: item.name,
        fileActionIds: item.fileActionIds
      });
      components.push(component);
    }

    return components;
  }, [toolbarItems]);
  return React.createElement("div", {
    className: classes.toolbarWrapper
  }, React.createElement("div", {
    className: classes.toolbarContainer
  }, React.createElement("div", {
    className: classes.toolbarLeft
  }, React.createElement(ToolbarSearch, null), React.createElement(ToolbarInfo, null)), React.createElement("div", {
    className: classes.toolbarRight
  }, toolbarItemComponents)));
});
var useStyles$a = /*#__PURE__*/makeGlobalChonkyStyles(function (theme) {
  return {
    toolbarWrapper: {},
    toolbarContainer: {
      flexWrap: 'wrap-reverse',
      display: 'flex'
    },
    toolbarLeft: {
      paddingBottom: theme.margins.rootLayoutMargin,
      flexWrap: 'nowrap',
      flexGrow: 10000,
      display: 'flex'
    },
    toolbarLeftFiller: {
      flexGrow: 10000
    },
    toolbarRight: {
      paddingBottom: theme.margins.rootLayoutMargin,
      flexWrap: 'nowrap',
      display: 'flex'
    }
  };
});

/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */
var FileListEmpty = function FileListEmpty(props) {
  var width = props.width,
      height = props.height;
  var classes = useStyles$b();
  var ChonkyIcon = useContext(ChonkyIconContext);
  var style = {
    width: width,
    height: height
  };
  var intl = useIntl();
  var emptyString = intl.formatMessage({
    id: getI18nId(I18nNamespace.FileList, 'nothingToShow'),
    defaultMessage: 'Nothing to show'
  });
  return React.createElement("div", {
    className: classes.fileListEmpty,
    style: style
  }, React.createElement("div", {
    className: classes.fileListEmptyContent
  }, React.createElement(ChonkyIcon, {
    icon: ChonkyIconName.folderOpen
  }), "\xA0 ", emptyString));
};
var useStyles$b = /*#__PURE__*/makeGlobalChonkyStyles(function (theme) {
  return {
    fileListEmpty: {
      color: theme.palette.text.disabled,
      position: 'relative',
      textAlign: 'center',
      fontSize: '1.2em'
    },
    fileListEmptyContent: {
      transform: 'translateX(-50%) translateY(-50%)',
      position: 'absolute',
      left: '50%',
      top: '50%'
    }
  };
});

/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */
var useClickHandler = function useClickHandler(onSingleClick, onDoubleClick) {
  var doubleClickDelay = useSelector(selectDoubleClickDelay);
  var counter = useRef({
    clickCount: 0,
    clickTimeout: null
  });
  return useCallback(function (event) {
    var mouseClickEvent = {
      altKey: event.altKey,
      ctrlKey: event.ctrlKey || event.metaKey,
      shiftKey: event.shiftKey
    };
    counter.current.clickCount++;

    if (counter.current.clickCount === 1) {
      if (onSingleClick) {
        event.preventDefault();
        onSingleClick(mouseClickEvent);
      }

      counter.current.clickCount = 1; // @ts-ignore

      counter.current.clickTimeout = setTimeout(function () {
        return counter.current.clickCount = 0;
      }, doubleClickDelay);
    } else if (counter.current.clickCount === 2) {
      if (onDoubleClick) {
        event.preventDefault();
        onDoubleClick(mouseClickEvent);
      }

      if (typeof counter.current.clickTimeout === 'number') {
        clearTimeout(counter.current.clickTimeout);
        counter.current.clickTimeout = null;
        counter.current.clickCount = 0;
      }
    }
  }, [doubleClickDelay, onSingleClick, onDoubleClick, counter]);
};
var useKeyDownHandler = function useKeyDownHandler(onKeyboardClick) {
  return useCallback(function (event) {
    if (!onKeyboardClick) return;
    var keyboardClickEvent = {
      enterKey: event.nativeEvent.code === 'Enter',
      spaceKey: event.nativeEvent.code === 'Space',
      altKey: event.altKey,
      ctrlKey: event.ctrlKey,
      shiftKey: event.shiftKey
    };

    if (keyboardClickEvent.spaceKey || keyboardClickEvent.enterKey) {
      event.preventDefault();
      event.stopPropagation();
      onKeyboardClick(keyboardClickEvent);
    }
  }, [onKeyboardClick]);
};

var ClickableWrapper = function ClickableWrapper(props) {
  var children = props.children,
      WrapperTag = props.wrapperTag,
      passthroughProps = props.passthroughProps,
      onSingleClick = props.onSingleClick,
      onDoubleClick = props.onDoubleClick,
      onKeyboardClick = props.onKeyboardClick,
      setFocused = props.setFocused;
  var handleClick = useClickHandler(onSingleClick, onDoubleClick);
  var handleKeyDown = useKeyDownHandler(onKeyboardClick);
  var compProps = {
    onFocus: useCallback(function () {
      return setFocused && setFocused(true);
    }, [setFocused]),
    onBlur: useCallback(function () {
      return setFocused && setFocused(false);
    }, [setFocused])
  };

  if (onSingleClick || onDoubleClick || onKeyboardClick) {
    compProps.onClick = handleClick;
    compProps.onKeyDown = handleKeyDown;
    compProps.tabIndex = 0;
  }

  var mergedProps = _extends({}, compProps, passthroughProps);

  return React.createElement(WrapperTag, Object.assign({}, mergedProps), children);
};

/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */
var FileEntryName = /*#__PURE__*/React.memo(function (_ref) {
  var file = _ref.file,
      className = _ref.className;
  var modifierIconComponents = useModifierIconComponents(file);
  var fileNameComponent = useFileNameComponent(file);
  var classes = useStyles$c();
  return React.createElement("span", {
    className: className,
    title: file ? file.name : undefined
  }, modifierIconComponents.length > 0 && React.createElement("span", {
    className: classes.modifierIcons
  }, modifierIconComponents), fileNameComponent);
});
FileEntryName.displayName = 'FileEntryName';
var useStyles$c = /*#__PURE__*/makeLocalChonkyStyles(function (theme) {
  return {
    modifierIcons: {
      color: theme.palette.text.hint,
      position: 'relative',
      fontSize: '0.775em',
      paddingRight: 5
    }
  };
});

var CompactEntry = /*#__PURE__*/React.memo( // @ts-ignore
function (_ref) {
  var file = _ref.file,
      selected = _ref.selected,
      focused = _ref.focused;
  var entryState = useFileEntryState(file, selected, focused);

  var _useLocalizedFileEntr = useLocalizedFileEntryStrings(file),
      fileModDateString = _useLocalizedFileEntr.fileModDateString,
      fileSizeString = _useLocalizedFileEntr.fileSizeString;

  var classes = useStyles$d(entryState);
  var ChonkyIcon = useContext(ChonkyIconContext);
  var fileEntryHtmlProps = useFileEntryHtmlProps(file);
  return React.createElement("div", Object.assign({
    className: classes.listFileEntry
  }, fileEntryHtmlProps), React.createElement("div", {
    className: classes.listFileEntryIcon
  }, React.createElement(ChonkyIcon, {
    icon: entryState.icon,
    spin: entryState.iconSpin,
    fixedWidth: true
  })), React.createElement("div", {
    className: classes.listFileEntryDescription
  }, React.createElement("div", {
    className: classes.listFileEntryName,
    title: file ? file.name : undefined
  }, React.createElement(FileEntryName, {
    file: file
  })), React.createElement("div", {
    className: classes.listFileEntryProperties
  }, React.createElement("div", {
    className: classes.listFileEntryProperty
  }, file ? fileModDateString != null ? fileModDateString : React.createElement("span", null, "\u2014") : React.createElement(TextPlaceholder, {
    minLength: 5,
    maxLength: 15
  })), React.createElement("div", {
    className: classes.listFileEntryProperty
  }, file ? fileSizeString != null ? fileSizeString : React.createElement("span", null, "\u2014") : React.createElement(TextPlaceholder, {
    minLength: 10,
    maxLength: 20
  })))), React.createElement("div", {
    className: "chonky-file-entry-outline"
  }), React.createElement("div", {
    className: "chonky-file-entry-selection"
  }));
});
var useStyles$d = /*#__PURE__*/makeLocalChonkyStyles(function (theme) {
  return {
    listFileEntry: {
      fontSize: theme.listFileEntry.fontSize,
      alignItems: 'center',
      position: 'relative',
      display: 'flex',
      height: '100%'
    },
    listFileEntryIcon: {
      backgroundColor: function backgroundColor(state) {
        return state.color;
      },
      boxShadow: 'inset rgba(255, 255, 255, 0.5) 0 0 0 999px',
      borderRadius: theme.listFileEntry.iconBorderRadius,
      fontSize: theme.listFileEntry.iconFontSize,
      color: '#fff',
      padding: 8
    },
    listFileEntryDescription: {
      flexDirection: 'column',
      display: 'flex',
      flexGrow: 1
    },
    listFileEntryName: {
      padding: [0, 8, 4, 8]
    },
    listFileEntryProperties: {
      fontSize: theme.listFileEntry.propertyFontSize,
      flexDirection: 'row',
      display: 'flex'
    },
    listFileEntryProperty: {
      padding: [0, 8],
      opacity: 0.4
    }
  };
});

var DnDFileEntry = /*#__PURE__*/React.memo(function (_ref) {
  var file = _ref.file,
      children = _ref.children;

  var _useFileEntryDnD = useFileEntryDnD(file),
      drop = _useFileEntryDnD.drop,
      drag = _useFileEntryDnD.drag,
      dndState = _useFileEntryDnD.dndState;

  useDndHoverOpen(file, dndState);
  var classes = useStyles$e();
  return React.createElement("div", {
    ref: drop,
    className: classes.fillParent
  }, React.createElement("div", {
    ref: FileHelper.isDraggable(file) ? drag : null,
    className: classes.fillParent
  }, children(dndState)));
});
var useStyles$e = /*#__PURE__*/makeLocalChonkyStyles(function () {
  return {
    fillParent: {
      height: '100%'
    }
  };
});

/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */
var FileThumbnail = /*#__PURE__*/React.memo(function (props) {
  var className = props.className,
      thumbnailUrl = props.thumbnailUrl;
  var thumbnailStyle = thumbnailUrl ? {
    backgroundImage: "url('" + thumbnailUrl + "')"
  } : {};
  var classes = useStyles$f();
  return React.createElement("div", {
    className: classnames([className, classes.fileThumbnail]),
    style: thumbnailStyle
  });
});
FileThumbnail.displayName = 'FileThumbnail';
var useStyles$f = /*#__PURE__*/makeGlobalChonkyStyles(function () {
  return {
    fileThumbnail: {
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'contain'
    }
  };
});

/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */
var GridEntryDndIndicator = /*#__PURE__*/React.memo(function (props) {
  var _c;

  var externalClassName = props.className,
      dndState = props.dndState;
  var dndIconName = useDndIcon(dndState);
  var classes = useStyles$g(dndState);
  var ChonkyIcon = useContext(ChonkyIconContext);
  if (!dndIconName) return null;
  var className = c((_c = {}, _c[classes.dndIndicator] = true, _c[externalClassName] = true, _c));
  return React.createElement("div", {
    className: className
  }, React.createElement(ChonkyIcon, {
    icon: dndIconName
  }));
});
var useStyles$g = /*#__PURE__*/makeLocalChonkyStyles(function (theme) {
  return {
    dndIndicator: {
      color: function color(dndState) {
        return dndState.dndIsOver ? dndState.dndCanDrop ? theme.dnd.canDropColor : theme.dnd.cannotDropColor : '#000';
      },
      boxSizing: 'border-box',
      position: 'absolute',
      fontSize: '1.2em',
      opacity: 0.6,
      padding: 6,
      '&:before': {
        borderBottom: '50px solid transparent',
        borderLeft: '50px solid #fff',
        position: 'absolute',
        content: '""',
        zIndex: -1,
        left: 0,
        top: 0
      }
    }
  };
});

/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */
var GridEntryPreviewFolder = /*#__PURE__*/React.memo(function (props) {
  var _c;

  var externalClassName = props.className,
      entryState = props.entryState,
      dndState = props.dndState;
  var folderClasses = useFolderStyles(entryState);
  var fileClasses = useFileStyles(entryState);
  var commonClasses = useCommonEntryStyles(entryState);
  var className = c((_c = {}, _c[folderClasses.previewFile] = true, _c[externalClassName || ''] = !!externalClassName, _c));
  return React.createElement("div", {
    className: className
  }, React.createElement("div", {
    className: folderClasses.folderBackSideMid
  }, React.createElement("div", {
    className: folderClasses.folderBackSideTop
  }), React.createElement("div", {
    className: folderClasses.folderFrontSide
  }, React.createElement(GridEntryDndIndicator, {
    className: fileClasses.dndIndicator,
    dndState: dndState
  }), React.createElement("div", {
    className: c([fileClasses.fileIcon, folderClasses.fileIcon])
  }, entryState.childrenCount), React.createElement("div", {
    className: commonClasses.selectionIndicator
  }), React.createElement(FileThumbnail, {
    className: fileClasses.thumbnail,
    thumbnailUrl: entryState.thumbnailUrl
  }))));
});
GridEntryPreviewFolder.displayName = 'GridEntryPreviewFolder';
var useFolderStyles = /*#__PURE__*/makeLocalChonkyStyles(function (theme) {
  return {
    previewFile: {
      borderRadius: theme.gridFileEntry.borderRadius,
      position: 'relative',
      overflow: 'hidden'
    },
    folderBackSideTop: {
      backgroundColor: function backgroundColor(state) {
        return state.color;
      },
      boxShadow: function boxShadow(state) {
        var color = theme.gridFileEntry.folderBackColorTint;
        if (state.focused) color = 'rgba(0, 0, 0, 0.3)';else if (state.selected) color = 'rgba(0, 153, 255, .4)';
        return "inset " + color + " 0 0 0 999px";
      },
      borderTopLeftRadius: theme.gridFileEntry.borderRadius,
      borderTopRightRadius: 10,
      position: 'absolute',
      right: '60%',
      height: 13,
      top: -10,
      left: 0,
      '&:after': {
        borderRightColor: theme.palette.background.paper,
        borderTopColor: theme.palette.background.paper,
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
        borderWidth: [0, 15, 10, 0],
        borderStyle: 'solid',
        position: 'absolute',
        display: 'block',
        content: '""',
        right: 0,
        top: 0
      }
    },
    folderBackSideMid: {
      backgroundColor: function backgroundColor(state) {
        return state.color;
      },
      boxShadow: function boxShadow(state) {
        var color = theme.gridFileEntry.folderBackColorTint;
        if (state.focused) color = 'rgba(0, 0, 0, 0.3)';else if (state.selected) color = 'rgba(0, 153, 255, .4)';
        return "inset " + color + " 0 0 0 999px";
      },
      borderTopRightRadius: theme.gridFileEntry.borderRadius,
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: 0,
      top: 10
    },
    folderFrontSide: {
      boxShadow: function boxShadow(state) {
        var shadows = [];
        if (state.focused) shadows.push('inset rgba(0, 0, 0, 1) 0 0 0 3px');
        if (state.selected) shadows.push('inset rgba(0, 153, 255, .65) 0 0 0 3px');
        shadows.push("inset " + theme.gridFileEntry.folderFrontColorTint + " 0 0 0 999px");
        return shadows.join(', ');
      },
      backgroundColor: function backgroundColor(state) {
        return state.color;
      },
      borderRadius: theme.gridFileEntry.borderRadius,
      position: 'absolute',
      overflow: 'hidden',
      bottom: 0,
      right: 0,
      left: 0,
      top: 10
    },
    fileIcon: {
      fontSize: important(theme.gridFileEntry.childrenCountSize)
    }
  };
});
var GridEntryPreviewFile = /*#__PURE__*/React.memo(function (props) {
  var _c2;

  var externalClassName = props.className,
      entryState = props.entryState,
      dndState = props.dndState;
  var fileClasses = useFileStyles(entryState);
  var commonClasses = useCommonEntryStyles(entryState);
  var ChonkyIcon = useContext(ChonkyIconContext);
  var className = c((_c2 = {}, _c2[fileClasses.previewFile] = true, _c2[externalClassName || ''] = !!externalClassName, _c2));
  return React.createElement("div", {
    className: className
  }, React.createElement(GridEntryDndIndicator, {
    className: fileClasses.dndIndicator,
    dndState: dndState
  }), React.createElement("div", {
    className: fileClasses.fileIcon
  }, React.createElement(ChonkyIcon, {
    icon: entryState.icon,
    spin: entryState.iconSpin
  })), React.createElement("div", {
    className: commonClasses.selectionIndicator
  }), React.createElement(FileThumbnail, {
    className: fileClasses.thumbnail,
    thumbnailUrl: entryState.thumbnailUrl
  }));
});
GridEntryPreviewFile.displayName = 'GridEntryPreviewFile';
var useFileStyles = /*#__PURE__*/makeLocalChonkyStyles(function (theme) {
  return {
    previewFile: {
      boxShadow: function boxShadow(state) {
        var shadows = [];
        if (state.selected) shadows.push('inset rgba(0,153,255, .65) 0 0 0 3px');
        if (state.focused) shadows.push('inset rgba(0, 0, 0, 1) 0 0 0 3px');
        shadows.push("inset " + theme.gridFileEntry.fileColorTint + " 0 0 0 999px");
        return shadows.join(', ');
      },
      backgroundColor: function backgroundColor(state) {
        return state.color;
      },
      borderRadius: theme.gridFileEntry.borderRadius,
      position: 'relative',
      overflow: 'hidden'
    },
    dndIndicator: {
      zIndex: 14
    },
    fileIcon: {
      transform: 'translateX(-50%) translateY(-50%)',
      fontSize: theme.gridFileEntry.iconSize,
      opacity: function opacity(state) {
        return state.thumbnailUrl && !state.focused ? 0 : 1;
      },
      color: function color(state) {
        return state.focused ? theme.gridFileEntry.iconColorFocused : theme.gridFileEntry.iconColor;
      },
      position: 'absolute',
      left: '50%',
      zIndex: 12,
      top: '50%'
    },
    thumbnail: {
      borderRadius: theme.gridFileEntry.borderRadius,
      position: 'absolute',
      zIndex: 6,
      bottom: 5,
      right: 5,
      left: 5,
      top: 5
    }
  };
});
var useCommonEntryStyles = /*#__PURE__*/makeLocalChonkyStyles(function () {
  return {
    selectionIndicator: {
      display: function display(state) {
        return state.selected ? 'block' : 'none';
      },
      background: 'repeating-linear-gradient(' + '45deg,' + 'rgba(0,153,255,.14),' + 'rgba(0,153,255,.14) 10px,' + 'rgba(0,153,255,.25) 0,' + 'rgba(0,153,255,.25) 20px' + ')',
      backgroundColor: 'rgba(0, 153, 255, .14)',
      position: 'absolute',
      height: '100%',
      width: '100%',
      zIndex: 10
    },
    focusIndicator: {
      display: function display(state) {
        return state.focused ? 'block' : 'none';
      },
      boxShadow: 'inset rgba(0, 0, 0, 1) 0 0 0 2px',
      position: 'absolute',
      height: '100%',
      width: '100%',
      zIndex: 11
    }
  };
});

var GridEntry = /*#__PURE__*/React.memo(function (_ref) {
  var _c;

  var file = _ref.file,
      selected = _ref.selected,
      focused = _ref.focused,
      dndState = _ref.dndState;
  var isDirectory = FileHelper.isDirectory(file);
  var entryState = useFileEntryState(file, selected, focused);
  var classes = useFileEntryStyles(entryState);
  var fileEntryHtmlProps = useFileEntryHtmlProps(file);
  var entryClassName = c((_c = {}, _c[classes.gridFileEntry] = true, _c));
  return React.createElement("div", Object.assign({
    className: entryClassName
  }, fileEntryHtmlProps), isDirectory ? React.createElement(GridEntryPreviewFolder, {
    className: classes.gridFileEntryPreview,
    entryState: entryState,
    dndState: dndState
  }) : React.createElement(GridEntryPreviewFile, {
    className: classes.gridFileEntryPreview,
    entryState: entryState,
    dndState: dndState
  }), React.createElement("div", {
    className: classes.gridFileEntryNameContainer
  }, React.createElement(FileEntryName, {
    className: classes.gridFileEntryName,
    file: file
  })));
});
GridEntry.displayName = 'GridEntry';
var useFileEntryStyles = /*#__PURE__*/makeLocalChonkyStyles(function (theme) {
  return {
    gridFileEntry: {
      flexDirection: 'column',
      display: 'flex',
      height: '100%'
    },
    gridFileEntryPreview: {
      flexGrow: 1
    },
    gridFileEntryNameContainer: {
      fontSize: theme.gridFileEntry.fontSize,
      wordBreak: 'break-word',
      textAlign: 'center',
      paddingTop: 5
    },
    gridFileEntryName: {
      backgroundColor: function backgroundColor(state) {
        return state.selected ? 'rgba(0,153,255, .25)' : 'transparent';
      },
      textDecoration: function textDecoration(state) {
        return state.focused ? 'underline' : 'none';
      },
      borderRadius: 3,
      padding: [2, 4]
    }
  };
});

var ListEntry = /*#__PURE__*/React.memo(function (_ref) {
  var file = _ref.file,
      selected = _ref.selected,
      focused = _ref.focused,
      dndState = _ref.dndState;
  var entryState = useFileEntryState(file, selected, focused);
  var dndIconName = useDndIcon(dndState);

  var _useLocalizedFileEntr = useLocalizedFileEntryStrings(file),
      fileModDateString = _useLocalizedFileEntr.fileModDateString,
      fileSizeString = _useLocalizedFileEntr.fileSizeString;

  var styleState = useMemo(function () {
    return {
      entryState: entryState,
      dndState: dndState
    };
  }, [dndState, entryState]);
  var classes = useStyles$h(styleState);
  var commonClasses = useCommonEntryStyles(entryState);
  var ChonkyIcon = useContext(ChonkyIconContext);
  var fileEntryHtmlProps = useFileEntryHtmlProps(file);
  return React.createElement("div", Object.assign({
    className: classes.listFileEntry
  }, fileEntryHtmlProps), React.createElement("div", {
    className: commonClasses.focusIndicator
  }), React.createElement("div", {
    className: c([commonClasses.selectionIndicator, classes.listFileEntrySelection])
  }), React.createElement("div", {
    className: classes.listFileEntryIcon
  }, React.createElement(ChonkyIcon, {
    icon: dndIconName != null ? dndIconName : entryState.icon,
    spin: dndIconName ? false : entryState.iconSpin,
    fixedWidth: true
  })), React.createElement("div", {
    className: classes.listFileEntryName,
    title: file ? file.name : undefined
  }, React.createElement(FileEntryName, {
    file: file
  })), React.createElement("div", {
    className: classes.listFileEntryProperty
  }, file ? fileModDateString != null ? fileModDateString : React.createElement("span", null, "\u2014") : React.createElement(TextPlaceholder, {
    minLength: 5,
    maxLength: 15
  })), React.createElement("div", {
    className: classes.listFileEntryProperty
  }, file ? fileSizeString != null ? fileSizeString : React.createElement("span", null, "\u2014") : React.createElement(TextPlaceholder, {
    minLength: 10,
    maxLength: 20
  })));
});
var useStyles$h = /*#__PURE__*/makeLocalChonkyStyles(function (theme) {
  return {
    listFileEntry: {
      boxShadow: "inset " + theme.palette.divider + " 0 -1px 0",
      fontSize: theme.listFileEntry.fontSize,
      color: function color(_ref2) {
        var dndState = _ref2.dndState;
        return dndState.dndIsOver ? dndState.dndCanDrop ? theme.dnd.canDropColor : theme.dnd.cannotDropColor : 'inherit';
      },
      alignItems: 'center',
      position: 'relative',
      display: 'flex',
      height: '100%'
    },
    listFileEntrySelection: {
      opacity: 0.6
    },
    listFileEntryIcon: {
      color: function color(_ref3) {
        var entryState = _ref3.entryState,
            dndState = _ref3.dndState;
        return dndState.dndIsOver ? dndState.dndCanDrop ? theme.dnd.canDropColor : theme.dnd.cannotDropColor : entryState.color;
      },
      fontSize: theme.listFileEntry.iconFontSize,
      boxSizing: 'border-box',
      padding: [2, 4],
      zIndex: 20
    },
    listFileEntryName: {
      textOverflow: 'ellipsis',
      boxSizing: 'border-box',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      flex: '1 1 300px',
      paddingLeft: 8,
      zIndex: 20
    },
    listFileEntryProperty: {
      fontSize: theme.listFileEntry.propertyFontSize,
      boxSizing: 'border-box',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      flex: '0 1 150px',
      padding: [2, 8],
      zIndex: 20
    }
  };
});

var disabledDndState = {
  dndIsDragging: false,
  dndIsOver: false,
  dndCanDrop: false
};
var SmartFileEntry = /*#__PURE__*/React.memo(function (_ref) {
  var fileId = _ref.fileId,
      displayIndex = _ref.displayIndex,
      fileViewMode = _ref.fileViewMode;
  var classes = useStyles$i(); // Basic properties

  var file = useParamSelector(selectFileData, fileId);
  var selected = useParamSelector(selectIsFileSelected, fileId);
  var dndDisabled = useSelector(selectIsDnDDisabled); // Clickable wrapper properties

  var fileClickHandlers = useFileClickHandlers(file, displayIndex);

  var _useState = useState(false),
      focused = _useState[0],
      setFocused = _useState[1];

  var clickableWrapperProps = _extends({
    wrapperTag: 'div',
    passthroughProps: {
      className: classes.fileEntryClickableWrapper
    }
  }, FileHelper.isClickable(file) ? fileClickHandlers : undefined, {
    setFocused: setFocused
  }); // File entry properties


  var fileEntryProps = {
    file: file,
    selected: selected,
    focused: focused
  };
  var EntryComponent;
  if (fileViewMode === FileViewMode.List) EntryComponent = ListEntry;else if (fileViewMode === FileViewMode.Compact) EntryComponent = CompactEntry;else EntryComponent = GridEntry;
  return dndDisabled ? React.createElement(ClickableWrapper, Object.assign({}, clickableWrapperProps), React.createElement(EntryComponent, Object.assign({}, fileEntryProps, {
    dndState: disabledDndState
  }))) : React.createElement(DnDFileEntry, {
    file: file
  }, function (dndState) {
    return React.createElement(ClickableWrapper, Object.assign({}, clickableWrapperProps), React.createElement(EntryComponent, Object.assign({}, fileEntryProps, {
      dndState: dndState
    })));
  });
});
SmartFileEntry.displayName = 'SmartFileEntry';
var useStyles$i = /*#__PURE__*/makeGlobalChonkyStyles(function () {
  return {
    fileEntryClickableWrapper: {
      // We disable default browser outline because Chonky provides its own outline
      // (which doesn't compromise accessibility, hopefully)
      outline: 'none !important',
      position: 'relative',
      height: '100%'
    }
  };
});

var isMobileDevice = function isMobileDevice() {
  // noinspection JSDeprecatedSymbols
  return typeof window.orientation !== 'undefined' || navigator.userAgent.indexOf('IEMobile') !== -1;
};
var getGridConfig = function getGridConfig(width, fileCount, viewConfig, isMobileBreakpoint) {
  var gutter = isMobileBreakpoint ? 5 : 8;
  var scrollbar = isMobileDevice() ? 0 : 18;
  var columnCount;
  var columnWidth;

  if (isMobileBreakpoint) {
    columnCount = 2;
    columnWidth = (width - gutter - scrollbar) / columnCount;
  } else {
    columnWidth = viewConfig.entryWidth;
    columnCount = Math.max(1, Math.floor((width - scrollbar) / (columnWidth + gutter)));
  }

  var rowCount = Math.ceil(fileCount / columnCount);
  return {
    rowCount: rowCount,
    columnCount: columnCount,
    gutter: gutter,
    rowHeight: viewConfig.entryHeight,
    columnWidth: columnWidth
  };
};
var GridContainer = /*#__PURE__*/React.memo(function (props) {
  var width = props.width,
      height = props.height;
  var viewConfig = useSelector(selectFileViewConfig);
  var displayFileIds = useSelector(selectors.getDisplayFileIds);
  var fileCount = useMemo(function () {
    return displayFileIds.length;
  }, [displayFileIds]);
  var gridRef = useRef();
  var isMobileBreakpoint = useIsMobileBreakpoint(); // Whenever the grid config changes at runtime, we call a method on the
  // `VariableSizeGrid` handle to reset column width/row height cache.
  // !!! Note that we deliberately update the `gridRef` firsts and update the React
  //     state AFTER that. This is needed to avoid file entries jumping up/down.

  var _useState = useState(getGridConfig(width, fileCount, viewConfig, isMobileBreakpoint)),
      gridConfig = _useState[0],
      setGridConfig = _useState[1];

  var gridConfigRef = useRef(gridConfig);
  useEffect(function () {
    var oldConf = gridConfigRef.current;
    var newConf = getGridConfig(width, fileCount, viewConfig, isMobileBreakpoint);
    gridConfigRef.current = newConf;

    if (gridRef.current) {
      if (oldConf.rowCount !== newConf.rowCount) {
        gridRef.current.resetAfterRowIndex(Math.min(oldConf.rowCount, newConf.rowCount) - 1);
      }

      if (oldConf.columnCount !== newConf.columnCount) {
        gridRef.current.resetAfterColumnIndex(Math.min(oldConf.columnCount, newConf.rowCount) - 1);
      }

      if (oldConf.columnWidth !== newConf.columnWidth) {
        gridRef.current.resetAfterIndices({
          columnIndex: 0,
          rowIndex: 0
        });
      }
    }

    setGridConfig(newConf);
  }, [setGridConfig, gridConfigRef, isMobileBreakpoint, width, viewConfig, fileCount]);
  var sizers = useMemo(function () {
    var gc = gridConfigRef;
    return {
      getColumnWidth: function getColumnWidth(index) {
        return gc.current.columnWidth + (index === gc.current.columnCount - 1 ? 0 : gc.current.gutter);
      },
      getRowHeight: function getRowHeight(index) {
        return gc.current.rowHeight + (index === gc.current.rowCount - 1 ? 0 : gc.current.gutter);
      }
    };
  }, [gridConfigRef]);
  var displayFileIdsRef = useInstanceVariable(useSelector(selectors.getDisplayFileIds));
  var getItemKey = useCallback(function (data) {
    var _displayFileIdsRef$cu;

    var index = data.rowIndex * gridConfigRef.current.columnCount + data.columnIndex;
    return (_displayFileIdsRef$cu = displayFileIdsRef.current[index]) != null ? _displayFileIdsRef$cu : "loading-file-" + index;
  }, [gridConfigRef, displayFileIdsRef]);
  var cellRenderer = useCallback(function (data) {
    var gc = gridConfigRef;
    var index = data.rowIndex * gc.current.columnCount + data.columnIndex;
    var fileId = displayFileIds[index];
    if (displayFileIds[index] === undefined) return null;

    var styleWithGutter = _extends({}, data.style, {
      paddingRight: data.columnIndex === gc.current.columnCount - 1 ? 0 : gc.current.gutter,
      paddingBottom: data.rowIndex === gc.current.rowCount - 1 ? 0 : gc.current.gutter,
      boxSizing: 'border-box'
    });

    return React.createElement("div", {
      style: styleWithGutter
    }, React.createElement(SmartFileEntry, {
      fileId: fileId != null ? fileId : null,
      displayIndex: index,
      fileViewMode: viewConfig.mode
    }));
  }, [displayFileIds, viewConfig.mode]);
  var classes = useStyles$j();
  var gridComponent = useMemo(function () {
    return React.createElement(VariableSizeGrid, {
      ref: gridRef,
      className: classes.gridContainer,
      estimatedRowHeight: gridConfig.rowHeight + gridConfig.gutter,
      rowHeight: sizers.getRowHeight,
      estimatedColumnWidth: gridConfig.columnWidth + gridConfig.gutter,
      columnWidth: sizers.getColumnWidth,
      columnCount: gridConfig.columnCount,
      height: height,
      rowCount: gridConfig.rowCount,
      width: width,
      itemKey: getItemKey
    }, cellRenderer);
  }, [classes.gridContainer, gridConfig.rowHeight, gridConfig.gutter, gridConfig.columnWidth, gridConfig.columnCount, gridConfig.rowCount, sizers.getRowHeight, sizers.getColumnWidth, height, width, getItemKey, cellRenderer]);
  return gridComponent;
});
var useStyles$j = /*#__PURE__*/makeGlobalChonkyStyles(function () {
  return {
    gridContainer: {}
  };
});

/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */
var ListContainer = /*#__PURE__*/React.memo(function (props) {
  var width = props.width,
      height = props.height;
  var viewConfig = useSelector(selectFileViewConfig);
  var listRef = useRef();
  var displayFileIds = useSelector(selectors.getDisplayFileIds);
  var displayFileIdsRef = useInstanceVariable(displayFileIds);
  var getItemKey = useCallback(function (index) {
    var _displayFileIdsRef$cu;

    return (_displayFileIdsRef$cu = displayFileIdsRef.current[index]) != null ? _displayFileIdsRef$cu : "loading-file-" + index;
  }, [displayFileIdsRef]);
  var classes = useStyles$k();
  var listComponent = useMemo(function () {
    // When entry size is null, we use List view
    var rowRenderer = function rowRenderer(data) {
      var _displayFileIds$data$;

      return React.createElement("div", {
        style: data.style
      }, React.createElement(SmartFileEntry, {
        fileId: (_displayFileIds$data$ = displayFileIds[data.index]) != null ? _displayFileIds$data$ : null,
        displayIndex: data.index,
        fileViewMode: FileViewMode.List
      }));
    };

    return React.createElement(FixedSizeList, {
      ref: listRef,
      className: classes.listContainer,
      itemSize: viewConfig.entryHeight,
      height: height,
      itemCount: displayFileIds.length,
      width: width,
      itemKey: getItemKey
    }, rowRenderer);
  }, [classes.listContainer, viewConfig.entryHeight, height, displayFileIds, width, getItemKey]);
  return listComponent;
});
var useStyles$k = /*#__PURE__*/makeLocalChonkyStyles(function (theme) {
  return {
    listContainer: {
      borderTop: "solid 1px " + theme.palette.divider
    }
  };
});

var FileList = /*#__PURE__*/React.memo(function (props) {
  var displayFileIds = useSelector(selectors.getDisplayFileIds);
  var viewConfig = useSelector(selectFileViewConfig);
  var currentFolder = useSelector(selectCurrentFolder);

  var _useFileDrop = useFileDrop({
    file: currentFolder
  }),
      drop = _useFileDrop.drop,
      dndCanDrop = _useFileDrop.dndCanDrop,
      dndIsOverCurrent = _useFileDrop.dndIsOverCurrent;

  var styleState = useMemo(function () {
    return {
      dndCanDrop: dndCanDrop,
      dndIsOverCurrent: dndIsOverCurrent
    };
  }, [dndCanDrop, dndIsOverCurrent]);
  var localClasses = useLocalStyles(styleState);
  var classes = useStyles$l(viewConfig);
  var onScroll = props.onScroll; // In Chonky v0.x, this field was user-configurable. In Chonky v1.x+, we hardcode
  // this to `true` to simplify configuration. Users can just wrap Chonky in their
  // own `div` if they want to have finer control over the height.

  var fillParentContainer = true;
  var listRenderer = useCallback(function (_ref) {
    var width = _ref.width,
        height = _ref.height;

    if (displayFileIds.length === 0) {
      return React.createElement(FileListEmpty, {
        width: width,
        height: viewConfig.entryHeight
      });
    } else if (viewConfig.mode === FileViewMode.List) {
      return React.createElement(ListContainer, {
        width: width,
        height: height
      });
    } else {
      return React.createElement(GridContainer, {
        width: width,
        height: height
      });
    }
  }, [displayFileIds, viewConfig]);
  var ChonkyIcon = useContext(ChonkyIconContext);
  return React.createElement("div", {
    onScroll: onScroll,
    ref: drop,
    className: c([classes.fileListWrapper, localClasses.fileListWrapper]),
    role: "list"
  }, React.createElement("div", {
    className: localClasses.dndDropZone
  }, React.createElement("div", {
    className: localClasses.dndDropZoneIcon
  }, React.createElement(ChonkyIcon, {
    icon: dndCanDrop ? ChonkyIconName.dndCanDrop : ChonkyIconName.dndCannotDrop
  }))), React.createElement(AutoSizer, {
    disableHeight: !fillParentContainer
  }, listRenderer));
});
FileList.displayName = 'FileList';
var useLocalStyles = /*#__PURE__*/makeLocalChonkyStyles(function (theme) {
  return {
    fileListWrapper: {
      minHeight: ChonkyActions.EnableGridView.fileViewConfig.entryHeight + 2,
      background: function background(state) {
        return state.dndIsOverCurrent && state.dndCanDrop ? state.dndCanDrop ? getStripeGradient(theme.dnd.fileListCanDropMaskOne, theme.dnd.fileListCanDropMaskTwo) : getStripeGradient(theme.dnd.fileListCannotDropMaskOne, theme.dnd.fileListCannotDropMaskTwo) : 'none';
      }
    },
    dndDropZone: {
      display: function display(state) {
        return (// When we cannot drop, we don't show an indicator at all
          state.dndIsOverCurrent && state.dndCanDrop ? 'block' : 'none'
        );
      },
      borderRadius: theme.gridFileEntry.borderRadius,
      pointerEvents: 'none',
      position: 'absolute',
      height: '100%',
      width: '100%',
      zIndex: 2
    },
    dndDropZoneIcon: {
      backgroundColor: function backgroundColor(state) {
        return state.dndCanDrop ? theme.dnd.canDropMask : theme.dnd.cannotDropMask;
      },
      color: function color(state) {
        return state.dndCanDrop ? theme.dnd.canDropColor : theme.dnd.cannotDropColor;
      },
      borderRadius: theme.gridFileEntry.borderRadius,
      transform: 'translateX(-50%) translateY(-50%)',
      position: 'absolute',
      textAlign: 'center',
      lineHeight: '60px',
      fontSize: '2em',
      left: '50%',
      height: 60,
      top: '50%',
      width: 60
    }
  };
});
var useStyles$l = /*#__PURE__*/makeGlobalChonkyStyles(function () {
  return {
    fileListWrapper: {
      height: '100%',
      maxHeight: '100%'
    }
  };
});

/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */
var FileContextMenu = /*#__PURE__*/React.memo(function () {
  var dispatch = useDispatch();
  useEffect(function () {
    dispatch(reduxActions.setContextMenuMounted(true));
    return function () {
      dispatch(reduxActions.setContextMenuMounted(false));
    };
  }, [dispatch]);
  var intl = useIntl();
  var browserMenuShortcutString = intl.formatMessage({
    id: getI18nId(I18nNamespace.FileContextMenu, 'browserMenuShortcut'),
    defaultMessage: 'Browser menu: {shortcut}'
  }, {
    shortcut: React.createElement("strong", null, "Alt + Right Click")
  });
  var contextMenuConfig = useSelector(selectContextMenuConfig);
  var contextMenuItems = useSelector(selectContextMenuItems);
  var hideContextMenu = useContextMenuDismisser();
  var contextMenuItemComponents = useMemo(function () {
    var components = [];

    var _loop = function _loop(i) {
      var item = contextMenuItems[i];

      if (typeof item === 'string') {
        components.push(React.createElement(SmartToolbarDropdownButton, {
          key: "context-menu-item-" + item,
          fileActionId: item,
          onClickFollowUp: hideContextMenu
        }));
      } else {
        item.fileActionIds.map(function (id) {
          return components.push(React.createElement(SmartToolbarDropdownButton, {
            key: "context-menu-item-" + item.name + "-" + id,
            fileActionId: id,
            onClickFollowUp: hideContextMenu
          }));
        });
      }
    };

    for (var i = 0; i < contextMenuItems.length; ++i) {
      _loop(i);
    }

    return components;
  }, [contextMenuItems, hideContextMenu]);
  var anchorPosition = useMemo(function () {
    return contextMenuConfig ? {
      top: contextMenuConfig.mouseY,
      left: contextMenuConfig.mouseX
    } : undefined;
  }, [contextMenuConfig]);
  var classes = useStyles$m();
  return React.createElement(Menu, {
    elevation: 2,
    disablePortal: true,
    onClose: hideContextMenu,
    transitionDuration: 150,
    open: !!contextMenuConfig,
    anchorPosition: anchorPosition,
    anchorReference: "anchorPosition",
    classes: {
      list: classes.contextMenuList
    }
  }, contextMenuItemComponents, React.createElement(ListSubheader, {
    component: "div",
    className: classes.browserMenuTooltip
  }, browserMenuShortcutString));
});
var useStyles$m = /*#__PURE__*/makeGlobalChonkyStyles(function () {
  return {
    contextMenuList: {
      paddingBottom: important(0),
      paddingTop: important(0)
    },
    browserMenuTooltip: {
      lineHeight: important('30px'),
      fontSize: important('0.7em')
    }
  };
});

/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */
var FullFileBrowser = /*#__PURE__*/React.memo( /*#__PURE__*/React.forwardRef(function (props, ref) {
  var onScroll = props.onScroll;
  return React.createElement(FileBrowser, Object.assign({
    ref: ref
  }, props), React.createElement(FileNavbar, null), React.createElement(FileToolbar, null), React.createElement(FileList, {
    onScroll: onScroll
  }), React.createElement(FileContextMenu, null));
}));
FullFileBrowser.displayName = 'FullFileBrowser';

var useFolderChain = function useFolderChain(fileMap, currentFolderId) {
  return useMemo(function () {
    var currentFolder = fileMap[currentFolderId];
    var folderChain = [currentFolder];
    var parentId = currentFolder.parentId;

    while (parentId) {
      var parentFile = fileMap[parentId];

      if (parentFile) {
        folderChain.unshift(parentFile);
        parentId = parentFile.parentId;
      } else {
        break;
      }
    }

    return folderChain;
  }, [currentFolderId, fileMap]);
};
var useFiles = function useFiles(fileMap, currentFolderId) {
  return useMemo(function () {
    var currentFolder = fileMap[currentFolderId];
    var childrenIds = currentFolder.childrenIds;
    var files = childrenIds.map(function (fileId) {
      return fileMap[fileId];
    });
    return files;
  }, [currentFolderId, fileMap]);
};
var useFileMapMethods = function useFileMapMethods(baseFileMap, initialFolderId) {
  var _useState = useState(baseFileMap),
      fileMap = _useState[0],
      setFileMap = _useState[1];

  var _useState2 = useState(initialFolderId),
      currentFolderId = _useState2[0],
      setCurrentFolderId = _useState2[1];

  var resetFileMap = useCallback(function () {
    setFileMap(baseFileMap);
    setCurrentFolderId(initialFolderId);
  }, [baseFileMap, initialFolderId]);
  var moveFiles = useCallback(function (files, source, destination) {
    return setFileMap(function (currentFileMap) {
      var newFileMap = _extends({}, currentFileMap);

      var moveFileIds = new Set(files.map(function (f) {
        return f.id;
      })); // Delete files from their source folder.

      var newSourceChildrenIds = source.childrenIds.filter(function (id) {
        return !moveFileIds.has(id);
      });
      newFileMap[source.id] = _extends({}, source, {
        childrenIds: newSourceChildrenIds,
        childrenCount: newSourceChildrenIds.length
      }); // Add the files to their destination folder.

      var newDestinationChildrenIds = [].concat(destination.childrenIds, files.map(function (f) {
        return f.id;
      }));
      newFileMap[destination.id] = _extends({}, destination, {
        childrenIds: newDestinationChildrenIds,
        childrenCount: newDestinationChildrenIds.length
      }); // Finally, update the parent folder ID on the files from source folder
      // ID to the destination folder ID.

      files.forEach(function (file) {
        newFileMap[file.id] = _extends({}, file, {
          parentId: destination.id
        });
      });
      return newFileMap;
    });
  }, []);
  var methods = useMemo(function () {
    return {
      setFileMap: setFileMap,
      setCurrentFolderId: setCurrentFolderId,
      resetFileMap: resetFileMap,
      moveFiles: moveFiles
    };
  }, [setFileMap, setCurrentFolderId, resetFileMap, moveFiles]);
  return {
    fileMap: fileMap,
    currentFolderId: currentFolderId,
    methods: methods
  };
};
var useFileActionHandler = function useFileActionHandler(methods) {
  return useCallback(function (data) {
    if (data.id === ChonkyActions.OpenFiles.id) {
      var _data$payload = data.payload,
          targetFile = _data$payload.targetFile,
          files = _data$payload.files;
      var fileToOpen = targetFile != null ? targetFile : files[0];

      if (fileToOpen && FileHelper.isDirectory(fileToOpen)) {
        methods.setCurrentFolderId(fileToOpen.id);
      }
    } else if (data.id === ChonkyActions.MoveFiles.id) {
      methods.moveFiles(data.payload.files, data.payload.source, data.payload.destination);
    }
  }, [methods]);
};
var useFileMap = function useFileMap(_ref) {
  var baseFileMap = _ref.baseFileMap,
      initialFolderId = _ref.initialFolderId;

  var _useFileMapMethods = useFileMapMethods(baseFileMap, initialFolderId),
      fileMap = _useFileMapMethods.fileMap,
      currentFolderId = _useFileMapMethods.currentFolderId,
      methods = _useFileMapMethods.methods;

  var folderChain = useFolderChain(fileMap, currentFolderId);
  var files = useFiles(fileMap, currentFolderId);
  var fileActionHandler = useFileActionHandler(methods);
  var data = {
    fileMap: fileMap,
    currentFolderId: currentFolderId,
    folderChain: folderChain,
    files: files
  };
  return {
    data: data,
    methods: methods,
    fileActionHandler: fileActionHandler
  };
};

var fileMap = {
  __proto__: null,
  useFolderChain: useFolderChain,
  useFiles: useFiles,
  useFileMapMethods: useFileMapMethods,
  useFileActionHandler: useFileActionHandler,
  useFileMap: useFileMap
};

export { ChonkyActions, ChonkyDndFileEntryType, ChonkyIconName, CustomVisibilityState, DefaultFileActions, FileBrowser, FileContextMenu, FileHelper, FileList, FileNavbar, FileToolbar, FileViewMode, FullFileBrowser, I18nNamespace, OptionIds, defaultFormatters, defineFileAction, fileMap, getActionI18nId, getI18nId, setChonkyDefaults, thunkDispatchFileAction, thunkRequestFileAction };
//# sourceMappingURL=chonky.esm.js.map
