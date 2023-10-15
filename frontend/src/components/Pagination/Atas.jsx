import { Box, Pagination } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setAtas } from '../../features/reunion/reunionSlice';

export default function AtasPagination({ setAtasData, search }) {

    const { atas, isSuccess } = useSelector((state) => state.reunions);

    const dispatch = useDispatch();
    const pageSize = 6;

    const [pagination, setPagination] = useState({
        count: 0,
        page: 1,
    });

    useEffect(() => {

        fetchData(pagination.page);

    }, [pagination.page, isSuccess, search]);

    const handlePageChange = (event, page) => {
        setPagination({
            ...pagination,
            page: page,
        });
    };

    useEffect(() => {
        setAtasData(atas);

    }, [
        atas,
    ]);

    const fetchData = (page) => {
        const pageSize = 6;

        axios.get(`/api/reunion/atas?pageSize=${pageSize}&page=${page}&search=${search}`)
            .then((response) => {
                dispatch(setAtas(response.data.atas));
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