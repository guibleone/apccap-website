import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setDestaques, setPublications } from '../../features/blog/blogSlice';
import { Box, Pagination } from '@mui/material';

export default function PublicationsPagination({ setPublicationsData, theme, isDestaque, invisible, pages }) {

    const { publications, destaques, isSuccess } = useSelector((state) => state.blog)

    const dispatch = useDispatch();
    const pageSize = pages ? pages : 6;

    const [pagination, setPagination] = useState({
        count: 0,
        page: 1,
    });

    useEffect(() => {

        fetchData(pagination.page);

    }, [pagination.page, isSuccess]);

    const handlePageChange = (event, page) => {
        setPagination({
            ...pagination,
            page: page,
        });
    };

    useEffect(() => {

        setPublicationsData(publications);

    }, [publications, destaques]);

    const fetchData = (page) => {
        const pageSize = pages ? pages : 6;

        axios.get(`/api/blog?pageSize=${pageSize}&page=${page}&theme=${theme}&isDestaque=${isDestaque}`)
            .then((response) => {

                if (isDestaque) {
                    dispatch(setDestaques(response.data));

                    setPagination({
                        ...pagination,
                        count: response.data.totalPublications,
                    });

                    return;
                }

                dispatch(setPublications(response.data));

                setPagination({
                    ...pagination,
                    count: response.data.totalPublications,
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
