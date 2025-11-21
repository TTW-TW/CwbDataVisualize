
// 全域變數
const apiBase = 'https://opendata.cwa.gov.tw/api/v1/rest/datastore/';
const apiKey = 'CWA-1F336FE0-2035-4D89-8AB5-133F39AC2235';

// 錯誤訊息吐司參數
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  //timer: 4000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

let Authorization = 'CWA-1F336FE0-2035-4D89-8AB5-133F39AC2235';
let Month = 1;
let limit = null;
let offset = null;
let format = null;
let StationID = null;
let weatherElement = null;



// 串接 C-B0027-001 月平均-地面測站資料
async function apiGetWeatherC_B0027_001({Authorization, limit, offset, format, StationID, weatherElement, Month}){
    const apiCode = 'C-B0027-001/';
    //const apiUrlRequired = apiBase +  apiCode + '?Authorization=' + apiKey;
    const rawParameters = {Authorization, limit, offset, format, StationID, weatherElement, Month}; // 先傳入必要參數

    // 濾除掉 null 或 undefined 的參數
    const requestParameters = Object.fromEntries(
        // Object.entries ： {key1: value1 , key2: value2} into [[key1 , value1] , [key2 , value2] ]
        // Object.fromEntries ： [[key1 , value1] , [key2 , value2] ] into  {key1: value1 , key2: value2}

        // 過濾掉值為 null 或 undefined 的鍵值對
        Object.entries(rawParameters).filter(([key , value]) =>
            value != null && value != undefined 
        )
    );
    console.log('url ='+ apiBase +  apiCode)

    // API
    try {
        const response = await axios.get(apiBase +  apiCode , {
            params : requestParameters
        });
        const averageData = response.data;
        const averageDataHeader = response.data.result.fields;
        const averageDataValue = response.data.records.data.surfaceObs.location;
        console.log('averageDataHeader =' , averageDataHeader) ;
        console.log('averageDataValue =' , averageDataValue);

        return averageData;


    } catch (error) {

        let errorMessage = '發生未預期的錯誤';

        // 檢查是否有伺服器回傳的錯誤響應
        if (error.response) {
        // 伺服器有回傳的話，嘗試取出 error.response.data.message
        errorMessage = error.response.data.message || `API 錯誤 (狀態碼: ${error.response.status})`;
        } else if (error.request) {
        // 請求已發出但沒有收到回應 (例如：網路中斷)
        errorMessage = '網路錯誤或伺服器無回應';
        } else {
        // 發生了在設定請求時觸發的錯誤
        errorMessage = error.message;
        }

        Toast.fire({
            icon: "error",
            title: '取得api失敗',
            text: errorMessage,
            cancelButtonText: '關閉'
        });
        throw error;
    }
    
};

apiGetWeatherC_B0027_001({Authorization, limit, offset, format, StationID, weatherElement, Month});