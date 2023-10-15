import { Box, Pagination } from '@mui/material'
import axios from 'axios';
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { setRelatorys } from '../../features/relatorys/relatorysSlice';

export default function RelatorysPagination({ setRelatorysData, invisible, search }) {

    const { relatorys, isSuccess } = useSelector((state) => state.relatorys);

    const dispatch = useDispatch();
    const pageSize = 6;

    const [pagination, setPagination] = useState({
        count: 0,
        page: 1,
    });

    useEffect(() => {

        fetchData(pagination.page);

    }, [pagination.page, isSuccess, search]);

    useEffect(() => {

        setRelatorysData(relatorys);

    }, [relatorys]);

    const fetchData = (page) => {
        const pageSize = 6;

        axios.get(`/api/relatorys?pageSize=${pageSize}&page=${page}&search=${search}`)
            .then((response) => {
                dispatch(setRelatorys(response.data.relatorys));
                setPagination({
                    ...pagination,
                    count: response.data.totalDocuments,
                });
            })
            .catch((error) => {
                console.error(error);
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
                style={{
                    display: invisible ? 'none' : 'flex'
                }}
            />
        </Box>
    )
}
