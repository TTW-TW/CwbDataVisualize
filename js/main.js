
/** 串接邏輯 ⏳✅
 * 1. 監聽 submit ：取得使用者填寫資訊
 * 2. 取得氣象資料並存為物件 api ✅ apiGetWeatherC_B0027_001; 返還：原始資料
 * 3. 渲染表格
 *      渲染文字資料
 *      渲染表頭
 *      渲染物理量
 * 
 * 4. 監聽 change：取得使用者選擇的物理量
 * 5. 篩選並組成c3統計圖所需資料  ⏳ produceChartData (apiReturnData)
 * 6. 產製逐月折線圖  ✅ createLineChart(chartData)
 * 
 */
// console.log(global_cb0027_offset2)

// 全域變數
const apiBase = 'https://opendata.cwa.gov.tw/api/v1/rest/datastore/';
const apiKey = 'CWA-1F336FE0-2035-4D89-8AB5-133F39AC2235';
let apiReturnData ; // 儲存當次 api 返還的完整資料
let chartGraphic; // 把圖表擺在全域變數，可控制載入 or 純陣列更新

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
// api ： 取得氣象資料並存為物件 api
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

//apiGetWeatherC_B0027_001({Authorization, limit, offset, format, StationID, weatherElement, Month});


// 產製逐月折線圖

function createLineChart(chartData){

    if (!chartGraphic){
        // 如果是新載入網頁，chart還未被定義，才使用c3.generate生成
            chartGraphic = c3.generate({
            bindto: '#chartData',
            data: {
                columns: [
                    ['data1', 30, 200, 100, 400, 150, 250 , 30, 200, 100, 400, 150, 250] 
                ]
            },
            axis: {
                x: {
                    //show: true,
                    type: 'category',
                    categories: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
                }
            }
        });
    } else {
        // 如果chart已經生成，那只需要chart.load更新資料(減少效能))
        chartGraphic.load({
            columns:  ['data1', 30, 200, 100, 400, 150, 250 , 30, 200, 100, 400, 150, 250] , // 更新成新的數據
            unload: true // 因為數據來源變了，要卸卸載的數據
        });
    };
};

/** =====主程式 + 初始化======= */
(async function() {

    //  api ： 取得氣象資料並存為物件 api
    // await apiGetWeatherC_B0027_001({Authorization, limit, offset, format, StationID, weatherElement, Month});  // api：取得訂單列表 + 前端渲染

    createLineChart(chartData); // 產製逐月折線圖



})();
