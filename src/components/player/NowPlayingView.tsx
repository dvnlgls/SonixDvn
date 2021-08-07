import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setCurrentIndex } from '../../redux/playQueueSlice';
import {
  toggleSelected,
  setRangeSelected,
  toggleRangeSelected,
  setSelected,
  clearSelected,
} from '../../redux/multiSelectSlice';
import GenericPage from '../layout/GenericPage';
import GenericPageHeader from '../layout/GenericPageHeader';
import ListViewType from '../viewtypes/ListViewType';
import Loader from '../loader/Loader';

const tableColumns = [
  {
    header: '#',
    dataKey: 'index',
    alignment: 'center',
    width: 70,
  },
  {
    header: 'Title',
    dataKey: 'title',
    alignment: 'left',
    resizable: true,
    width: 350,
  },

  {
    header: 'Artist',
    dataKey: 'artist',
    alignment: 'center',
    resizable: true,
    width: 300,
  },
  {
    header: 'Album',
    dataKey: 'album',
    alignment: 'center',
    resizable: true,
    width: 300,
  },
  {
    header: 'Duration',
    dataKey: 'duration',
    alignment: 'center',
    resizable: true,
    width: 70,
  },
];

const NowPlayingView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const playQueue = useAppSelector((state) => state.playQueue);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (searchQuery !== '') {
      setFilteredData(
        playQueue.entry.filter((entry: any) => {
          return entry.title.toLowerCase().includes(searchQuery.toLowerCase());
        })
      );
    } else {
      setFilteredData([]);
    }
  }, [playQueue?.entry, searchQuery]);

  let timeout: any = null;
  const handleRowClick = (e: any, rowData: any) => {
    if (timeout === null) {
      timeout = window.setTimeout(() => {
        timeout = null;

        if (e.ctrlKey) {
          dispatch(toggleSelected(rowData));
        } else if (e.shiftKey) {
          dispatch(setRangeSelected(rowData));
          if (searchQuery !== '') {
            dispatch(toggleRangeSelected(filteredData));
          } else {
            dispatch(toggleRangeSelected(playQueue.entry));
          }
        } else {
          dispatch(setSelected(rowData));
        }
      }, 300);
    }
  };

  const handleRowDoubleClick = (_e: any, rowData: any) => {
    window.clearTimeout(timeout);
    timeout = null;
    dispatch(clearSelected());
    dispatch(setCurrentIndex(rowData));
  };

  if (!playQueue) {
    return <Loader />;
  }

  return (
    <GenericPage
      header={
        <GenericPageHeader
          title="Now Playing"
          searchQuery={searchQuery}
          handleSearch={(e: any) => setSearchQuery(e)}
          clearSearchQuery={() => setSearchQuery('')}
          showSearchBar
        />
      }
    >
      <ListViewType
        data={searchQuery !== '' ? filteredData : playQueue.entry}
        currentIndex={playQueue.currentIndex}
        tableColumns={tableColumns}
        handleRowClick={handleRowClick}
        handleRowDoubleClick={handleRowDoubleClick}
        virtualized
      />
    </GenericPage>
  );
};

export default NowPlayingView;