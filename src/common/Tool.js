let Tool = {
  // 工具函数, 使得echarts的线条能够适配
  // 适配2k屏
  jsNum: function(num) {
    let lenWindow = document.documentElement.clientWidth;
    let iWidth = lenWindow / 12;
    let fs = (num / 160) * iWidth;
    return fs;
  },
  // 适配4k屏
  jsNum4: function(num) {
    let lenWindow = document.documentElement.clientWidth;
    let iWidth = lenWindow / 12;
    let fs = (num / 320) * iWidth;
    return fs;
  }
};

export default Tool;
