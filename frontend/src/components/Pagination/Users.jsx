import { Box, Pagination } from '@mui/material'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { listUsers, setUsers } from '../../features/admin/adminSlice'
import axios from 'axios'


export default function UsersPagination({ setUsersData, status, productsQuantity, role, invisible, pages }) {

    const { users } = useSelector((state) => state.admin)

    const dispatch = useDispatch();
    const pageSize = pages ? pages : 6;

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

        setUsersData(users);

    }, [users]);

    const fetchData = (page) => {
        const pageSize = pages ? pages : 6;

        axios.get(`/api/admin/users?pageSize=${pageSize}&page=${page}&status=${status}&productsQuantity=${productsQuantity}&role=${role}`)
            .then((response) => {
                dispatch(setUsers(response.data));
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
                style={{
                    display: invisible ? 'none' : 'flex'
                }}
            />
        </Box>
    )
}
