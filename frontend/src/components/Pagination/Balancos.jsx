import { Box, Pagination } from '@mui/material'
import axios from 'axios';
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { setSpreadsheets } from '../../features/spreadSheet/spreadSheetSlice';

export default function BalancosPagination({ setSpreadSheetsData, search }) {

    const { spreadSheets, excel } = useSelector((state) => state.spreadSheet);

    const dispatch = useDispatch();
    const pageSize = 6;

    const [pagination, setPagination] = useState({
        count: 0,
        page: 1,
    });

    useEffect(() => {

        fetchData(pagination.page);

    }, [pagination.page, excel, search]);

    useEffect(() => {

        setSpreadSheetsData(spreadSheets);

    }, [spreadSheets]);

    const fetchData = (page) => {
        const pageSize = 6;

        axios.get(`/api/planilha/spreadsheets?pageSize=${pageSize}&page=${page}&search=${search}`)
            .then((response) => {
                dispatch(setSpreadsheets(response.data.spreadsheets));
                setPagination({
                    ...pagination,
                    count: response.data.totalDocuments,
                });
            })
            .catch((error) => {
                console.error(error);
                // Handle errors here
            });
    };

    const handlePageChange = (event, page) => {
        setPagination({
            ...pagination,
            page: page,
        });
    };



    return (
        <Box sx={{
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            margin: 'auto',
            padding: '20px 0 72px 0',
        }}>

            <Pagination
                count={Math.ceil(pagination.count / pageSize)}
                page={pagination.page}
                onChange={handlePageChange}
            />
        </Box>
    )
}
