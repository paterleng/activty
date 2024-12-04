import instance from './api'; 

// 登录
export const loginUser = (loginData) => instance.post('user/login', loginData);
// 用户信息
export const UserMessage = () => instance.get('user/userinfo') 
// 棋盘信息
export const BoardInfo = (block_id) => instance.get(`checkboard/boardInfo/${block_id}`,block_id)
// 单个格子信息
export const Board = (board_id) => instance.get(`checkboard/board?boardId=${board_id}`)
// 押注记录
export const Record = (page,size) => instance.get(`checkboard/record?page=${page}&size=${size}`)
// 获取所有记录的前50条
export const Records = () => instance.get('checkboard/records')