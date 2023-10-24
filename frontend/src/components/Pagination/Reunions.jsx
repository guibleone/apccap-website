import { Box, Pagination } from '@mui/material'
import { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import { getReunions } from '../../features/reunion/reunionSlice'
import { useDispatch } from 'react-redux'


export default function ReunionPagination({ setReunionData, status, type, date, token }) {
    const dispatch = useDispatch()

    const { reunionData } = useSelector((state) => state.reunions)

    const pageSize = 4;

    const [pagination, setPagination] = useState({
        count: 0,
        from: 0,
        to: pageSize,
    });

    // pegar reuniões
    useEffect(() => {

        dispatch(getReunions(token))

    }, [token])


    useEffect(() => {

        if (reunionData?.length > 0) {
            const service = {
                getData: ({ from, to }) => {
                    return new Promise((resolve, reject) => {

                        const filteredData = (reunionData)
                            .filter(reunion => (!status || reunion.status === status))
                            .filter(reunion => (!type || reunion.type === type))
                            .sort((a, b) => {
                                if (date === 'nova') {
                                    return a.date.localeCompare(b.date); // Sort in ascending order
                                }
                                if (date === '') {
                                    return a.date.localeCompare(b.date); // Sort in ascending order
                                } else {
                                    return b.date.localeCompare(a.date); // Sort in descending order
                                }
                            });

                        const data = (filteredData?.slice(from, to))

                        resolve({
                            count: (filteredData?.length),
                            data: data,
                        });
                    });
                },
            };

            service.getData({ from: pagination.from, to: pagination.to }).then(response => {
                setPagination({ ...pagination, count: response.count })

                setReunionData(response.data)
            })
        }

    }, [pagination.from, pagination.to, reunionData, status, type, date, reunionData])

    const handlePageChange = (event, page) => {
        const from = (page - 1) * pageSize
        const to = (page - 1) * pageSize + pageSize

        setPagination({ ...pagination, from: from, to: to })
    }

    return (
        <Box sx={{
            alignContent: 'center',
            justifyContent: 'center',
            display: 'flex',
            marginTop: '20px'
        }}>

            <Pagination
                count={Math.ceil(pagination.count / pageSize)}
                onChange={handlePageChange}
            />

        </Box>
    )
}
