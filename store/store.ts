import { createSlice, configureStore } from '@reduxjs/toolkit'
// 我们可以使用 useSelector 从 store 中读取数据，使用 useDispatch dispatch actions。
export const usernameSlice = createSlice({
    name: 'username',
    initialState: {
        value: ''
    },
    reducers: {
        changeName(state, username) {
            state.value = username.payload
        }
    }
})

export const { changeName } = usernameSlice.actions
export default usernameSlice.reducer



