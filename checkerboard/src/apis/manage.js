import instance from './api/'; 

// 登录
export const loginUser = (loginData) => instance.post('login', loginData, { skipAuth: true });
// 用户信息
export const UserMessage = () => instance.get('user/userinfo');
// 获取总价值
export const GetAmountTotal = () => instance.get('amount/total');
// 获取棋盘信息，未登录状态下
export const BoardInfoNoLogin = (block_id) => instance.get(`boardInfo/${block_id}`,block_id, { skipAuth: true });
// 棋盘信息,登录状态下
export const BoardInfo = (block_id) => instance.get(`checkboard/boardInfo/${block_id}`,block_id)
// 单个格子信息
export const Board = (board_id) => instance.get(`checkboard/board?boardId=${board_id}`, { skipAuth: true })
// 押注记录
export const Record = () => instance.get(`checkboard/record`)
// 获取所有记录的前50条
export const Records = () => instance.get('records', { skipAuth: true })
// 修改用户信息
export const UpdateUserInfo = (param) => instance.put('user/put/userinfo',param)
// 抢占单个格子
export const SeizeGrid = (param) => instance.post('checkboard/betting',param)
// 用户充值记录
export const ReCharge = (param) => instance.post('user/recharge',param)
