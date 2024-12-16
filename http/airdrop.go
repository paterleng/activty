package http

// Airdrop 空投token，并返还用户剩余金额
func Airdrop(data [][]string) (err error) {
	/**
	1. 在内存中生成CSV
	*/
	//var csvBuffer bytes.Buffer
	//csvWriter := csv.NewWriter(&csvBuffer)
	//for _, d := range data {
	//	if err = csvWriter.Write(d); err != nil {
	//		return
	//	}
	//}
	//csvWriter.Flush() // 确保所有数据写入到缓冲区
	//if err := csvWriter.Error(); err != nil {
	//	return
	//}
	//// 2. 准备multipart请求体
	//body := &bytes.Buffer{}
	//writer := multipart.NewWriter(body)
	//
	//// 创建文件字段
	//part, err := writer.CreateFormFile("file", "test.csv")
	//if err != nil {
	//	return fmt.Errorf("创建文件字段失败: %w", err)
	//}
	//
	//// 将内存中的CSV内容写入到请求体
	//_, err = io.Copy(part, &csvBuffer)
	//if err != nil {
	//	return fmt.Errorf("写入请求体失败: %w", err)
	//}
	//
	//// 添加额外字段（如果需要）
	//_ = writer.WriteField("description", "This is an in-memory CSV file")
	//
	//// 关闭multipart writer
	//err = writer.Close()
	//if err != nil {
	//	return fmt.Errorf("关闭multipart writer失败: %w", err)
	//}
	//
	//// 3. 构建HTTP请求
	//req, err := http.NewRequest("POST", apiURL, body)
	//if err != nil {
	//	return fmt.Errorf("创建HTTP请求失败: %w", err)
	//}
	//req.Header.Set("Content-Type", writer.FormDataContentType())
	//
	//// 4. 发送请求
	//client := &http.Client{}
	//resp, err := client.Do(req)
	//if err != nil {
	//	return fmt.Errorf("发送HTTP请求失败: %w", err)
	//}
	//defer resp.Body.Close()
	//
	//// 检查响应状态
	//if resp.StatusCode != http.StatusOK {
	//	respBody, _ := io.ReadAll(resp.Body)
	//	return fmt.Errorf("服务器返回错误: 状态码=%d, 响应=%s", resp.StatusCode, respBody)
	//}
	//
	//fmt.Println("API响应成功")
	return err
}
