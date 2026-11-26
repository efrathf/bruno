import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { renameItem, saveRequest } from 'providers/ReduxStore/slices/collections/actions';
import { isItemAFolder } from 'utils/tabs';
import StyledWrapper from './StyledWrapper';

const MAX_NAME_LENGTH = 255;

// Renames only the display name; the file/folder on disk keeps its path so the open tab stays valid.
// Renaming the filesystem name is still done through the sidebar's Rename modal.
const TabNameEditor = ({ item, collectionUid, onDone }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState(item.name);
  const isCommittingRef = useRef(false);

  const commit = async () => {
    if (isCommittingRef.current) return;
    isCommittingRef.current = true;

    const newName = name.trim();
    if (!newName || newName === item.name) {
      return onDone();
    }
    if (newName.length > MAX_NAME_LENGTH) {
      toast.error(`Name must be ${MAX_NAME_LENGTH} characters or less`);
      return onDone();
    }

    try {
      // The rename rewrites the file from disk, so unsaved request changes must be saved first
      if (!isItemAFolder(item) && item.draft) {
        await dispatch(saveRequest(item.uid, collectionUid, true));
      }
      await dispatch(renameItem({ newName, itemUid: item.uid, collectionUid }));
    } catch (error) {
      toast.error(error?.message || 'An error occurred while renaming');
    }
    onDone();
  };

  const handleKeyDown = (e) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      e.preventDefault();
      commit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      isCommittingRef.current = true;
      onDone();
    }
  };

  const stopPropagation = (e) => e.stopPropagation();

  return (
    <StyledWrapper className="ml-1 flex-1 min-w-0">
      <input
        type="text"
        className="tab-name-input w-full"
        data-testid="tab-name-input"
        value={name}
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        maxLength={MAX_NAME_LENGTH}
        onFocus={(e) => e.target.select()}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commit}
        onClick={stopPropagation}
        onDoubleClick={stopPropagation}
        onMouseDown={stopPropagation}
        onMouseUp={stopPropagation}
        onContextMenu={stopPropagation}
      />
    </StyledWrapper>
  );
};

export default TabNameEditor;
