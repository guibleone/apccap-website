import { Box, Pagination } from '@mui/material'
import { useEffect, useState } from 'react'
import { useSelector } from "react-redux"

export default function BalancosPagination({setSpreadSheetsData}) {

    const {spreadSheets} = useSelector((state) => state.spreadSheet)

    const service = {
        getData: ({ from, to }) => {
            return new Promise((resolve, reject) => {

                const data = spreadSheets.slice(from, to)

                resolve({
                    count: spreadSheets.length,
                    data: data
                })
            })
        }
    }

    const pageSize = 12

    const [pagination, setPagination] = useState({
        count: 0,
        from: 0,
        to: pageSize
    })

    useEffect(() => {
        service.getData({ from: pagination.from, to: pagination.to }).then(response => {
            setPagination({ ...pagination, count: response.count })

            setSpreadSheetsData(response.data)
        })
    }, [pagination.from, pagination.to, spreadSheets])


    const handlePageChange = (event, page) => {
        const from = (page - 1) * pageSize
        const to = (page - 1) * pageSize + pageSize

        setPagination({ ...pagination, from: from, to: to })
    }
    return (
        <Box sx={{
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            margin: 'auto',
            padding:'20px 0 72px 0',
        }}>

            <Pagination
                count={Math.ceil(pagination.count / pageSize)}
                onChange={handlePageChange}
            />

        </Box>
    )
}
