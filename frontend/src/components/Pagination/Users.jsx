import { Box, Pagination } from '@mui/material'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { listUsers } from '../../features/admin/adminSlice'


export default function UsersPagination({ setUsersData, status, productsQuantity }) {
    const dispatch = useDispatch()

    const { users } = useSelector((state) => state.admin)
    const { user } = useSelector((state) => state.auth)

    useEffect(() => {

        if (user && (user.role === "admin" || user.role === 'secretario' || user.role === 'presidente' || user.role === 'conselho')) {
            dispatch(listUsers(user.token))
        }

    }, [user])


    const service = {
        getData: ({ from, to }) => {
            return new Promise((resolve, reject) => {

                const data = users
                    .filter(user => (!status || user.status === status))
                    .filter(user => (productsQuantity ? user.productsQuantity >= 1 : user))
                    .slice(from, to)

                resolve({
                    count: users.length,
                    data: data
                })
            })
        }
    }

    const pageSize = 6

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
    }, [pagination.from, pagination.to, users])

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
