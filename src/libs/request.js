import axios from "axios";

const makeRequest = async (method, url, data) => {
  const headers = {
    "Content-Type": "application/json",
  }

  try {
    const res = await axios({
      method,
      url,
      data,
      headers,
    });
    return res.data;
  } catch (error) {
    if (error.response) {
      const { status } = error.response;
      switch (status) {
        case 401:
          console.error("401 Unauthorized - 未授權（請檢查登入狀態或 Token）");
          break;
        case 402:
          console.error("402 Payment Required - 需要付費");
          break;
        case 403:
          console.error("403 Forbidden - 拒絕訪問（權限不足）");
          break;
        case 404:
          console.error(`404 Not Found - 找不到資源: ${url}`);
          break;
        case 405:
          console.error("405 Method Not Allowed - 不允許的請求方法");
          break;
        case 500:
          console.error("500 Internal Server Error - 伺服器內部錯誤");
          break;
        default:
          console.error(`發生未知錯誤，狀態碼: ${status}`);
          break;
      }
    } else if (error.request) {
      console.error("未收到伺服器回應，請檢查網路連線");
    } else {
      console.error("請求設定時發生錯誤:", error.message);
    }

    // 將錯誤拋出，讓呼叫端也可以進行後續處理
    throw error;
  }
}

export default makeRequest;