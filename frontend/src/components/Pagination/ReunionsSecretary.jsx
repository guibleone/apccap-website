import { Box, Pagination } from '@mui/material'
import { useEffect, useState } from 'react'
import { useSelector } from "react-redux"


export default function ReunionPaginationSecretary({ setReunionData }) {

    const { reunionData } = useSelector((state) => state.reunions)

    const service = {
        getData: ({ from, to }) => {
            return new Promise((resolve, reject) => {
                
                const filteredData = reunionData
                    .filter((reunion) => reunion.status === 'concluida')
                    .sort((a, b) => new Date(a.date) - new Date(b.date));

                const data = filteredData.slice(from, to);

                resolve({
                    count: filteredData.length, 
                    data: data,
                });
            });
        },
    };

    const pageSize = 4;

    const [pagination, setPagination] = useState({
        count: 0, 
        from: 0,
        to: pageSize,
    });

    useEffect(() => {
        service.getData({ from: pagination.from, to: pagination.to }).then(response => {
            setPagination({ ...pagination, count: response.count })

            setReunionData(response.data)
        })
    }, [pagination.from, pagination.to, reunionData])

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
            margin: '20px 0'
        }}>

            <Pagination
                count={Math.ceil(pagination.count / pageSize)}
                onChange={handlePageChange}
            />

        </Box>
    )
}
