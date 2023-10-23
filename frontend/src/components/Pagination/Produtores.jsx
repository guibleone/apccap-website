import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setProdutores } from '../../features/admin/adminSlice';
import { Box, Pagination } from '@mui/material';


export default function ProdutoresPagination({ setProdutoresData, cidade, pages }) {

    const { produtores } = useSelector(state => state.admin)

    const dispatch = useDispatch();
    const pageSize = pages || 5;

    const [pagination, setPagination] = useState({
        count: 0,
        page: 1,
    });

    useEffect(() => {

        fetchData(pagination.page);

    }, [pagination.page]);

    const handlePageChange = (event, page) => {
        setPagination({
            ...pagination,
            page: page,
        });
    };

    useEffect(() => {

        setProdutoresData(produtores);

    }, [produtores]);

    const fetchData = (page) => {
        const pageSize = pages || 5;

        axios.get(`/api/admin/produtores?pageSize=${pageSize}&page=${page}&cidade=${cidade}`)
            .then((response) => {
                dispatch(setProdutores(response.data));
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
            padding: '20px 0 0px 0',
        }}>

            <Pagination
                count={Math.ceil(pagination.count / pageSize)}
                page={pagination.page}
                onChange={handlePageChange}
            />
        </Box>
    )
}
