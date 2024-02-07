import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTable, useRowSelect, usePagination, useGlobalFilter } from 'react-table';
import Chart from './BarChart';
import './DataTable.css';

function DataTable() {
  const [selectedRowIds, setSelectedRowIds] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (pageIndex, pageSize) => {
    try {
      setLoading(true);
      const response = await axios.get('https://dummyjson.com/products');
      const allData = response.data.products.slice(0, 100); // Fetch the first 100 rows
      const startIndex = pageIndex * pageSize;
      const endIndex = startIndex + pageSize;
      const currentPageData = allData.slice(startIndex, endIndex);
      setData(currentPageData);
  
      const initialSelectedRowIds = {};
      currentPageData.slice(0, 5).forEach((_, index) => {
        initialSelectedRowIds[startIndex + index] = true; // Select the first 5 rows by default
      });
      setSelectedRowIds(initialSelectedRowIds);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const columns = React.useMemo(
    () => [
      {
        id: 'selection',
        Header: ({ getToggleAllRowsSelectedProps }) => (
          <div>
            <input type="checkbox" {...getToggleAllRowsSelectedProps()} />
          </div>
        ),
        Cell: ({ row }) => (
          <div>
            <input type="checkbox" {...row.getToggleRowSelectedProps()} />
          </div>
        ),
      },
      { Header: 'ID', accessor: 'id', type: 'number' },
      { Header: 'Title', accessor: 'title' },
      { Header: 'Price', accessor: 'price', type: 'number' },
      { Header: 'Stock', accessor: 'stock', type: 'number' },
      { Header: 'Brand', accessor: 'brand' },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageCount,
    gotoPage,
    state: { pageIndex, pageSize },
    setPageSize,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      initialState: { selectedRowIds },
      manualPagination: true, // Enabling manual pagination
      pageCount: Math.ceil(data.length / 10), 
      autoResetPage: false, 
    },
    useGlobalFilter,
    usePagination,
    useRowSelect
  );

  useEffect(() => {
    fetchData(pageIndex, pageSize);
  }, [pageIndex, pageSize]); 
  const selectedRows = selectedFlatRows.map(row => row.original);

  return (
    <div className="data-table-container">
      <h1 className='data-heading'>DATA TABLE</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Enter product name to search..."
          onChange={e => {
            const searchTerm = e.target.value;
            setGlobalFilter(searchTerm);
          }}
          className="search-bar"
        />
      </div>
      <table {...getTableProps()} className="data-table">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {loading ? (
            <tr>
              <td colSpan="6">Loading...</td>
            </tr>
          ) : (
            page.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      <div className="pagination-container">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className="btn-pagination">
          {'<<'}
        </button>{' '}
        <button onClick={previousPage} disabled={!canPreviousPage} className="btn-pagination">
          {'<'}
        </button>{' '}
        <button onClick={nextPage} disabled={!canNextPage} className="btn-pagination">
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} className="btn-pagination">
          {'>>'}
        </button>{' '}
        <span className="page-count">
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageCount}
          </strong>{' '}
        </span>
        <span className="goto-page">
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(pageNumber);
            }}
            style={{ width: '50px' }}
            className="page-input"
          />
        </span>{' '}
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value));
          }}
          className="page-size-select"
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize} >
            

              Show {pageSize}
             
              
            </option>
          ))}
        </select>
      </div>
      <Chart selectedRows={selectedRows} />
    </div>
  );
}

export default DataTable;
