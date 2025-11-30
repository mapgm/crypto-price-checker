document.addEventListener('DOMContentLoaded', function() {
  const searchBtn = document.getElementById('searchBtn');
  const input = document.getElementById('symbolInput');
  const resultArea = document.getElementById('resultArea');
  const priceDisplay = document.getElementById('priceDisplay');
  const symbolDisplay = document.getElementById('symbolDisplay');
  const errorMsg = document.getElementById('errorMsg');

  // API 基础地址
  const API_URL = 'https://api.binance.com/api/v3/ticker/price?symbol=';

  // 执行搜索
  function searchPrice() {
    let symbol = input.value.trim().toUpperCase();
    
    if (!symbol) return;

    // 默认添加 USDT 后缀（如果用户没输）
    if (!symbol.includes('USDT') && !symbol.includes('BUSD')) {
      symbol += 'USDT';
    }

    // 重置 UI 状态
    errorMsg.classList.add('hidden');
    resultArea.classList.add('hidden');
    searchBtn.textContent = '...';

    fetch(API_URL + symbol)
      .then(response => {
        if (!response.ok) {
          throw new Error('未找到该币种或网络错误');
        }
        return response.json();
      })
      .then(data => {
        // 格式化价格：保留合适的小数位
        const price = parseFloat(data.price);
        // 如果价格小于1，显示更多小数位，否则显示2位
        const formattedPrice = price < 1 ? price.toFixed(6) : price.toFixed(2);

        priceDisplay.textContent = `$${formattedPrice}`;
        symbolDisplay.textContent = data.symbol;
        
        resultArea.classList.remove('hidden');
      })
      .catch(err => {
        errorMsg.textContent = '❌ 找不到该代币 (请尝试 BTC)';
        errorMsg.classList.remove('hidden');
      })
      .finally(() => {
        searchBtn.textContent = '搜索';
      });
  }

  // 点击按钮事件
  searchBtn.addEventListener('click', searchPrice);

  // 回车键事件
  input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      searchPrice();
    }
  });
});