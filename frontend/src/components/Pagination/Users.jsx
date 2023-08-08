import { Box, Pagination } from '@mui/material'
import { useEffect, useState } from 'react'
import { useSelector } from "react-redux"


export default function UsersPagination({ setUsersData }) {
    const { users } = useSelector((state) => state.admin)

    const service = {
        getData: ({ from, to }) => {
            return new Promise((resolve, reject) => {

                const data = users.slice(from, to)

                resolve({
                    count: users.length,
                    data: data
                })
            })
        }
    }

    const pageSize = 5

    const [pagination, setPagination] = useState({
        count: 0,
        from: 0,
        to: pageSize
    })

    useEffect(() => {
        service.getData({ from: pagination.from, to: pagination.to }).then(response => {
            setPagination({ ...pagination, count: response.count })

            setUsersData(response.data)
        })
    }, [pagination.from, pagination.to])

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